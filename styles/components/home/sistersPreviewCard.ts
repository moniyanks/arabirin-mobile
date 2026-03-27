import { StyleSheet } from 'react-native'
import { theme } from '../..'

export function makeSistersPreviewCardStyles(colors: any) {
  return StyleSheet.create({
    card: {
      backgroundColor: colors.bgSecondary,
      borderWidth: 1,
      borderColor: colors.borderRose,
      borderRadius: 20,
      paddingHorizontal: 18,
      paddingVertical: 18,
      marginBottom: 18,
      shadowColor: colors.shadow,
      shadowOpacity: 0.12,
      shadowRadius: 10,
      shadowOffset: { width: 0, height: 4 },
      elevation: 2,
    },

    eyebrow: {
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: colors.textMuted,
      marginBottom: 8,
    },

    title: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 22,
      lineHeight: 28,
      color: colors.accentGold,
      marginBottom: 8,
    },

    message: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      lineHeight: 21,
      color: colors.textMuted,
      marginBottom: 14,
    },

    topicRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      marginBottom: 14,
    },

    topicChip: {
      borderWidth: 1,
      borderColor: colors.borderRose,
      backgroundColor: 'rgba(217,155,155,0.08)',
      paddingHorizontal: 12,
      paddingVertical: 8,
      borderRadius: 999,
      marginRight: 8,
      marginBottom: 8,
    },

    topicChipText: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 12,
      color: colors.accentRose,
    },

    footerRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },

    footerText: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: colors.textMuted,
      flex: 1,
      paddingRight: 12,
    },

    cta: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 13,
      color: colors.accentRose,
    },
  })
}