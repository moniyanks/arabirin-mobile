import type { AppMode } from '../../constants/appMode'

export type ReminderMode = AppMode

export type LocalNotificationState = {
  periodReminderIds: string[]
  fertileReminderId: string | null
  dailyReminderId: string | null
}

export type NotificationSyncRecord = {
  pushToken: string | null
  localState: LocalNotificationState
}

export const EMPTY_LOCAL_NOTIFICATION_STATE: LocalNotificationState = {
  periodReminderIds: [],
  fertileReminderId: null,
  dailyReminderId: null,
}