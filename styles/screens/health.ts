import { StyleSheet } from 'react-native'
import { theme, type ThemeColors } from '../../constants/theme'

export function makeHealthStyles(c: ThemeColors) {
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
      gap: 20,
    },

    // Phase card
    phaseCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 20,
      padding: 20,
      gap: 14,
    },
    phaseCardHeader: {
      gap: 8,
    },
    phasePill: {
      alignSelf: 'flex-start',
      paddingHorizontal: 12,
      paddingVertical: 5,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.borderRose,
      backgroundColor: 'rgba(217,155,155,0.08)',
    },
    phasePillText: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 11,
      letterSpacing: 1,
      textTransform: 'uppercase',
      color: c.accentRose,
    },
    phaseCardTitle: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 22,
      color: c.accentGold,
      lineHeight: 28,
    },
    phaseCardBody: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      lineHeight: 22,
      color: c.textMuted,
    },
    tipBox: {
      backgroundColor: 'rgba(217,155,155,0.06)',
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 12,
      padding: 14,
      gap: 6,
    },
    tipLabel: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 11,
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: c.accentRose,
    },
    tipText: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      lineHeight: 20,
      color: c.textMuted,
    },
    logNowBtn: {
      backgroundColor: c.accentRose,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
    },
    logNowBtnText: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 14,
      color: c.bgPrimary,
    },

    // Health hub
    hubSection: {
      gap: 12,
    },
    hubTitle: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 22,
      color: c.accentGold,
    },
    hubSubtitle: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
      marginTop: -6,
    },
    hubCards: {
      gap: 10,
    },
    hubCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    hubEmoji: {
      fontSize: 28,
    },
    hubContent: {
      flex: 1,
      gap: 3,
    },
    hubCardTitle: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 15,
      color: c.textPrimary,
    },
    hubCardDesc: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: c.textMuted,
      lineHeight: 17,
    },

    // Modal
    modalOverlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    modalBackdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.4)',
    },
    modalSheet: {
      backgroundColor: c.bgPrimary,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderTopWidth: 1,
      borderTopColor: c.borderRose,
      maxHeight: '88%',
      paddingBottom: 32,
    },
    handleWrap: {
      alignItems: 'center',
      paddingTop: 10,
      paddingBottom: 4,
    },
    handle: {
      width: 40,
      height: 4,
      borderRadius: 999,
      backgroundColor: c.borderRose,
    },
    modalContent: {
      paddingHorizontal: 20,
      paddingBottom: 12,
      gap: 16,
    },
    modalHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
      paddingTop: 8,
    },
    modalEmoji: {
      fontSize: 28,
    },
    modalTitle: {
      flex: 1,
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 24,
      color: c.accentGold,
    },
    closeBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    statsBox: {
      borderWidth: 1,
      borderRadius: 12,
      padding: 14,
      backgroundColor: 'rgba(217,155,155,0.04)',
    },
    statsText: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 13,
      lineHeight: 20,
      color: c.textPrimary,
    },
    modalSection: {
      gap: 10,
    },
    modalSectionTitle: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 18,
      color: c.accentGold,
    },
    modalBodyText: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      lineHeight: 22,
      color: c.textMuted,
    },
    symptomItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
    },
    symptomDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
    },
    symptomText: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      color: c.textMuted,
      flex: 1,
    },
    actionBox: {
      backgroundColor: 'rgba(243,229,216,0.06)',
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 12,
      padding: 14,
    },
    actionText: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 13,
      lineHeight: 20,
      color: c.textPrimary,
    },
    closeFullBtn: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 12,
      paddingVertical: 14,
      alignItems: 'center',
      marginTop: 4,
    },
    closeFullBtnText: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 15,
      color: c.textPrimary,
    },
  })
}