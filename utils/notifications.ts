import * as Notifications from 'expo-notifications'
import * as Device from 'expo-device'
import { Platform } from 'react-native'
import { supabase } from '../lib/supabase'
import {
  type AppMode,
  shouldScheduleFertilityReminder,
  shouldSchedulePeriodReminder,
} from '../constants/appMode'

// ── Notifications ─────────────────────────────────────────────────────────────────────

export type NotificationIds = {
  periodIds: string[]
  fertileId: string | null
  dailyId: string | null
}

// ── App-wide notification behaviour ───────────────────────────────────────────

Notifications.setNotificationHandler({
  handleNotification: async () => ({
    shouldShowAlert: true,
    shouldPlaySound: true,
    shouldSetBadge: false,
    shouldShowBanner: true,
    shouldShowList: true,
  }),
})

const ANDROID_CHANNEL_ID = 'default'
const DEFAULT_NOTIFICATION_HOUR = 9
const DAILY_LOG_HOUR = 20
const DAILY_LOG_MINUTE = 0

// ── Helpers ───────────────────────────────────────────────────────────────────

function parseLocalDate(dateStr: string): Date {
  const parts = dateStr.split('-')
  if (parts.length !== 3) {
    throw new Error(`Invalid date format: ${dateStr}`)
  }

  const [year, month, day] = parts.map(Number)

  if (
    !Number.isInteger(year) ||
    !Number.isInteger(month) ||
    !Number.isInteger(day)
  ) {
    throw new Error(`Invalid date values: ${dateStr}`)
  }

  const date = new Date(
    year,
    month - 1,
    day,
    DEFAULT_NOTIFICATION_HOUR,
    0,
    0,
    0
  )

  if (
    date.getFullYear() !== year ||
    date.getMonth() !== month - 1 ||
    date.getDate() !== day
  ) {
    throw new Error(`Invalid calendar date: ${dateStr}`)
  }

  return date
}
function toLocalDateString(date: Date = new Date()): string {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')

  return `${year}-${month}-${day}`
}

function daysBefore(date: Date, days: number): Date {
  const result = new Date(date)
  result.setDate(result.getDate() - days)
  return result
}

function isFutureDate(date: Date): boolean {
  return date.getTime() > Date.now()
}

function normalizeNotificationIds(value: unknown): NotificationIds | null {
  if (!value || typeof value !== 'object') return null

  const candidate = value as Partial<NotificationIds>

  return {
    periodIds: Array.isArray(candidate.periodIds)
      ? candidate.periodIds.filter((item): item is string => typeof item === 'string')
      : [],
    fertileId: typeof candidate.fertileId === 'string' ? candidate.fertileId : null,
    dailyId: typeof candidate.dailyId === 'string' ? candidate.dailyId : null,
  }
}

async function ensureAndroidChannel(): Promise<void> {
  if (Platform.OS !== 'android') return

  await Notifications.setNotificationChannelAsync(ANDROID_CHANNEL_ID, {
    name: 'Àràbìrín',
    importance: Notifications.AndroidImportance.MAX,
    vibrationPattern: [0, 250, 250, 250],
    enableVibrate: true,
    lockscreenVisibility: Notifications.AndroidNotificationVisibility.PUBLIC,
  })
}

async function scheduleOneTimeNotification(params: {
  title: string
  body: string
  date: Date
  screen?: 'calendar' | 'home'
}): Promise<string | null> {
  const { title, body, date, screen = 'calendar' } = params

  if (!isFutureDate(date)) return null

  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title,
        body,
        sound: true,
        data: { screen },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DATE,
        date,
      },
    })
  } catch (error) {
    console.error('Failed to schedule one-time notification:', error)
    return null
  }
}

// ── Push permissions and token registration ───────────────────────────────────

