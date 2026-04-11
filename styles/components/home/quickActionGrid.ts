import { StyleSheet } from 'react-native'
import { theme } from '../..'

export function makeQuickActionGridStyles(colors: any) {
  return StyleSheet.create({
    section: {
      marginBottom: 18
    },

    sectionTitle: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 20,
      color: colors.accentGold,
      marginBottom: 12
    },

    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      justifyContent: 'space-between',
      gap: 12
    },

    card: {
      width: '48%',
      backgroundColor: colors.bgSecondary,
      borderWidth: 1,
      borderColor: colors.borderRose,
      borderRadius: 18,
      paddingHorizontal: 14,
      paddingVertical: 16,
      minHeight: 118,
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2
    },

    iconWrap: {
      width: 34,
      height: 34,
      borderRadius: 17,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(217,155,155,0.08)',
      marginBottom: 12
    },

    cardTitle: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 15,
      color: colors.accentGold,
      marginBottom: 6
    },

    cardSubtitle: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      lineHeight: 18,
      color: colors.textMuted
    }
  })
}
