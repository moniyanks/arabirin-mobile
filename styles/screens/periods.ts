import { StyleSheet } from 'react-native'
import { theme, type ThemeColors } from '../../constants/theme'

export function makePeriodsStyles(c: ThemeColors) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.bgPrimary
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.borderRose
    },
    topBarTitle: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 24,
      color: c.accentGold
    },
    topBarSub: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: c.textMuted,
      marginTop: 2
    },
    closeBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center'
    },
    container: {
      flex: 1
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 48,
      gap: 10
    },

    // Add button
    addBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 14,
      padding: 16
    },
    addBtnText: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 14,
      color: c.accentRose
    },

    // Add card
    addCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.accentRose,
      borderRadius: 16,
      padding: 16,
      gap: 10
    },
    addCardTitle: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 15,
      color: c.accentGold
    },
    addCardLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: c.textMuted
    },
    addCardHint: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: c.textMuted,
      lineHeight: 18
    },
    addCardBtns: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 4
    },

    // Date field
    dateField: {
      backgroundColor: c.bgPrimary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 14
    },
    dateFieldText: {
      fontFamily: theme.fonts.sans,
      fontSize: 15,
      color: c.textPrimary
    },

    // Buttons
    cancelBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.borderRose,
      alignItems: 'center'
    },
    cancelBtnText: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 14,
      color: c.textMuted
    },
    saveBtn: {
      flex: 1,
      paddingVertical: 12,
      borderRadius: 10,
      backgroundColor: c.accentRose,
      alignItems: 'center'
    },
    saveBtnDisabled: {
      opacity: 0.5
    },
    saveBtnText: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 14,
      color: c.bgPrimary
    },

    // Period card
    periodCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 14,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center'
    },
    periodCardLeft: {
      flex: 1,
      gap: 3
    },
    periodStart: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 15,
      color: c.textPrimary
    },
    periodEnd: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted
    },
    periodDuration: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: c.accentRose,
      marginTop: 2
    },
    periodCardActions: {
      flexDirection: 'row',
      gap: 8
    },
    actionBtn: {
      width: 36,
      height: 36,
      borderRadius: 18,
      borderWidth: 1,
      borderColor: c.borderRose,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.bgPrimary
    },

    // Edit card
    editCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.accentRose,
      borderRadius: 16,
      padding: 16,
      gap: 10
    },
    editCardTitle: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 15,
      color: c.accentGold
    },
    editLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: c.textMuted
    },

    // Empty state
    emptyState: {
      alignItems: 'center',
      paddingVertical: 48,
      gap: 8
    },
    emptyText: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 15,
      color: c.textPrimary
    },
    emptySubtext: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
      textAlign: 'center'
    }
  })
}
