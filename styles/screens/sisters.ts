import { StyleSheet } from 'react-native'
import { theme, type ThemeColors } from '../../constants/theme'

export function makeSistersStyles(c: ThemeColors) {
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
      gap: 16,
    },

    // Header
    header: {
      gap: 6,
      paddingTop: 8,
    },
    title: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 28,
      color: c.accentGold,
    },
    subtitle: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
      lineHeight: 20,
    },

    // Disclaimer
    disclaimer: {
      flexDirection: 'row',
      gap: 10,
      alignItems: 'flex-start',
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 12,
      padding: 12,
    },
    disclaimerText: {
      flex: 1,
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      lineHeight: 18,
      color: c.textMuted,
    },

    // Waitlist card
    waitlistCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 20,
      padding: 20,
      gap: 14,
    },
    waitlistTop: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    waitlistIconWrap: {
      width: 40,
      height: 40,
      borderRadius: 20,
      backgroundColor: 'rgba(217,155,155,0.1)',
      borderWidth: 1,
      borderColor: c.borderRose,
      alignItems: 'center',
      justifyContent: 'center',
    },
    waitlistTitle: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 18,
      color: c.accentGold,
    },
    waitlistCount: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: c.textMuted,
    },
    waitlistDesc: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      lineHeight: 20,
      color: c.textMuted,
    },
    waitlistInput: {
      backgroundColor: c.bgPrimary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 16,
      fontFamily: theme.fonts.sans,
      fontSize: 15,
      color: c.textPrimary,
    },
    errorText: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: '#ff8080',
    },
    waitlistBtn: {
      backgroundColor: c.accentRose,
      borderRadius: 12,
      paddingVertical: 16,
      alignItems: 'center',
    },
    waitlistBtnDisabled: {
      opacity: 0.4,
    },
    waitlistBtnText: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 15,
      color: c.bgPrimary,
    },

    // Success card
    successCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
      gap: 8,
    },
    successIcon: {
      fontSize: 32,
      color: c.accentRose,
    },
    successTitle: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 22,
      color: c.accentGold,
    },
    successDesc: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      color: c.textMuted,
      textAlign: 'center',
      lineHeight: 20,
    },

    // Section label
    sectionLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      letterSpacing: 1.4,
      textTransform: 'uppercase',
      color: c.textMuted,
    },

    // Circles
    circlesRow: {
      gap: 8,
      paddingBottom: 2,
    },
    circleBtn: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.borderRose,
      backgroundColor: c.bgSecondary,
    },
    circleBtnActive: {
      borderColor: c.accentRose,
      backgroundColor: 'rgba(217,155,155,0.1)',
    },
    circleBtnText: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
    },
    circleBtnTextActive: {
      color: c.accentRose,
      fontFamily: theme.fonts.sansMedium,
    },

    // Locked composer
    composerLocked: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 14,
      padding: 14,
    },
    composerAvatar: {
      width: 34,
      height: 34,
      borderRadius: 17,
      backgroundColor: 'rgba(217,155,155,0.1)',
      borderWidth: 1,
      borderColor: c.borderRose,
      alignItems: 'center',
      justifyContent: 'center',
    },
    composerAvatarText: {
      fontSize: 14,
      color: c.accentRose,
    },
    composerPlaceholder: {
      flex: 1,
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      color: c.textMuted,
    },
    composerSoonPill: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.borderRose,
      backgroundColor: c.bgPrimary,
    },
    composerSoonText: {
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      color: c.textMuted,
    },

    // Empty state
    emptyState: {
      alignItems: 'center',
      paddingVertical: 32,
      paddingHorizontal: 24,
      gap: 10,
    },
    emptyIcon: {
      fontSize: 36,
      color: c.textMuted,
    },
    emptyTitle: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 20,
      color: c.accentGold,
      textAlign: 'center',
    },
    emptyText: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
      textAlign: 'center',
      lineHeight: 20,
    },
  })
}