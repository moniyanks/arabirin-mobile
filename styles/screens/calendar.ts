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
    header: {
      marginBottom: 18,
    },
    title: {
      fontFamily: theme.fonts.serif,
      fontSize: 30,
      color: c.accentRose,
      marginBottom: 4,
      textAlign: 'center',
    },
    subtitle: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
      textAlign: 'center',
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
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 24,
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
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: c.textMuted,
      textTransform: 'uppercase',
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
      fontFamily: theme.fonts.sans,
      fontSize: 14,
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
      fontFamily: theme.fonts.sans,
      fontSize: 12,
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
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 22,
      color: c.accentGold,
      marginBottom: 8,
    },
    detailText: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      color: c.textMuted,
      lineHeight: 21,
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
      fontFamily: theme.fonts.sansMedium,
      fontSize: 11,
      color: c.accentRose,
      textTransform: 'uppercase',
      letterSpacing: 0.8,
    },
    primaryBtn: {
      minHeight: 50,
      borderRadius: 999,
      backgroundColor: c.accentRose,
      alignItems: 'center',
      justifyContent: 'center',
    },
    primaryBtnText: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 15,
      color: c.bgPrimary,
    },
  })
}