import { isValid, parseISO } from 'date-fns'

import { supportsCyclePredictions, type AppMode } from '../constants/appMode'
import { AppError, toAppError } from '../lib/errors/appError'
import { setupRepository } from '../repositories/setupRepository'

export type SubmitConsentInput = {
  privacyViewedAt: string
  termsViewedAt: string
  appPlatform: string
  appVersion: string
}

export type CompleteOnboardingInput = {
  name: string
  mode: AppMode
  conditions: string[]
  cycleLength: number | null
  periodLength: number | null
  lastPeriodStartDate: string | null
}

function normalizeName(value: string): string {
  return value.trim().replace(/\s+/g, ' ')
}

function validateName(name: string): string {
  const normalized = normalizeName(name)

  if (normalized.length < 2) {
    throw new AppError({
      code: 'VALIDATION_ERROR',
      message: 'Onboarding name must be at least 2 characters.',
      userMessage: 'Please enter your first name.',
      retryable: false,
    })
  }

  return normalized
}

function validateConditions(conditions: string[]): string[] {
  return Array.from(new Set(conditions.map((value) => value.trim()).filter(Boolean)))
}

function validateCycleLength(value: number | null): number | null {
  if (value === null) return null

  if (!Number.isFinite(value) || value < 15 || value > 90) {
    throw new AppError({
      code: 'VALIDATION_ERROR',
      message: 'Cycle length must be between 15 and 90 days.',
      userMessage: 'Enter a valid cycle length between 15 and 90 days.',
      retryable: false,
    })
  }

  return value
}

function validatePeriodLength(value: number | null): number | null {
  if (value === null) return null

  if (!Number.isFinite(value) || value < 1 || value > 15) {
    throw new AppError({
      code: 'VALIDATION_ERROR',
      message: 'Period length must be between 1 and 15 days.',
      userMessage: 'Enter a valid period length.',
      retryable: false,
    })
  }

  return value
}

function validateDateOnly(value: string | null): string | null {
  if (value === null) return null

  const parsed = parseISO(value)

  if (!isValid(parsed)) {
    throw new AppError({
      code: 'DATE_ERROR',
      message: `Invalid date-only value: "${value}"`,
      userMessage: 'Please choose a valid date.',
      retryable: false,
    })
  }

  return value
}

export const setupFlowService = {
  async submitConsent(input: SubmitConsentInput): Promise<void> {
    try {
      const userId = await setupRepository.getCurrentUserId()
      const now = new Date().toISOString()

      await setupRepository.upsertConsent(userId, {
        privacyPolicyVersion: 'v1',
        termsVersion: 'v1',
        healthDataConsent: true,
        ageConfirmed: true,
        acceptedAt: now,
        privacyViewed: true,
        termsViewed: true,
        privacyViewedAt: input.privacyViewedAt,
        termsViewedAt: input.termsViewedAt,
        appPlatform: input.appPlatform,
        appVersion: input.appVersion,
      })
    } catch (error) {
      throw toAppError(error, {
        code: 'DB_WRITE_FAILED',
        userMessage: 'We could not save your consent right now.',
        retryable: true,
      })
    }
  },

  async completeOnboarding(input: CompleteOnboardingInput): Promise<void> {
    try {
      const mode = input.mode
      const name = validateName(input.name)
      const conditions = validateConditions(input.conditions)
      const needsPredictions = supportsCyclePredictions(mode)

      const cycleLength = needsPredictions ? validateCycleLength(input.cycleLength) : null
      const periodLength = needsPredictions ? validatePeriodLength(input.periodLength) : null
      const lastPeriodStartDate = needsPredictions
        ? validateDateOnly(input.lastPeriodStartDate)
        : null

      if (needsPredictions && !lastPeriodStartDate) {
        throw new AppError({
          code: 'VALIDATION_ERROR',
          message: 'A last period start date is required for predictive modes.',
          userMessage: 'Please choose when your last period started.',
          retryable: false,
        })
      }

      await setupRepository.completeOnboarding({
        name,
        mode,
        conditions,
        cycleLength,
        periodLength,
        lastPeriodStartDate,
      })
    } catch (error) {
      throw toAppError(error, {
        code: 'DB_WRITE_FAILED',
        userMessage: 'We could not complete your account setup right now.',
        retryable: true,
      })
    }
  },
}