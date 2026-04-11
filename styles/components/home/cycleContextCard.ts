import { StyleSheet } from 'react-native'
import { theme } from '../..'

export function makeCycleContextCardStyles(c: any) {
  return StyleSheet.create({
    card: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 20,
      paddingHorizontal: 18,
      paddingVertical: 18,
      marginBottom: 14,
      shadowColor: c.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3
    },

    topRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      marginBottom: 14
    },

    leftBlock: {
      flex: 1,
      paddingRight: 12
    },

    eyebrow: {
      ...theme.typography.label,
      color: c.textMuted,
      marginBottom: 6
    },

    cycleDay: {
      ...theme.typography.displayLg,
      color: c.accentGold,
      marginBottom: 4
    },

    phaseLabel: {
      ...theme.typography.bodyMd,
      fontWeight: '600',
      color: c.accentRose
    },

    rightBlock: {
      alignItems: 'flex-end'
    },

    metaLabel: {
      ...theme.typography.label,
      color: c.textMuted,
      marginBottom: 4
    },

    metaValue: {
      ...theme.typography.button,
      color: c.accentGold
    },

    divider: {
      height: 1,
      backgroundColor: c.borderRose,
      opacity: 0.7,
      marginBottom: 12
    },

    supportText: {
      ...theme.typography.bodyMd,
      color: c.textMuted
    }
  })
}
