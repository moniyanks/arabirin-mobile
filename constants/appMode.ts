// constants/appMode.ts

export const APP_MODES = [
  'cycle',
  'ttc',
  'pregnant',
  'postpartum',
  'healing',
  'perimenopause',
] as const

export type AppMode = (typeof APP_MODES)[number]

export const DEFAULT_APP_MODE: AppMode = 'cycle'

export function isAppMode(value: unknown): value is AppMode {
  return typeof value === 'string' && APP_MODES.includes(value as AppMode)
}

export function normalizeAppMode(value: unknown): AppMode {
  return isAppMode(value) ? value : DEFAULT_APP_MODE
}

export function shouldSchedulePeriodReminder(mode: AppMode): boolean {
  return mode === 'cycle' || mode === 'ttc'
}

export function shouldScheduleFertilityReminder(mode: AppMode): boolean {
  return mode === 'ttc'
}

export function supportsCyclePredictions(mode: AppMode): boolean {
  return mode === 'cycle' || mode === 'ttc'
}