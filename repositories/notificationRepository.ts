import { supabase } from '../lib/supabase'
import { AppError } from '../lib/errors/appError'
import {
  EMPTY_LOCAL_NOTIFICATION_STATE,
  type LocalNotificationState,
  type NotificationSyncRecord,
} from '../lib/notifications/notificationTypes'
import {
  normalizeNotificationSyncRecord,
  serializeNotificationSyncRecord,
} from '../lib/notifications/notificationMapper'

function throwReadError(message: string, cause: unknown): never {
  throw new AppError({
    code: 'DB_READ_FAILED',
    message,
    userMessage: 'We could not load your notification settings right now.',
    cause,
    retryable: true,
  })
}

function throwWriteError(message: string, cause: unknown): never {
  throw new AppError({
    code: 'DB_WRITE_FAILED',
    message,
    userMessage: 'We could not save your notification settings right now.',
    cause,
    retryable: true,
  })
}

export const notificationRepository = {
  async fetchNotificationSyncRecord(userId: string): Promise<NotificationSyncRecord> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('notification_ids')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) {
      throwReadError('Failed to fetch notification sync record.', error)
    }

    if (!data?.notification_ids) {
      return {
        pushToken: null,
        localState: EMPTY_LOCAL_NOTIFICATION_STATE,
      }
    }

    return normalizeNotificationSyncRecord(data.notification_ids)
  },

  async saveLocalNotificationState(
    userId: string,
    localState: LocalNotificationState
  ): Promise<void> {
    const current = await this.fetchNotificationSyncRecord(userId)

    const { error } = await supabase
      .from('user_settings')
      .update({
        notification_ids: serializeNotificationSyncRecord({
          pushToken: current.pushToken,
          localState,
        }),
      })
      .eq('user_id', userId)

    if (error) {
      throwWriteError('Failed to save local notification state.', error)
    }
  },

  async savePushToken(userId: string, pushToken: string | null): Promise<void> {
    const current = await this.fetchNotificationSyncRecord(userId)

    const { error } = await supabase
      .from('user_settings')
      .update({
        notification_ids: serializeNotificationSyncRecord({
          pushToken,
          localState: current.localState,
        }),
      })
      .eq('user_id', userId)

    if (error) {
      throwWriteError('Failed to save push token.', error)
    }
  },

  async clearNotificationState(userId: string): Promise<void> {
    const { error } = await supabase
      .from('user_settings')
      .update({
        notification_ids: serializeNotificationSyncRecord({
          pushToken: null,
          localState: EMPTY_LOCAL_NOTIFICATION_STATE,
        }),
      })
      .eq('user_id', userId)

    if (error) {
      throwWriteError('Failed to clear notification state.', error)
    }
  },
}