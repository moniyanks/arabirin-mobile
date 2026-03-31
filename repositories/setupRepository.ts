import { supabase } from '../lib/supabase'
import { AppError } from '../lib/errors/appError'
import type { AppMode } from '../constants/appMode'

function throwWriteError(message: string, cause: unknown): never {
  throw new AppError({
    code: 'DB_WRITE_FAILED',
    message,
    userMessage: 'We could not save your account setup right now.',
    cause,
    retryable: true,
  })
}

export type ConsentWriteInput = {
  privacyPolicyVersion: string
  termsVersion: string
  healthDataConsent: boolean
  ageConfirmed: boolean
  acceptedAt: string
  privacyViewed: boolean
  termsViewed: boolean
  privacyViewedAt: string
  termsViewedAt: string
  appPlatform: string
  appVersion: string
}

export type CompleteOnboardingRpcInput = {
  name: string
  mode: AppMode
  conditions: string[]
  cycleLength: number | null
  periodLength: number | null
  lastPeriodStartDate: string | null
}

export type NotificationPreferencesWriteInput = {
  remindersEnabled: boolean
  reminderTime: string | null
  reminderPhaseTypes: string[]
  notificationIds: string[]
  updatedAt: string
}

export const setupRepository = {
  async getCurrentUserId(): Promise<string> {
    const {
      data: { user },
      error,
    } = await supabase.auth.getUser()

    if (error || !user?.id) {
      throw new AppError({
        code: 'AUTH_REQUIRED',
        message: 'No authenticated user found during setup flow.',
        userMessage: 'Your session expired. Please sign in again.',
        cause: error,
        retryable: false,
      })
    }

    return user.id
  },

  async upsertConsent(userId: string, input: ConsentWriteInput): Promise<void> {
    const { error } = await supabase.from('user_consents').upsert(
      {
        user_id: userId,
        privacy_policy_version: input.privacyPolicyVersion,
        terms_version: input.termsVersion,
        health_data_consent: input.healthDataConsent,
        age_confirmed: input.ageConfirmed,
        accepted_at: input.acceptedAt,
        privacy_viewed: input.privacyViewed,
        terms_viewed: input.termsViewed,
        privacy_viewed_at: input.privacyViewedAt,
        terms_viewed_at: input.termsViewedAt,
        app_platform: input.appPlatform,
        app_version: input.appVersion,
      },
      { onConflict: 'user_id' }
    )

    if (error) {
      throwWriteError('Failed to upsert user consent.', error)
    }
  },

  async completeOnboarding(input: CompleteOnboardingRpcInput): Promise<void> {
    const { error } = await supabase.rpc('complete_onboarding', {
      p_name: input.name,
      p_mode: input.mode,
      p_conditions: input.conditions,
      p_cycle_length: input.cycleLength,
      p_period_length: input.periodLength,
      p_last_period_start_date: input.lastPeriodStartDate,
    })

    if (error) {
      throwWriteError('Failed to complete onboarding via RPC.', error)
    }
  },

  async updateNotificationPreferences(
    userId: string,
    input: NotificationPreferencesWriteInput
  ): Promise<void> {
    const { error } = await supabase
      .from('user_settings')
      .upsert(
        {
          user_id: userId,
          reminders_enabled: input.remindersEnabled,
          reminder_time: input.reminderTime,
          reminder_phase_types: input.reminderPhaseTypes,
          notification_ids: input.notificationIds,
          updated_at: input.updatedAt,
        },
        { onConflict: 'user_id' }
      )

    if (error) {
      throwWriteError('Failed to update notification preferences.', error)
    }
  },
}