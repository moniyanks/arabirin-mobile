import { StyleSheet } from 'react-native'
import { theme, type ThemeColors } from '../../constants/theme'

export function makeProfileStyles(c: ThemeColors) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.bgPrimary,
    },
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 48,
      gap: 12,
    },

    cardRow: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
    },
    cardValue: {
        fontFamily: theme.fonts.sans,
        fontSize: 15,
        color: c.textPrimary,
    },
    editBtn: {
        fontFamily: theme.fonts.sansMedium,
        fontSize: 13,
        color: c.accentRose,
    },

    // Avatar
    avatarSection: {
      alignItems: 'center',
      paddingVertical: 24,
    },
    avatar: {
      width: 72,
      height: 72,
      borderRadius: 36,
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      alignItems: 'center',
      justifyContent: 'center',
      marginBottom: 12,
    },
    avatarLetter: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 32,
      color: c.accentRose,
    },
    avatarName: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 24,
      color: c.accentGold,
      marginBottom: 4,
    },
    avatarMode: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
    },

    // BMI stats
    statsRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 4,
    },
    statCard: {
      flex: 1,
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 12,
      paddingVertical: 10,
      alignItems: 'center',
    },
    statLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: c.textMuted,
      marginBottom: 4,
    },
    statValue: {
      fontFamily: theme.fonts.serif,
      fontSize: 18,
      color: c.accentGold,
    },

    // Cards
    card: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 16,
      padding: 16,
      gap: 12,
    },
    cardLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1.2,
      color: c.textMuted,
    },

    // Input
    input: {
      backgroundColor: c.bgPrimary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 10,
      paddingVertical: 12,
      paddingHorizontal: 14,
      fontFamily: theme.fonts.sans,
      fontSize: 15,
      color: c.textPrimary,
    },
    errorText: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: '#ff8080',
    },

    // Mode grid
    modeGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    modeBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.borderRose,
      backgroundColor: c.bgPrimary,
    },
    modeBtnSelected: {
      borderColor: c.accentRose,
      backgroundColor: 'rgba(217,155,155,0.1)',
    },
    modeBtnText: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
    },
    modeBtnTextSelected: {
      color: c.accentRose,
    },

    // Option buttons
    optionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },
    optionBtn: {
      paddingHorizontal: 14,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.borderRose,
      backgroundColor: c.bgPrimary,
    },
    optionSelected: {
      borderColor: c.accentRose,
      backgroundColor: 'rgba(217,155,155,0.1)',
    },
    optionBtnText: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
    },
    optionSelectedText: {
      color: c.accentRose,
    },

    // Save button
    saveError: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: '#ff8080',
      textAlign: 'center',
    },
    saveBtn: {
      backgroundColor: c.accentRose,
      borderRadius: 14,
      paddingVertical: 16,
      alignItems: 'center',
    },
    saveBtnSaved: {
      backgroundColor: c.accentSage,
    },
    saveBtnDisabled: {
      opacity: 0.5,
    },
    saveBtnText: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 15,
      color: c.bgPrimary,
    },

    // Version / logout / delete
    version: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: c.textMuted,
      textAlign: 'center',
    },
    logoutBtn: {
      paddingVertical: 14,
      borderRadius: 10,
      borderWidth: 1,
      borderColor: c.borderRose,
      alignItems: 'center',
    },
    logoutBtnText: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 15,
      color: c.textPrimary,
    },
    deleteBtn: {
      paddingVertical: 14,
      alignItems: 'center',
      gap: 6,
    },
    deleteBtnText: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 14,
      color: '#ff8080',
    },
    deleteWarning: {
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      color: c.textMuted,
      textAlign: 'center',
      lineHeight: 16,
    },
  })
}