export async function registerForPushNotifications(): Promise<string | null> {
  try {
    if (!Device.isDevice) {
      console.warn('Push notifications require a physical device.')
      return null
    }

    await ensureAndroidChannel()

    const permissionResponse = await Notifications.getPermissionsAsync()
    let finalStatus = permissionResponse.status

    if (finalStatus !== 'granted') {
      const requestResponse = await Notifications.requestPermissionsAsync()
      finalStatus = requestResponse.status
    }

    if (finalStatus !== 'granted') {
      console.warn('Push notification permission not granted.')
      return null
    }

    const tokenResponse = await Notifications.getExpoPushTokenAsync()
    return tokenResponse.data
  } catch (error) {
    console.error('Failed to register for push notifications:', error)
    return null
  }
}

export async function savePushToken(token: string): Promise<boolean> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      console.error('Failed to fetch current user:', userError)
      return false
    }

    if (!user) {
      console.warn('No authenticated user found. Push token was not saved.')
      return false
    }

    const { data: existingSettings, error: loadError } = await supabase
      .from('user_settings')
      .select('notification_ids')
      .eq('user_id', user.id)
      .maybeSingle()

    if (loadError) {
      console.error('Failed to load existing notification IDs:', loadError)
      return false
    }

    const existingIds = normalizeNotificationIds(existingSettings?.notification_ids)

    const nextIds: NotificationIds = {
      periodIds: existingIds?.periodIds ?? [],
      fertileId: existingIds?.fertileId ?? null,
      dailyId: existingIds?.dailyId ?? null,
    }

    const mergedNotificationIds = {
      ...nextIds,
      pushToken: token,
    }

    const { error: upsertError } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          notification_ids: mergedNotificationIds,
        },
        { onConflict: 'user_id' }
      )

    if (upsertError) {
      console.error('Failed to save push token:', upsertError)
      return false
    }

    return true
  } catch (error) {
    console.error('Unexpected error while saving push token:', error)
    return false
  }
}

export async function registerAndSaveToken(): Promise<boolean> {
  const token = await registerForPushNotifications()
  if (!token) return false

  return await savePushToken(token)
}

// ── Notification ID persistence ───────────────────────────────────────────────

export async function saveNotificationIds(ids: NotificationIds): Promise<void> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      console.error('Failed to fetch current user while saving notification IDs:', userError)
      return
    }

    if (!user) return

    const { error: upsertError } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: user.id,
          notification_ids: ids,
        },
        { onConflict: 'user_id' }
      )

    if (upsertError) {
      console.error('Failed to save notification IDs:', upsertError)
    }
  } catch (error) {
    console.error('Unexpected error while saving notification IDs:', error)
  }
}

export async function loadNotificationIds(): Promise<NotificationIds | null> {
  try {
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError) {
      console.error('Failed to fetch current user while loading notification IDs:', userError)
      return null
    }

    if (!user) return null

    const { data, error: loadError } = await supabase
      .from('user_settings')
      .select('notification_ids')
      .eq('user_id', user.id)
      .maybeSingle()

    if (loadError) {
      console.error('Failed to load notification IDs:', loadError)
      return null
    }

    return normalizeNotificationIds(data?.notification_ids)
  } catch (error) {
    console.error('Unexpected error while loading notification IDs:', error)
    return null
  }
}

// ── Notification cancellation ─────────────────────────────────────────────────

export async function cancelScheduledNotificationsById(ids: string[]): Promise<void> {
  await Promise.allSettled(
    ids.map(async (id) => {
      try {
        await Notifications.cancelScheduledNotificationAsync(id)
      } catch (error) {
        console.error(`Failed to cancel notification ${id}:`, error)
      }
    })
  )
}

// ── Reminder scheduling ───────────────────────────────────────────────────────

