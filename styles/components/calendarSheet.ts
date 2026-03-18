import { StyleSheet } from 'react-native'
import { theme } from '..'

export function makeCalendarSheetStyles(c: any) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      justifyContent: 'flex-end',
    },
    backdrop: {
      ...StyleSheet.absoluteFillObject,
      backgroundColor: 'rgba(0,0,0,0.35)',
    },
    sheet: {
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      borderTopWidth: 1,
      minHeight: '42%',
      maxHeight: '88%',
      paddingBottom: 24,
    },
    handleWrap: {
      alignItems: 'center',
      paddingTop: 10,
      paddingBottom: 8,
    },
    handle: {
      width: 42,
      height: 4,
      borderRadius: 999,
    },
    header: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      paddingHorizontal: 20,
      paddingTop: 4,
      paddingBottom: 12,
    },
    title: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 26,
      lineHeight: 32,
      marginBottom: 4,
    },
    dateLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
    },
    closeBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    content: {
      paddingHorizontal: 20,
      paddingBottom: 12,
    },
    description: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      lineHeight: 22,
      marginBottom: 16,
    },
    sectionWrap: {
      marginBottom: 20,
    },
    sectionTitle: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 20,
      marginBottom: 10,
    },
    optionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
    },
    optionColumn: {
      gap: 8,
    },
    optionBtn: {
      minHeight: 40,
      paddingHorizontal: 14,
      paddingVertical: 10,
      borderRadius: 999,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionText: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
    },
    sectionEyebrow: {
        fontFamily: theme.fonts.sans,
        fontSize: 14,
        letterSpacing: 2.4,
        textTransform: 'uppercase',
        marginBottom: 12,
    },
    moodBtn: {
      minHeight: 54,
      minWidth: 96,
      paddingHorizontal: 18,
      paddingVertical: 12,
      borderRadius: 18,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      
    },

    moodLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
    },
    flowBtn: {
      minHeight: 80,
      minWidth: 86,
      borderRadius: 18,
      borderWidth: 1,
      paddingHorizontal: 14,
      paddingVertical: 12,
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
    },
    flowDots: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 6,
    },
    flowDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
    },
    flowNone: {
      fontSize: 18,
      lineHeight: 18,
    },
    flowLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
    },
    energyBtn: {
      minHeight: 64,
      minWidth: 86,
      paddingHorizontal: 12,
      paddingVertical: 10,
      borderRadius: 16,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      gap: 6,
    },
    energyBars: {
      flexDirection: 'row',
      alignItems: 'flex-end',
      gap: 3,
      minHeight: 14,
    },
    energyBar: {
      width: 6,
      borderRadius: 999,
    },
    energyLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
    },
    notesInput: {
      minHeight: 108,
      borderWidth: 1,
      borderRadius: 16,
      paddingHorizontal: 14,
      paddingVertical: 12,
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      lineHeight: 20,
    },
    error: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      lineHeight: 18,
      marginBottom: 12,
    },
    primaryBtn: {
      minHeight: 50,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 8,
    },
    primaryBtnText: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 15,
    },
    secondaryBtn: {
      minHeight: 50,
      borderRadius: 999,
      borderWidth: 1,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 10,
    },
    secondaryBtnText: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 15,
    },
    periodStartBtn: {
      paddingVertical: 14,
      paddingHorizontal: 16,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.borderRose,
      backgroundColor: c.bgSecondary,
      alignItems: 'center',
      marginBottom: 8,
    },
    periodStartBtnActive: {
      borderColor: c.accentRose,
      backgroundColor: 'rgba(217,155,155,0.1)',
    },
    periodStartBtnText: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 14,
      color: c.textMuted,
    },
    periodStartBtnTextActive: {
      color: c.accentRose,
    },
  })
}