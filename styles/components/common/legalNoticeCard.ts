import { StyleSheet } from 'react-native'
import { theme } from '../..'

export function makeLegalNoticeCardStyles(colors: any) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.bgSecondary,
      borderWidth: 1,
      borderColor: colors.borderRose,
      borderRadius: 20,
      paddingHorizontal: 18,
      paddingVertical: 18,
      marginBottom: 18,
    },

    title: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 20,
      color: colors.accentGold,
      marginBottom: 6,
    },

    subtitle: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      lineHeight: 19,
      color: colors.textMuted,
      marginBottom: 14,
    },

    list: {
      borderTopWidth: 1,
      borderTopColor: colors.borderRose,
    },

    row: {
      minHeight: 48,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 12,
    },

    rowBorder: {
      borderBottomWidth: 1,
      borderBottomColor: colors.borderRose,
    },

    rowText: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 14,
      color: colors.accentGold,
    },
  })
}