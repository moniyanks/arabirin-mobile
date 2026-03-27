import { typography } from '../styles/typography'

export const theme = {
 dark: {
    bgPrimary: '#140B12',
    bgSecondary: '#2A1821',
    accentRose: '#D89A9F',
    accentGold: '#F7EDE4',
    accentSage: '#A1B095',
    borderRose: 'rgba(216, 154, 159, 0.22)',
    textMuted: 'rgba(247, 237, 228, 0.62)',
    textPrimary: '#F7EDE4',
    shadow: 'rgba(0, 0, 0, 0.34)',
  },
  light: {
    bgPrimary: '#FBF5F2',
    bgSecondary: '#FFFDFC',
    accentRose: '#B56B6B',
    accentGold: '#2D1D26',
    accentSage: '#66785E',
    borderRose: 'rgba(181, 107, 107, 0.18)',
    textMuted: 'rgba(45, 29, 38, 0.55)',
    textPrimary: '#2D1D26',
    shadow: 'rgba(45, 29, 38, 0.08)',
  },
  spacing: {
    xs: 6,
    sm: 10,
    md: 16,
    lg: 24,
    xl: 32,
  },
  radius: {
    sm: 10,
    md: 16,
    lg: 24,
  },
  fonts: {
    serif: 'CormorantGaramond-Regular',
    serifItalic: 'CormorantGaramond-Italic',
    serifSemiBold: 'CormorantGaramond-SemiBold',
    sans: 'DMSans-Regular',
    sansMedium: 'DMSans-Medium',
    sansSemiBold: 'DMSans-SemiBold',
  },
  typography,
}

export type ThemeColors = typeof theme.dark