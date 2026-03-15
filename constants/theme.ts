export const theme = {
  dark: {
    bgPrimary: '#1A0F17',
    bgSecondary: '#2D1D26',
    accentRose: '#D99B9B',
    accentGold: '#F3E5D8',
    accentSage: '#9BA88D',
    borderRose: 'rgba(217, 155, 155, 0.2)',
    textMuted: 'rgba(243, 229, 216, 0.5)',
    textPrimary: '#F3E5D8',
    shadow: 'rgba(0, 0, 0, 0.3)',
  },
  light: {
    bgPrimary: '#FFFFFF',
    bgSecondary: '#F7F0EC',
    accentRose: '#B56B6B',
    accentGold: '#2D1D26',
    accentSage: '#5C6E52',
    borderRose: 'rgba(181, 107, 107, 0.25)',
    textMuted: 'rgba(45, 29, 38, 0.5)',
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
}

export type ThemeColors = typeof theme.dark
