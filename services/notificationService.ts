import * as Notifications from 'expo-notifications'

import { supabase } from '../lib/supabase'
import { AppError, toAppError } from '../lib/errors/appError'
import { setupRepository } from '../repositories/setupRepository'
import type { AppMode } from '../constants/appMode'

export type ReminderMode = AppMode

export type ReminderTimeline = {
  nextPeriodStart: string | null
  fertileStart: string | null
}

export type ReminderPreferences = {
  remindersEnabled: boolean
  reminderTime: string | null
  reminderPhaseTypes: string[]
  existingNotificationIds: string[]
  dailyRemindersEnabled: boolean
}

type StoredReminderSettingsRow = {
  reminders_enabled: boolean | null
  reminder_time: string | null
  reminder_phase_types: string[] | null
  notification_ids: string[] | null
  daily_reminders_enabled: boolean | null
}

function validateReminderTime(value: string | null): string | null {
  if (value === null) return null

  const normalized = value.trim()
  const isValid = /^([01]\d|2[0-3]):([0-5]\d)$/.test(normalized)

  if (!isValid) {
    throw new AppError({
      code: 'VALIDATION_ERROR',
      message: `Invalid reminder time: "${value}"`,
      userMessage: 'Please select a valid reminder time.',
      retryable: false,
    })
  }

  return normalized
}

function normalizePhaseTypes(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)))
}

function parseReminderTime(value: string): { hour: number; minute: number } {
  const [hourText, minuteText] = value.split(':')
  const hour = Number(hourText)
  const minute = Number(minuteText)

  if (!Number.isInteger(hour) || !Number.isInteger(minute)) {
    throw new AppError({
      code: 'VALIDATION_ERROR',
      message: `Failed to parse reminder time "${value}"`,
      userMessage: 'Please select a valid reminder time.',
      retryable: false,
    })
  }

  return { hour, minute }
}

function buildDateTrigger(dateOnly: string, reminderTime: string) {
  const { hour, minute } = parseReminderTime(reminderTime)
  const [yearText, monthText, dayText] = dateOnly.split('-')

  const year = Number(yearText)
  const month = Number(monthText)
  const day = Number(dayText)

  const scheduledAt = new Date(year, month - 1, day, hour, minute, 0, 0)

  if (Number.isNaN(scheduledAt.getTime())) {
    throw new AppError({
      code: 'DATE_ERROR',
      message: `Invalid schedule date "${dateOnly}"`,
      userMessage: 'We could not calculate your reminder schedule.',
      retryable: false,
    })
  }

  return {
    scheduledAt,
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DATE,
      date: scheduledAt,
    } as Notifications.NotificationTriggerInput,
  }
}

function isFutureDate(date: Date): boolean {
  return date.getTime() > Date.now()
}

function shouldSchedulePhase(reminderPhaseTypes: string[], phase: 'period' | 'fertile') {
  if (reminderPhaseTypes.length === 0) {
    return true
  }

  return reminderPhaseTypes.includes(phase)
}

function buildPeriodReminderContent(mode: ReminderMode) {
  if (mode === 'ttc') {
    return {
      title: 'Àràbìrín',
      body: 'Your next cycle may be starting around today. Check in with your body.',
    }
  }

  return {
    title: 'Àràbìrín',
    body: 'Your next period may be starting around today. Take a moment to check in.',
  }
}

function buildFertileReminderContent(mode: ReminderMode) {
  if (mode === 'ttc') {
    return {
      title: 'Àràbìrín',
      body: 'Your fertile window may be starting around today.',
    }
  }

  return {
    title: 'Àràbìrín',
    body: 'Your fertile window may be starting around today.',
  }
}

async function requestNotificationPermissionIfNeeded(): Promise<void> {
  const current = await Notifications.getPermissionsAsync()

  if (current.granted) {
    return
  }

  const requested = await Notifications.requestPermissionsAsync()

  if (!requested.granted) {
    throw new AppError({
      code: 'PERMISSION_DENIED',
      message: 'Notification permission was denied.',
      userMessage: 'Notifications are turned off. Please enable them in your device settings.',
      retryable: false,
    })
  }
}

async function cancelScheduledNotifications(ids: string[]): Promise<void> {
  await Promise.all(
    ids.map(async (id) => {
      try {
        await Notifications.cancelScheduledNotificationAsync(id)
      } catch {
        // Stale local IDs are safe to ignore.
      }
    })
  )
}

async function fetchStoredReminderSettings(userId: string): Promise<ReminderPreferences> {
  const { data, error } = await supabase
    .from('user_settings')
    .select(
      'reminders_enabled, reminder_time, reminder_phase_types, notification_ids, daily_reminders_enabled'
    )
    .eq('user_id', userId)
    .maybeSingle<StoredReminderSettingsRow>()

  if (error) {
    throw new AppError({
      code: 'DB_READ_FAILED',
      message: 'Failed to load stored reminder settings.',
      userMessage: 'We could not load your reminder settings right now.',
      cause: error,
      retryable: true,
    })
  }

  return {
    remindersEnabled: data?.reminders_enabled ?? false,
    reminderTime: validateReminderTime(data?.reminder_time ?? null),
    reminderPhaseTypes: normalizePhaseTypes(data?.reminder_phase_types ?? []),
    existingNotificationIds: Array.from(new Set((data?.notification_ids ?? []).filter(Boolean))),
    dailyRemindersEnabled: data?.daily_reminders_enabled ?? false,
  }
}

