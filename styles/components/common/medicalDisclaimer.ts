import { StyleSheet } from 'react-native'
import { theme } from '../..'

export function makeMedicalDisclaimerStyles(colors: any) {
  return StyleSheet.create({
    wrap: {
      marginTop: 8,
      marginBottom: 14,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 14,
      backgroundColor: 'rgba(217,155,155,0.06)',
      borderWidth: 1,
      borderColor: 'rgba(217,155,155,0.12)',
    },

    text: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      lineHeight: 18,
      color: colors.textMuted,
    },
  })
}