import { StyleSheet } from 'react-native'
import { theme } from '..'

export function makeHomeStyles(c: any) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.bgPrimary,
    },
    container: {
      flex: 1,
      backgroundColor: c.bgPrimary,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 32,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 18,
    },
    logo: {
      ...theme.typography.displayMd,
      color: c.accentRose,
    },
    tagline: {
      marginTop: 2,
      ...theme.typography.label,
      color: c.textMuted,
      opacity: 0.9,
    },
    avatar: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.borderSoft,
      backgroundColor: c.bgSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    avatarText: {
      ...theme.typography.button,
      color: c.accentGold,
    },
    greetingBlock: {
      marginBottom: 18,
    },
    greeting: {
      ...theme.typography.displayLg,
      color: c.textPrimary,
      textAlign: 'center',
      marginBottom: 6,
    },
    context: {
      ...theme.typography.bodyMd,
      color: c.textMuted,
      textAlign: 'center',
    },
    heroCard: {
      backgroundColor: c.cardSoft,
      borderWidth: 0.5,
      borderColor: c.borderSoft,
      borderRadius: 20,
      paddingHorizontal: 20,
      paddingVertical: 22,
      alignItems: 'center',
      marginBottom: 18,
      shadowColor: c.shadow,
      shadowOpacity: 0.25,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 4,
    },
    phaseBadge: {
      paddingHorizontal: 16,
      paddingVertical: 8,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.borderRose,
      backgroundColor: 'rgba(217,155,155,0.08)',
      marginBottom: 12,
    },
    phaseBadgeText: {
      ...theme.typography.label,
      color: c.accentRose,
    },
    heroTitle: {
      ...theme.typography.displayMd,
      color: c.accentGold,
      textAlign: 'center',
      marginBottom: 8,
    },
    heroMessage: {
      ...theme.typography.bodyMd,
      color: c.textMuted,
      textAlign: 'center',
      marginTop: 4,
    },
    predictionRow: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderSoft,
      borderRadius: 14,
      paddingHorizontal: 16,
      paddingVertical: 14,
      marginBottom: 12,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    predictionLabel: {
      ...theme.typography.label,
      color: c.textMuted,
      marginBottom: 4,
    },
    predictionDate: {
      ...theme.typography.titleLg,
      color: c.accentRose,
    },
    confidencePill: {
      borderRadius: 999,
      paddingHorizontal: 12,
      paddingVertical: 7,
    },
    confidenceText: {
      ...theme.typography.label,
    },
    confidenceHigh: {
      backgroundColor: 'rgba(155,168,141,0.18)',
    },
    confidenceMedium: {
      backgroundColor: 'rgba(243,229,216,0.12)',
    },
    confidenceLow: {
      backgroundColor: 'rgba(217,155,155,0.14)',
    },
    confidenceHighText: {
      color: c.accentSage,
    },
    confidenceMediumText: {
      color: c.accentGold,
    },
    confidenceLowText: {
      color: c.accentRose,
    },
    logBanner: {
      backgroundColor: c.accentRose,
      borderRadius: 14,
      paddingHorizontal: 18,
      paddingVertical: 18,
      marginBottom: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    logBannerText: {
      ...theme.typography.titleMd,
      color: c.bgPrimary,
    },
    shortcutRow: {
      gap: 10,
      paddingBottom: 2,
    },
    shortcutBtn: {
      backgroundColor: c.bgSecondary,
      borderWidth: 0.5,
      borderColor: c.borderSoft,
      borderRadius: 14,
      paddingVertical: 10,
      paddingHorizontal: 14,
      alignItems: 'center',
      justifyContent: 'center',
      minWidth: 72,
      gap: 5,
    },
    shortcutIcon: {
      fontSize: 14,
      color: c.accentRose,
      opacity: 0.9,
    },
    shortcutLabel: {
      ...theme.typography.bodySm,
      color: c.textMuted,
    },
    shortcutsSection: {
      marginBottom: 18,
    },

    shortcutsHeading: {
      ...theme.typography.label,
      color: c.textMuted,
      marginBottom: 10,
      paddingLeft: 2,
    },
    statsRow: {
      flexDirection: 'row',
      gap: 10,
      marginBottom: 18,
    },
    statCard: {
      flex: 1,
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderSoft,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 10,
      alignItems: 'center',
    },
    statLabel: {
      ...theme.typography.label,
      color: c.textMuted,
      marginBottom: 6,
    },
    statValue: {
      ...theme.typography.displayMd,
      color: c.accentGold,
    },
    intelligenceCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderSoft,
      borderRadius: 16,
      padding: 18,
      marginBottom: 18,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
      shadowColor: c.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 14,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },
    intelligenceIconWrap: {
      width: 38,
      height: 38,
      borderRadius: 19,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(216,154,159,0.08)',
      borderWidth: 1,
      borderColor: c.borderRose,
    },
    intelligenceBody: {
      flex: 1,
    },
    intelligenceTitle: {
      ...theme.typography.titleMd,
      color: c.textPrimary,
      marginBottom: 6,
    },
    intelligenceDesc: {
      ...theme.typography.bodyMd,
      color: c.textMuted,
      flexShrink: 1,
    },
    quickActionGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 18,
    },
    quickActionCard: {
      width: '48.5%',
      backgroundColor: c.bgSecondary,
      borderWidth: 0.5,
      borderColor: c.borderSoft,
      borderRadius: 16,
      padding: 14,
      gap: 8,
    },
    quickActionTitle: {
      ...theme.typography.titleMd,
      color: c.textPrimary,
    },
    quickActionDesc: {
      ...theme.typography.bodySm,
      color: c.textMuted,
    },

    ringHeroCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderSoft,
      borderRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 20,
      paddingBottom: 18,
      alignItems: 'center',
      marginBottom: 18,
      shadowColor: c.shadow,
      shadowOpacity: 0.18,
      shadowRadius: 12,
      shadowOffset: { width: 0, height: 6 },
      elevation: 3,
    },

    ringWrap: {
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 12,
      marginBottom: 18,
    },

    ringCenter: {
      position: 'absolute',
      alignItems: 'center',
      justifyContent: 'center',
    },

    ringCenterLabel: {
      ...theme.typography.label,
      color: c.textMuted,
      marginBottom: 4,
    },

    ringCenterValue: {
      ...theme.typography.displayLg,
      fontSize: 34,
      lineHeight: 40,
      color: c.accentGold,
      textAlign: 'center',
    },

    ringCenterSubLabel: {
      ...theme.typography.bodyMd,
      color: c.textMuted,
      marginTop: 4,
      textAlign: 'center',
    },

    ringCenterValueAlt: {
      ...theme.typography.displayLg,
      color: c.accentGold,
      textAlign: 'center',
      maxWidth: 120,
    },

    emptyStateCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderSoft,
      borderRadius: 20,
      padding: 24,
      alignItems: 'center',
      gap: 12,
    },
    emptyStateIcon: {
      fontSize: 48,
      color: c.accentRose,
    },
    emptyStateTitle: {
      ...theme.typography.displayMd,
      color: c.accentGold,
      textAlign: 'center',
    },
    emptyStateDesc: {
      ...theme.typography.bodyMd,
      color: c.textMuted,
      textAlign: 'center',
      paddingHorizontal: 8,
    },
    emptyStateBtn: {
      backgroundColor: c.accentRose,
      borderRadius: 14,
      paddingVertical: 16,
      paddingHorizontal: 32,
      alignItems: 'center',
      width: '100%',
      marginTop: 4,
    },
    emptyStateBtnText: {
      ...theme.typography.button,
      color: c.bgPrimary,
    },
    emptyStateGrid: {
      flexDirection: 'row',
      gap: 10,
      width: '100%',
      marginTop: 8,
    },
    emptyStateGridCard: {
      flex: 1,
      backgroundColor: c.bgPrimary,
      borderWidth: 1,
      borderColor: c.borderSoft,
      borderRadius: 14,
      padding: 14,
      gap: 6,
    },
    emptyStateGridTitle: {
      ...theme.typography.titleMd,
      color: c.accentGold,
    },
    emptyStateGridDesc: {
      ...theme.typography.bodySm,
      color: c.textMuted,
    },

    awarenessCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderSoft,
      borderRadius: 14,
      padding: 16,
      marginBottom: 18,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 14,
    },
    awarenessIconWrap: {
      width: 36,
      height: 36,
      borderRadius: 18,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(217,155,155,0.08)',
      borderWidth: 1,
      borderColor: c.borderSoft,
    },
    awarenessCardInactive: {
      borderColor: c.accentRose,
    },
    awarenessCardPressed: {
      opacity: 0.96,
      transform: [{ scale: 0.995 }],
    },  
    awarenessBody: {
      flex: 1,
    },
    awarenessTitle: {
      ...theme.typography.titleMd,
      color: c.textPrimary,
      marginBottom: 4,
    },
    awarenessStreak: {
      ...theme.typography.bodySm,
      color: c.accentRose,
      marginBottom: 4,
    },  
    awarenessSubtitle: {
      ...theme.typography.bodySm,
      color: c.textMuted,
    },
    pregnancyFocusCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderSoft,
      borderRadius: 16,
      padding: 16,
      marginBottom: 18,
      gap: 10,
    },

    pregnancyFocusLabel: {
      ...theme.typography.label,
      color: c.accentRose,
    },

    pregnancyFocusRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    pregnancyFocusChip: {
      paddingHorizontal: 12,
      paddingVertical: 7,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.borderSoft,
      backgroundColor: c.bgPrimary,
    },

    pregnancyFocusChipText: {
      ...theme.typography.bodySm,
      color: c.textPrimary,
    }, 
    
    checkInCard: {
      backgroundColor: c.cardSoft,
      borderRadius: 20,
      padding: 18,
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderWidth: 0.5,
      borderColor: c.borderSoft,
    },

    checkInTitle: {
      color: c.textPrimary,
      fontSize: 18,
      fontWeight: '700',
      marginBottom: 10,
    },

    checkInTags: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
    },

    checkInTag: {
      backgroundColor: c.bgPrimary,
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.borderSoft,
    },

    checkInTagText: {
      color: c.textPrimary,
      fontSize: 12,
      fontWeight: '600',
    },
    checkInRhythm: {
      color: c.accentRose,
      fontSize: 13,
      fontWeight: '600',
      marginBottom: 8,
    },  

    checkInCTA: {
      color: c.accentRose,
      fontWeight: '700',
      fontSize: 14,
    },
    checkInContent: {
      flex: 1,
      paddingRight: 12,
    },
    
  })
}