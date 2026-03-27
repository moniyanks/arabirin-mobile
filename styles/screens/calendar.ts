import { StyleSheet } from 'react-native'
import { theme } from '..'

export function makeCalendarStyles(c: any) {
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
    monthNav: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      marginBottom: 14,
    },
    monthBtn: {
      width: 40,
      height: 40,
      borderRadius: 20,
      borderWidth: 1,
      borderColor: c.borderRose,
      backgroundColor: c.bgSecondary,
      alignItems: 'center',
      justifyContent: 'center',
    },
    monthLabel: {
      ...theme.typography.displayMd,
      color: c.accentGold,
    },
    calendarCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 20,
      padding: 16,
      marginBottom: 16,
    },
    weekdayRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginBottom: 10,
    },
    weekdayCell: {
      width: '14.285%',
      alignItems: 'center',
    },
    weekdayText: {
      ...theme.typography.label,
      color: c.textMuted,
    },
    grid: {
      flexDirection: 'row',
      flexWrap: 'wrap',
    },
    dayCellWrap: {
      width: '14.285%',
      paddingVertical: 6,
      alignItems: 'center',
    },
    dayCell: {
      width: 40,
      height: 40,
      borderRadius: 20,
      alignItems: 'center',
      justifyContent: 'center',
      borderWidth: 1,
      borderColor: 'transparent',
      backgroundColor: 'transparent',
      position: 'relative',
    },
    dayText: {
      ...theme.typography.bodyMd,
      color: c.textPrimary,
    },
    dayOutsideMonth: {
      opacity: 0.35,
    },
    daySelected: {
      borderColor: c.accentRose,
      backgroundColor: c.bgPrimary,
    },
    dayToday: {
      borderColor: c.accentGold,
    },
    dayPeriod: {
      backgroundColor: c.accentRose,
      borderColor: c.accentRose,
    },
    dayPredictedPeriod: {
      backgroundColor: 'rgba(217,155,155,0.12)',
      borderColor: c.borderRose,
    },
    dayFertile: {
      backgroundColor: 'rgba(155,168,141,0.16)',
      borderColor: c.accentSage,
    },
    dayOvulation: {
      backgroundColor: c.accentGold,
      borderColor: c.accentGold,
    },
    dayTextLight: {
      color: c.bgPrimary,
    },
    legend: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 12,
      marginTop: 14,
    },
    legendItem: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    legendDot: {
      width: 12,
      height: 12,
      borderRadius: 999,
    },
    legendDotPeriod: {
        backgroundColor: c.accentRose,
    },

    legendDotPredicted: {
        backgroundColor: 'transparent',
        borderColor: c.accentRose,
        borderWidth: 1.5,
        borderStyle: 'dashed',
    },
    legendDotFertile: {
        backgroundColor: 'rgba(155, 168, 141, 0.18)',
        borderColor: c.accentSage,
        borderWidth: 1,
    },

    legendDotOvulation: {
        backgroundColor: c.accentSage,
    },

    legendText: {
      ...theme.typography.bodySm,
      color: c.textMuted,
    },
    detailCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 16,
      padding: 16,
      marginBottom: 16,
    },
    detailDate: {
      ...theme.typography.displayMd,
      color: c.accentGold,
      marginBottom: 8,
    },
    detailText: {
      ...theme.typography.bodyMd,
      color: c.textMuted,
      marginBottom: 14,
    },
    badgeRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginBottom: 14,
    },
    badge: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.borderRose,
      backgroundColor: c.bgPrimary,
    },
    badgeText: {
      ...theme.typography.label,
      color: c.accentRose,
    },
    primaryBtn: {
      minHeight: 50,
      borderRadius: 999,
      backgroundColor: c.accentRose,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryBtnText: {
      ...theme.typography.button,
      color: c.bgPrimary,
    },
    logSummary: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 4,
      marginBottom: 12,
    },
    logChip: {
      paddingHorizontal: 12,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
      borderColor: c.borderRose,
      backgroundColor: c.bgSecondary,
    },
    logChipText: {
      ...theme.typography.bodySm,
      color: c.textPrimary,
      textTransform: 'capitalize',
    },
    historyBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      paddingVertical: 14,
      paddingHorizontal: 16,
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 14,
      marginTop: 4,
    },
    historyBtnText: {
      flex: 1,
      ...theme.typography.bodyMd,
      color: c.textMuted,
    },
    primaryBtnDisabled: {
      opacity: 0.5,
    },
    todayCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 18,
      padding: 18,
      marginBottom: 16,
      gap: 8,
    },
    todayCardEyebrow: {
      ...theme.typography.label,
      color: c.accentRose,
    },
    todayCardTitle: {
      ...theme.typography.displayMd,
      color: c.accentGold,
    },
    todayCardText: {
      ...theme.typography.bodyMd,
      color: c.textMuted,
    },
    todayChipRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 8,
      marginTop: 4,
    },
    todayChip: {
      paddingHorizontal: 10,
      paddingVertical: 6,
      borderRadius: 999,
      backgroundColor: c.bgPrimary,
      borderWidth: 1,
      borderColor: c.borderRose,
    },
    todayChipText: {
      ...theme.typography.bodySm,
      color: c.textPrimary,
    },
    todayCardButton: {
      marginTop: 6,
      backgroundColor: c.accentRose,
      borderRadius: 12,
      paddingVertical: 13,
      paddingHorizontal: 16,
      alignItems: 'center',
      justifyContent: 'center',
    },
    todayCardButtonText: {
      ...theme.typography.button,
      color: c.bgPrimary,
    },  
  })
}