export async function schedulePeriodReminder(nextPeriodDate: string): Promise<string[]> {
  try {
    const periodDate = parseLocalDate(nextPeriodDate)
    const threeDaysBefore = daysBefore(periodDate, 3)
    const oneDayBefore = daysBefore(periodDate, 1)

    const ids: string[] = []

    const id1 = await scheduleOneTimeNotification({
      title: 'Your period is coming 🌸',
      body: 'Based on your cycle, your period may start in 3 days.',
      date: threeDaysBefore,
      screen: 'calendar',
    })
    if (id1) ids.push(id1)

    const id2 = await scheduleOneTimeNotification({
      title: 'Your period may start tomorrow 🌙',
      body: 'How are you feeling? Log your symptoms to track your rhythm.',
      date: oneDayBefore,
      screen: 'calendar',
    })
    if (id2) ids.push(id2)

    return ids
  } catch (error) {
    console.error('Failed to schedule period reminders:', error)
    return []
  }
}

export async function scheduleFertileWindowReminder(
  fertileStart: string
): Promise<string | null> {
  try {
    const fertileDate = parseLocalDate(fertileStart)
    const dayBefore = daysBefore(fertileDate, 1)

    return await scheduleOneTimeNotification({
      title: 'Your fertile window starts tomorrow 🌿',
      body: 'Your most fertile days are approaching. Tap to view your calendar.',
      date: dayBefore,
      screen: 'calendar',
    })
  } catch (error) {
    console.error('Failed to schedule fertile window reminder:', error)
    return null
  }
}

export async function scheduleDailyLogReminder(): Promise<string | null> {
  try {
    return await Notifications.scheduleNotificationAsync({
      content: {
        title: 'How are you feeling today? 🌸',
        body: 'Take a moment to log your symptoms.',
        sound: true,
        data: {
          screen: 'calendar',
          date: toLocalDateString(),
          openSheet: true,
        },
      },
      trigger: {
        type: Notifications.SchedulableTriggerInputTypes.DAILY,
        hour: DAILY_LOG_HOUR,
        minute: DAILY_LOG_MINUTE,
      },
    })
  } catch (error) {
    console.error('Failed to schedule daily log reminder:', error)
    return null
  }
}

// ── Orchestration ─────────────────────────────────────────────────────────────

export async function rescheduleAllReminders(
  nextPeriodDate: string | null,
  fertileStart: string | null,
  mode: AppMode
): Promise<void> {
  try {
    const existing = await loadNotificationIds()

    const idsToCancel = [
      ...(existing?.periodIds ?? []),
      ...(existing?.fertileId ? [existing.fertileId] : []),
      ...(existing?.dailyId ? [existing.dailyId] : []),
    ]

    if (idsToCancel.length > 0) {
      await cancelScheduledNotificationsById(idsToCancel)
    }

    const periodIds =
      shouldSchedulePeriodReminder(mode) && nextPeriodDate
        ? await schedulePeriodReminder(nextPeriodDate)
        : []

    const fertileId =
      shouldScheduleFertilityReminder(mode) && fertileStart
        ? await scheduleFertileWindowReminder(fertileStart)
        : null

    const dailyId = await scheduleDailyLogReminder()

    await saveNotificationIds({
      periodIds,
      fertileId,
      dailyId,
    })
  } catch (error) {
    console.error('Failed to reschedule reminders:', error)
  }
}
export async function enableNotificationsForUser(params: {
  nextPeriodDate: string | null
  fertileStart: string | null
  mode: AppMode
}): Promise<boolean> {
  const registered = await registerAndSaveToken()
  if (!registered) return false

  await rescheduleAllReminders(
    params.nextPeriodDate,
    params.fertileStart,
    params.mode
  )

  return true
}

export async function disableAllReminders(): Promise<void> {
  try {
    const existing = await loadNotificationIds()

    const idsToCancel = [
      ...(existing?.periodIds ?? []),
      ...(existing?.fertileId ? [existing.fertileId] : []),
      ...(existing?.dailyId ? [existing.dailyId] : []),
    ]

    if (idsToCancel.length > 0) {
      await cancelScheduledNotificationsById(idsToCancel)
    }

    await saveNotificationIds({
      periodIds: [],
      fertileId: null,
      dailyId: null,
    })
  } catch (error) {
    console.error('Failed to disable reminders:', error)
  }
}