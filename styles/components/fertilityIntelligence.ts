import { StyleSheet } from 'react-native'
import { theme, type ThemeColors } from '../../constants/theme'

export function makeFertilityIntelligenceStyles(c: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 20,
      padding: 18,
      gap: 12
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap'
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5
    },
    cardTitle: {
      flex: 1,
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 15,
      color: c.textPrimary
    },
    confidencePill: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      borderWidth: 1
    },
    confidencePillText: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 11
    },
    statusCard: {
      backgroundColor: c.bgPrimary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 12,
      padding: 14
    },
    statusMessage: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      lineHeight: 20,
      color: c.textMuted
    },
    datesRow: {
      flexDirection: 'row',
      gap: 10
    },
    dateCard: {
      flex: 1,
      backgroundColor: c.bgPrimary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 12,
      padding: 12,
      gap: 4
    },
    dateLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: c.textMuted
    },
    dateValue: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 14,
      color: c.textPrimary
    },
    countdownCard: {
      backgroundColor: 'rgba(217,155,155,0.08)',
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 12,
      padding: 14,
      alignItems: 'center',
      flexDirection: 'row',
      gap: 10
    },
    countdownNumber: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 36,
      color: c.accentRose
    },
    countdownLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
      flex: 1,
      lineHeight: 20
    },
    qualityRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10
    },
    qualityLeft: {
      gap: 2,
      width: 100
    },
    qualityLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
      color: c.textMuted
    },
    qualityValue: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 13
    },
    qualityBar: {
      flex: 1,
      height: 8,
      backgroundColor: c.borderRose,
      borderRadius: 999,
      overflow: 'hidden'
    },
    qualityFill: {
      height: '100%',
      borderRadius: 999
    },
    factorsList: {
      gap: 8,
      borderTopWidth: 1,
      borderTopColor: c.borderRose,
      paddingTop: 12
    },
    factorItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 8
    },
    factorDot: {
      width: 6,
      height: 6,
      borderRadius: 3
    },
    factorText: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
      flex: 1
    },
    factorsNote: {
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      color: c.textMuted,
      textAlign: 'center',
      marginTop: 4
    },
    symptomSummary: {
      gap: 8
    },
    symptomSummaryTitle: {
      fontFamily: theme.fonts.sans,
      fontSize: 10,
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: c.textMuted
    },
    symptomRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 6
    },
    symptomChip: {
      paddingHorizontal: 10,
      paddingVertical: 5,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.borderRose,
      backgroundColor: c.bgPrimary
    },
    symptomChipText: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: c.textMuted
    },
    disclaimer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      backgroundColor: c.bgPrimary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 10,
      padding: 10
    },
    disclaimerText: {
      flex: 1,
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      color: c.textMuted,
      lineHeight: 16
    },
    ctaBtn: {
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center'
    },
    ctaBtnText: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 14,
      color: c.accentRose
    }
  })
}
