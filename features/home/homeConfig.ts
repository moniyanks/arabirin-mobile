import type { AppMode } from '../../constants/appMode'
import type { HomeQuickAction, HomeSection } from './types'

type ModeHomeConfig = {
  showDisclaimer: boolean
  showSistersPreview: boolean
  sections: HomeSection[]
  quickActions: HomeQuickAction[]
}

const defaultQuickActions: HomeQuickAction[] = [
  {
    key: 'cycle-history',
    title: 'Cycle History',
    subtitle: 'History & logs',
    route: '/(tabs)/calendar',
    icon: 'calendar',
  },
  {
    key: 'health',
    title: 'Health',
    subtitle: 'Explore factors',
    route: '/(tabs)/health',
    icon: 'heart',
  },
  {
    key: 'body-insights',
    title: 'Body Insights',
    subtitle: 'See patterns',
    route: '/(tabs)/insights',
    icon: 'activity',
  },
  {
    key: 'sisters-circle',
    title: "Sister’s Circle",
    subtitle: 'Community support',
    route: '/(tabs)/sisters',
    icon: 'moon',
  },
]

const defaultSections: HomeSection[] = [
  { type: 'hero' },
  { type: 'noticeToday' },
  { type: 'primaryAction' },
  { type: 'insight' },
  { type: 'shortcuts' },
  { type: 'quickActions' },
  { type: 'sistersPreview' },
]

export const HOME_CONFIG: Record<AppMode, ModeHomeConfig> = {
  cycle: {
    showDisclaimer: false,
    showSistersPreview: true,
    sections: defaultSections,
    quickActions: defaultQuickActions,
  },
  ttc: {
    showDisclaimer: false,
    showSistersPreview: true,
    sections: defaultSections,
    quickActions: defaultQuickActions,
  },
  pregnant: {
    showDisclaimer: false,
    showSistersPreview: true,
    sections: defaultSections,
    quickActions: defaultQuickActions,
  },
  postpartum: {
    showDisclaimer: false,
    showSistersPreview: true,
    sections: defaultSections,
    quickActions: defaultQuickActions,
  },
  healing: {
    showDisclaimer: false,
    showSistersPreview: true,
    sections: defaultSections,
    quickActions: defaultQuickActions,
  },
  perimenopause: {
    showDisclaimer: false,
    showSistersPreview: true,
    sections: defaultSections,
    quickActions: defaultQuickActions,
  },
}