import type { AppMode } from '../../constants/appMode'
import type { Profile, Period, SymptomLog } from '../../types/appData'

export type HomeShortcut = {
  key: string
  label: string
  icon: string
}

export type HomeQuickActionIcon = 'calendar' | 'heart' | 'activity' | 'moon'

export type HomeQuickAction = {
  key: string
  title: string
  subtitle: string
  route: string
  icon: HomeQuickActionIcon
}

export type HomePrimaryAction = {
  label: string
  route: string
}

export type HomeRhythm = {
  count: number
  status: 'active' | 'grace' | 'inactive'
  title: string
  subtitle: string
  lastLoggedDate: string | null
  hasCheckedInToday: boolean
}

export type HomeHero =
  | {
      kind: 'cycle'
      badge: string
      title: string
      subtitle?: string
      meta?: string
      ringLabel?: string
      ringStatus?: string
      ringProgress?: number
    }
  | {
      kind: 'ttc'
      badge: string
      title: string
      subtitle?: string
      meta?: string
      confidenceLabel?: string
    }
  | {
      kind: 'pregnancy'
      badge: string
      title: string
      subtitle?: string
      meta?: string
    }
  | {
      kind: 'generic'
      badge: string
      title: string
      subtitle?: string
      meta?: string
    }

export type HomeInsight = {
  title: string
  message: string
}

export type HomeEmptyState = {
  title: string
  description: string
  ctaLabel: string
}

export type HomeSection =
  | { type: 'hero' }
  | { type: 'noticeToday' }
  | { type: 'primaryAction' }
  | { type: 'insight' }
  | { type: 'shortcuts' }
  | { type: 'quickActions' }
  | { type: 'sistersPreview' }
  | { type: 'disclaimer' }

export type HomeViewModel = {
  mode: AppMode
  greeting: string
  contextLabel: string
  hero: HomeHero | null
  insight: HomeInsight | null
  noticeToday: string[]
  rhythm: HomeRhythm
  primaryAction: HomePrimaryAction
  shortcuts: HomeShortcut[]
  quickActions: HomeQuickAction[]
  sections: HomeSection[]
  showSistersPreview: boolean
  showDisclaimer: boolean
  emptyState: HomeEmptyState | null
}

export type BuildHomeViewModelParams = {
  profile: Profile
  periods: Period[]
  symptomLogs: SymptomLog[]
  cycleLength: number
  periodLength: number
}