async function persistNotificationState(
  userId: string,
  preferences: ReminderPreferences,
  notificationIds: string[]
): Promise<void> {
  await setupRepository.updateNotificationPreferences(userId, {
    remindersEnabled: preferences.remindersEnabled,
    reminderTime: preferences.reminderTime,
    reminderPhaseTypes: preferences.reminderPhaseTypes,
    notificationIds,
    updatedAt: new Date().toISOString(),
  })
}

async function scheduleDailyReminder(reminderTime: string): Promise<string> {
  const { hour, minute } = parseReminderTime(reminderTime)

  return Notifications.scheduleNotificationAsync({
    content: {
      title: 'Àràbìrín',
      body: 'Take a moment to check in with your body today.',
      sound: true,
    },
    trigger: {
      type: Notifications.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  })
}

async function scheduleDateReminder(params: {
  title: string
  body: string
  dateOnly: string
  reminderTime: string
}): Promise<string | null> {
  const { scheduledAt, trigger } = buildDateTrigger(params.dateOnly, params.reminderTime)

  if (!isFutureDate(scheduledAt)) {
    return null
  }

  const id = await Notifications.scheduleNotificationAsync({
    content: {
      title: params.title,
      body: params.body,
      sound: true,
    },
    trigger,
  })

  return id
}

export const notificationService = {
  async clearAllLocalSchedules(idsOrUserId: string[] | string): Promise<void> {
    try {
      const ids = Array.isArray(idsOrUserId)
        ? idsOrUserId
        : (await fetchStoredReminderSettings(idsOrUserId)).existingNotificationIds

      await cancelScheduledNotifications(ids)
    } catch (error) {
      throw toAppError(error, {
        code: 'DB_WRITE_FAILED',
        userMessage: 'We could not clear your reminders right now.',
        retryable: true,
      })
    }
  },

  async applyPreferences(
    userId: string,
    timeline: ReminderTimeline,
    mode: ReminderMode,
    preferences: ReminderPreferences
  ): Promise<string[]> {
    try {
      const normalizedPreferences: ReminderPreferences = {
        remindersEnabled: preferences.remindersEnabled,
        reminderTime: validateReminderTime(preferences.reminderTime),
        reminderPhaseTypes: normalizePhaseTypes(preferences.reminderPhaseTypes),
        existingNotificationIds: Array.from(
          new Set(preferences.existingNotificationIds.filter(Boolean))
        ),
        dailyRemindersEnabled: preferences.dailyRemindersEnabled,
      }

      await cancelScheduledNotifications(normalizedPreferences.existingNotificationIds)

      if (!normalizedPreferences.remindersEnabled) {
        await persistNotificationState(userId, normalizedPreferences, [])
        return []
      }

      if (!normalizedPreferences.reminderTime) {
        throw new AppError({
          code: 'VALIDATION_ERROR',
          message: 'Reminder time is required when reminders are enabled.',
          userMessage: 'Please select a reminder time.',
          retryable: false,
        })
      }

      await requestNotificationPermissionIfNeeded()

      const nextNotificationIds: string[] = []

      if (normalizedPreferences.dailyRemindersEnabled) {
        const dailyReminderId = await scheduleDailyReminder(normalizedPreferences.reminderTime)
        nextNotificationIds.push(dailyReminderId)
      }

      if (
        timeline.nextPeriodStart &&
        shouldSchedulePhase(normalizedPreferences.reminderPhaseTypes, 'period')
      ) {
        const periodContent = buildPeriodReminderContent(mode)
        const periodReminderId = await scheduleDateReminder({
          title: periodContent.title,
          body: periodContent.body,
          dateOnly: timeline.nextPeriodStart,
          reminderTime: normalizedPreferences.reminderTime,
        })

        if (periodReminderId) {
          nextNotificationIds.push(periodReminderId)
        }
      }

      if (
        timeline.fertileStart &&
        shouldSchedulePhase(normalizedPreferences.reminderPhaseTypes, 'fertile')
      ) {
        const fertileContent = buildFertileReminderContent(mode)
        const fertileReminderId = await scheduleDateReminder({
          title: fertileContent.title,
          body: fertileContent.body,
          dateOnly: timeline.fertileStart,
          reminderTime: normalizedPreferences.reminderTime,
        })

        if (fertileReminderId) {
          nextNotificationIds.push(fertileReminderId)
        }
      }

      await persistNotificationState(userId, normalizedPreferences, nextNotificationIds)

      return nextNotificationIds
    } catch (error) {
      throw toAppError(error, {
        code: 'DB_WRITE_FAILED',
        userMessage: 'We could not update your reminder settings right now.',
        retryable: true,
      })
    }
  },

  async rescheduleFromStoredSettings(
    userId: string,
    timeline: ReminderTimeline,
    mode: ReminderMode,
    dailyRemindersEnabledOverride?: boolean
  ): Promise<string[]> {
    try {
      const storedPreferences = await fetchStoredReminderSettings(userId)

      return await this.applyPreferences(userId, timeline, mode, {
        ...storedPreferences,
        dailyRemindersEnabled:
          dailyRemindersEnabledOverride ?? storedPreferences.dailyRemindersEnabled,
      })
    } catch (error) {
      throw toAppError(error, {
        code: 'DB_WRITE_FAILED',
        userMessage: 'We could not refresh your reminders right now.',
        retryable: true,
      })
    }
  },
}