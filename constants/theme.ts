import { typography } from '../styles/typography'

export const theme = {
  dark: {
    bgPrimary:   '#160C12',
    bgSecondary: '#24141C',
    cardSoft:    '#2E1821',
    accentRose:  '#C9847A',
    accentGold:  '#F0E0D6',
    accentSage:  '#A1B095',
    borderRose:  'rgba(201, 132, 122, 0.22)',
    borderSoft:  'rgba(240, 224, 214, 0.04)',
    textMuted:   'rgba(240, 224, 214, 0.55)',
    textPrimary: '#F0E0D6',
    shadow:      'rgba(0, 0, 0, 0.34)',
  },
  light: {
    bgPrimary:   '#FBF5F2',
    bgSecondary: '#FFFDFC',
    cardSoft:    '#FFF8F6',
    accentRose:  '#B56B6B',
    accentGold:  '#2D1D26',
    accentSage:  '#66785E',
    borderRose:  'rgba(181, 107, 107, 0.18)',
    borderSoft:  'rgba(45, 29, 38, 0.08)',
    textMuted:   'rgba(45, 29, 38, 0.55)',
    textPrimary: '#2D1D26',
    shadow:      'rgba(45, 29, 38, 0.08)',
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm:  10,
    md:  16,
    lg:  24,
    pill: 100,
  },
  fonts: {
    serif:        'CormorantGaramond-Regular',
    serifItalic:  'CormorantGaramond-Italic',
    serifSemiBold:'CormorantGaramond-SemiBold',
    sans:         'DMSans-Regular',
    sansMedium:   'DMSans-Medium',
    sansSemiBold: 'DMSans-SemiBold',
  },
  typography,
}

export type ThemeColors = typeof theme.dark