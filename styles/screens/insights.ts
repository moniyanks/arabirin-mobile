import { StyleSheet } from 'react-native'
import { theme, type ThemeColors } from '../../constants/theme'

export function makeInsightsStyles(c: ThemeColors) {
  return StyleSheet.create({
    safe: { flex: 1, backgroundColor: c.bgPrimary },
    container: { flex: 1 },
    content: {
      paddingHorizontal: 16,
      paddingTop: 8,
      paddingBottom: 48,
      gap: 12
    },

    // Empty state
    emptyState: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingVertical: 60,
      gap: 12
    },
    emptyTitle: {
      ...theme.typography.displayMd,
      color: c.accentGold
    },
    emptyText: {
      ...theme.typography.bodyMd,
      color: c.textMuted,
      textAlign: 'center',
      paddingHorizontal: 24
    },
    emptyBtn: {
      backgroundColor: c.accentRose,
      borderRadius: 12,
      paddingVertical: 14,
      paddingHorizontal: 28,
      marginTop: 8
    },
    emptyBtnText: {
      ...theme.typography.button,
      color: c.bgPrimary
    },

    // Section label
    sectionLabel: {
      ...theme.typography.label,
      color: c.textMuted,
      marginTop: 4
    },

    // Cards
    summaryCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 16,
      padding: 16,
      gap: 12
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      flexWrap: 'wrap'
    },
    cardHeaderLabel: {
      flex: 1,
      ...theme.typography.bodyMd,
      fontWeight: '600',
      color: c.textPrimary
    },
    badge: {
      paddingHorizontal: 8,
      paddingVertical: 3,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.borderRose
    },
    badgeText: {
      ...theme.typography.bodySm,
      color: c.textMuted
    },

    // Stability
    stabilityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      padding: 12,
      borderRadius: 10,
      borderWidth: 1
    },
    stabilityStable: {
      backgroundColor: 'rgba(155,168,141,0.1)',
      borderColor: 'rgba(155,168,141,0.3)'
    },
    stabilityVariable: {
      backgroundColor: 'rgba(217,155,155,0.08)',
      borderColor: c.borderRose
    },
    stabilityDot: {
      width: 8,
      height: 8,
      borderRadius: 4
    },
    stabilityDotStable: {
      backgroundColor: c.accentSage
    },
    stabilityDotVariable: {
      backgroundColor: c.accentRose
    },
    stabilityTitle: {
      ...theme.typography.bodyMd,
      fontWeight: '600',
      color: c.textPrimary
    },
    stabilityRange: {
      ...theme.typography.bodySm,
      color: c.textMuted,
      marginTop: 2
    },

    // Confidence
    confidenceRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between'
    },
    confidenceLabel: {
      ...theme.typography.bodySm,
      color: c.textMuted
    },
    confidencePill: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: 'rgba(217,155,155,0.1)',
      borderWidth: 1,
      borderColor: c.borderRose
    },
    confidencePillText: {
      ...theme.typography.label,
      color: c.accentRose
    },

    // Intelligence card
    intelligenceCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 16,
      padding: 16,
      gap: 14
    },
    insightItem: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'flex-start'
    },
    insightIconWrap: {
      width: 32,
      height: 32,
      borderRadius: 16,
      alignItems: 'center',
      justifyContent: 'center'
    },
    insightBody: {
      flex: 1,
      gap: 4
    },
    insightTopRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 8
    },
    insightTitle: {
      flex: 1,
      ...theme.typography.titleMd,
      color: c.textPrimary
    },
    insightText: {
      ...theme.typography.bodyMd,
      color: c.textMuted
    },

    confidenceChip: {
      paddingHorizontal: 7,
      paddingVertical: 2,
      borderRadius: 999
    },
    confidenceChipHigh: { backgroundColor: 'rgba(155,168,141,0.2)' },
    confidenceChipMedium: { backgroundColor: 'rgba(243,229,216,0.15)' },
    confidenceChipLow: { backgroundColor: 'rgba(217,155,155,0.12)' },
    confidenceChipText: {
      ...theme.typography.bodySm,
      textTransform: 'capitalize'
    },
    confidenceChipTextHigh: { color: c.accentSage },
    confidenceChipTextMedium: { color: c.accentGold },
    confidenceChipTextLow: { color: c.accentRose },

    // Charts
    chartCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 16,
      padding: 16,
      gap: 8
    },
    chartTitle: {
      ...theme.typography.titleMd,
      color: c.textPrimary
    },
    chartSubtitle: {
      ...theme.typography.bodySm,
      color: c.textMuted,
      marginTop: -4
    },
    chartNote: {
      ...theme.typography.bodySm,
      color: c.textMuted,
      textAlign: 'center',
      marginTop: 4
    },

    barChart: {
      gap: 8,
      marginTop: 8
    },
    barRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    },
    barLabel: {
      ...theme.typography.bodySm,
      color: c.textMuted,
      width: 28
    },
    barTrack: {
      flex: 1,
      height: 10,
      backgroundColor: 'rgba(217,155,155,0.1)',
      borderRadius: 999,
      overflow: 'hidden'
    },
    barFill: {
      height: '100%',
      backgroundColor: c.accentRose,
      borderRadius: 999
    },
    barValue: {
      ...theme.typography.bodySm,
      color: c.textMuted,
      width: 28,
      textAlign: 'right'
    },

    symptomRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8,
      marginTop: 4
    },
    symptomName: {
      ...theme.typography.bodySm,
      color: c.textMuted,
      width: 110
    },
    symptomTrack: {
      flex: 1,
      height: 10,
      backgroundColor: 'rgba(155,168,141,0.12)',
      borderRadius: 999,
      overflow: 'hidden'
    },
    symptomFill: {
      height: '100%',
      backgroundColor: c.accentSage,
      borderRadius: 999
    },
    symptomCount: {
      ...theme.typography.bodySm,
      color: c.textMuted,
      width: 28,
      textAlign: 'right'
    },

    // Stats grid
    statsGrid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10
    },
    statCard: {
      width: '48%',
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 14,
      padding: 14,
      gap: 3
    },
    statValue: {
      ...theme.typography.displayMd,
      color: c.accentGold
    },
    statLabel: {
      ...theme.typography.label,
      color: c.textMuted
    },
    statUnit: {
      ...theme.typography.bodySm,
      color: c.textMuted
    },
    statInterp: {
      ...theme.typography.bodySm,
      marginTop: 4
    },
    statInterpSage: { color: c.accentSage },
    statInterpRose: { color: c.accentRose },

    // Sisters teaser
    sistersCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 16,
      padding: 16,
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12
    },
    sistersEyebrow: {
      ...theme.typography.label,
      color: c.accentRose,
      marginBottom: 4
    },
    sistersTitle: {
      ...theme.typography.displayMd,
      color: c.accentGold,
      marginBottom: 4
    },
    sistersDesc: {
      ...theme.typography.bodySm,
      color: c.textMuted
    },

    emptyInsightsState: {
      marginTop: 8,
      paddingTop: 8
    },

    emptyInsightsTitle: {
      ...theme.typography.titleMd,
      color: c.accentGold,
      marginBottom: 6
    },

    emptyInsightsText: {
      ...theme.typography.bodyMd,
      color: c.textMuted
    }
  })
}
