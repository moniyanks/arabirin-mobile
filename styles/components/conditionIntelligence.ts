import { StyleSheet } from 'react-native'
import { theme, type ThemeColors } from '../../constants/theme'

export function makeConditionIntelligenceStyles(c: ThemeColors) {
  return StyleSheet.create({
    card: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 20,
      padding: 18,
      gap: 12,
    },
    cardHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 10,
      flexWrap: 'wrap',
    },
    dot: {
      width: 10,
      height: 10,
      borderRadius: 5,
    },
    cardTitle: {
      flex: 1,
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 15,
      color: c.textPrimary,
    },
    pill: {
      paddingHorizontal: 10,
      paddingVertical: 4,
      borderRadius: 999,
      borderWidth: 1,
    },
    pillText: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 11,
    },
    buildingTitle: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 14,
      color: c.textPrimary,
    },
    buildingDesc: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
      lineHeight: 20,
    },
    progressTrack: {
      height: 6,
      backgroundColor: c.borderRose,
      borderRadius: 999,
      overflow: 'hidden',
    },
    progressFill: {
      height: '100%',
      borderRadius: 999,
    },
    progressLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      color: c.textMuted,
    },
    scoreTrack: {
      height: 10,
      backgroundColor: c.borderRose,
      borderRadius: 999,
      overflow: 'hidden',
      position: 'relative',
    },
    scoreFill: {
      height: '100%',
      borderRadius: 999,
    },
    zoneMarker: {
      position: 'absolute',
      top: 0,
      bottom: 0,
      width: 1,
      backgroundColor: c.bgSecondary,
    },
    zoneLabels: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      marginTop: -4,
    },
    zoneLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 10,
      color: c.textMuted,
    },
    desc: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      lineHeight: 20,
      color: c.textMuted,
    },
    disclaimer: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 8,
      backgroundColor: c.bgPrimary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 10,
      padding: 10,
    },
    disclaimerText: {
      flex: 1,
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      color: c.textMuted,
      lineHeight: 16,
    },
    expandBtn: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    expandBtnText: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 13,
      color: c.textMuted,
    },
    signals: {
      gap: 10,
      borderTopWidth: 1,
      borderTopColor: c.borderRose,
      paddingTop: 12,
    },
    signalRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 10,
    },
    signalDot: {
      width: 8,
      height: 8,
      borderRadius: 4,
      marginTop: 4,
    },
    signalLabel: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 13,
    },
    signalDetail: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: c.textMuted,
      marginTop: 2,
    },
    signalWeight: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 12,
    },
    signalsFootnote: {
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      color: c.textMuted,
      textAlign: 'center',
      marginTop: 4,
    },
    ctaBtn: {
      borderWidth: 1,
      borderRadius: 12,
      paddingVertical: 12,
      alignItems: 'center',
    },
    ctaBtnText: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 14,
    },
  })
}