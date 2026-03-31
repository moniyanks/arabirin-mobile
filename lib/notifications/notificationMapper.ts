import {
  EMPTY_LOCAL_NOTIFICATION_STATE,
  type LocalNotificationState,
  type NotificationSyncRecord,
} from './notificationTypes'

type UnknownNotificationBlob = unknown

export function normalizeLocalNotificationState(
  value: UnknownNotificationBlob
): LocalNotificationState {
  if (!value || typeof value !== 'object') {
    return EMPTY_LOCAL_NOTIFICATION_STATE
  }

  const source = value as Record<string, unknown>

  const rawPeriodIds =
    source.periodReminderIds ?? source.periodIds ?? source.period_reminder_ids

  const rawFertileId =
    source.fertileReminderId ?? source.fertileId ?? source.fertile_reminder_id

  const rawDailyId =
    source.dailyReminderId ?? source.dailyId ?? source.daily_reminder_id

  return {
    periodReminderIds: Array.isArray(rawPeriodIds)
      ? rawPeriodIds.filter((id): id is string => typeof id === 'string')
      : [],
    fertileReminderId: typeof rawFertileId === 'string' ? rawFertileId : null,
    dailyReminderId: typeof rawDailyId === 'string' ? rawDailyId : null,
  }
}

export function extractPushToken(value: UnknownNotificationBlob): string | null {
  if (!value || typeof value !== 'object') {
    return null
  }

  const source = value as Record<string, unknown>
  const raw = source.pushToken ?? source.push_token

  return typeof raw === 'string' ? raw : null
}

export function normalizeNotificationSyncRecord(
  value: UnknownNotificationBlob
): NotificationSyncRecord {
  return {
    pushToken: extractPushToken(value),
    localState: normalizeLocalNotificationState(value),
  }
}

export function serializeNotificationSyncRecord(
  record: NotificationSyncRecord
): Record<string, unknown> {
  return {
    pushToken: record.pushToken,
    periodReminderIds: record.localState.periodReminderIds,
    fertileReminderId: record.localState.fertileReminderId,
    dailyReminderId: record.localState.dailyReminderId,
  }
}