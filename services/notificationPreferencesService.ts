import { setupRepository } from '../repositories/setupRepository'
import { appDataRepository } from '../repositories/appDataRepository'
import { AppError, toAppError } from '../lib/errors/appError'
import { normalizeAppMode } from '../constants/appMode'
import { getNextPeriodDate, getFertileWindow } from '../utils/cycleHelper'
import { notificationService } from './notificationService'

export type UpdateReminderPreferencesInput = {
  remindersEnabled: boolean
  reminderTime: string | null
  reminderPhaseTypes: string[]
  existingNotificationIds: string[]
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

function validatePhaseTypes(values: string[]): string[] {
  return Array.from(new Set(values.map((value) => value.trim()).filter(Boolean)))
}

export const notificationPreferencesService = {
  async updateReminderPreferences(
    input: UpdateReminderPreferencesInput
  ): Promise<{ notificationIds: string[] }> {
    try {
      const userId = await setupRepository.getCurrentUserId()

      const reminderTime = validateReminderTime(input.reminderTime)
      const reminderPhaseTypes = validatePhaseTypes(input.reminderPhaseTypes)
      const existingNotificationIds = Array.from(
        new Set(input.existingNotificationIds.filter(Boolean))
      )

      const [profile, settings, periods] = await Promise.all([
        appDataRepository.fetchProfile(userId),
        appDataRepository.fetchSettings(userId),
        appDataRepository.fetchPeriods(userId),
      ])

      const mode = normalizeAppMode(profile?.mode)
      const cycleLength = profile?.cycle_length ?? 28

      const nextPeriodStart = getNextPeriodDate(periods, cycleLength)
      const fertile = getFertileWindow(periods, cycleLength)

      const notificationIds = await notificationService.applyPreferences(
        userId,
        {
          nextPeriodStart,
          fertileStart: fertile?.fertileStart ?? null,
        },
        mode,
        {
          remindersEnabled: input.remindersEnabled,
          reminderTime,
          reminderPhaseTypes,
          existingNotificationIds,
          dailyRemindersEnabled: settings?.daily_reminders_enabled ?? false,
        }
      )

      return { notificationIds }
    } catch (error) {
      throw toAppError(error, {
        code: 'DB_WRITE_FAILED',
        userMessage: 'We could not update your reminder settings right now.',
        retryable: true,
      })
    }
  },
}