import type { AppMode } from '../constants/appMode'

export function showsCycleEducation(mode: AppMode) {
  return mode === 'cycle' || mode === 'ttc' || mode === 'perimenopause'
}

export function showsFertilityIntelligence(mode: AppMode) {
  return mode === 'ttc'
}

export function showsCycleEmptyState(mode: AppMode, periodsCount: number) {
  return showsCycleEducation(mode) && periodsCount === 0
}

export function showsConditionIntelligence(_mode: AppMode) {
  // Keep broad for now — can refine later
  return true
}