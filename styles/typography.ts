import { TextStyle } from 'react-native'

type TypographyScale = {
  displayLg: TextStyle
  displayMd: TextStyle
  titleLg: TextStyle
  titleMd: TextStyle
  bodyLg: TextStyle
  bodyMd: TextStyle
  bodySm: TextStyle
  label: TextStyle
  button: TextStyle
}

export const typography: TypographyScale = {
  displayLg: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: 30,
    lineHeight: 36,
  },
  displayMd: {
    fontFamily: 'CormorantGaramond-SemiBold',
    fontSize: 24,
    lineHeight: 30,
  },
  titleLg: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 18,
    lineHeight: 24,
  },
  titleMd: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 16,
    lineHeight: 22,
  },
  bodyLg: {
    fontFamily: 'DMSans-Regular',
    fontSize: 16,
    lineHeight: 24,
  },
  bodyMd: {
    fontFamily: 'DMSans-Regular',
    fontSize: 14,
    lineHeight: 22,
  },
  bodySm: {
    fontFamily: 'DMSans-Regular',
    fontSize: 12,
    lineHeight: 18,
  },
  label: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 11,
    lineHeight: 16,
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  button: {
    fontFamily: 'DMSans-SemiBold',
    fontSize: 14,
    lineHeight: 20,
  },
}