import { StyleSheet } from 'react-native'
import { theme } from '../..'

export function makeSistersPreviewCardStyles(colors: any) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.cardSoft,
      borderWidth: 0.5,
      borderColor: colors.borderSoft,
      borderRadius: 22,
      paddingHorizontal: 20,
      paddingVertical: 20,
      marginBottom: 18,
      shadowColor: colors.shadow,
      shadowOpacity: 0.08,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2
    },

    eyebrow: {
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: colors.textMuted,
      marginBottom: 10
    },

    title: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 21,
      lineHeight: 28,
      color: colors.accentGold,
      marginBottom: 10
    },

    message: {
      fontFamily: theme.fonts.sans,
      fontSize: 15,
      lineHeight: 23,
      color: colors.textMuted,
      marginBottom: 10
    },

    contextLine: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      lineHeight: 18,
      color: colors.textMuted,
      marginBottom: 10,
      opacity: 0.9
    },

    topicRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 16
    },

    topicChip: {
      borderWidth: 0.5,
      borderColor: colors.borderSoft,
      backgroundColor: 'rgba(216,154,159,0.08)',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      marginRight: 8,
      marginBottom: 8
    },

    topicChipText: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 12,
      color: colors.accentRose
    },

    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingTop: 2
    },

    footerText: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      lineHeight: 19,
      color: colors.textMuted,
      flex: 1,
      paddingRight: 12
    },

    cta: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 14,
      color: colors.accentRose
    }
  })
}
