import { StyleSheet } from 'react-native'
import { theme, type ThemeColors } from '../../constants/theme'

export function makeAppointmentStyles(c: ThemeColors) {
  return StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.bgPrimary,
    },
    topBar: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      justifyContent: 'space-between',
      paddingHorizontal: 20,
      paddingTop: 16,
      paddingBottom: 12,
      borderBottomWidth: 1,
      borderBottomColor: c.borderRose,
    },
    topBarTitle: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 24,
      color: c.accentGold,
    },
    topBarSub: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: c.textMuted,
      marginTop: 2,
    },
    closeBtn: {
      width: 36,
      height: 36,
      alignItems: 'center',
      justifyContent: 'center',
    },
    container: {
      flex: 1,
    },
    content: {
      paddingHorizontal: 16,
      paddingTop: 16,
      paddingBottom: 48,
      gap: 2,
    },

    // Report header
    reportHeader: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 16,
      padding: 16,
      gap: 4,
      marginBottom: 10,
    },
    reportName: {
      fontFamily: theme.fonts.serifSemiBold,
      fontSize: 22,
      color: c.accentGold,
    },
    reportMeta: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
    },

    // Disclaimer
    disclaimer: {
      backgroundColor: 'rgba(217,155,155,0.06)',
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 12,
      padding: 12,
      marginBottom: 10,
    },
    disclaimerText: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      lineHeight: 18,
      color: c.textMuted,
    },

    // Sections
    sectionHeader: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 12,
      padding: 16,
      marginTop: 8,
    },
    sectionTitle: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 15,
      color: c.textPrimary,
    },
    sectionBody: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderTopWidth: 0,
      borderColor: c.borderRose,
      borderBottomLeftRadius: 12,
      borderBottomRightRadius: 12,
      padding: 16,
      gap: 12,
      marginTop: -8,
    },
    emptyText: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
      lineHeight: 20,
    },

    // Data rows
    dataRow: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      paddingVertical: 6,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(217,155,155,0.08)',
    },
    dataLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
      flex: 1,
    },
    dataValue: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 13,
      color: c.textPrimary,
    },

    // Sub sections
    subSection: {
      gap: 4,
    },
    subSectionTitle: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 12,
      textTransform: 'uppercase',
      letterSpacing: 1,
      color: c.accentRose,
      marginBottom: 4,
    },

    // Questions
    questionsIntro: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
      lineHeight: 20,
      marginBottom: 8,
    },
    questionItem: {
      flexDirection: 'row',
      gap: 12,
      alignItems: 'flex-start',
      paddingVertical: 8,
      borderBottomWidth: 1,
      borderBottomColor: 'rgba(217,155,155,0.08)',
    },
    questionNumber: {
      width: 24,
      height: 24,
      borderRadius: 12,
      backgroundColor: 'rgba(217,155,155,0.1)',
      borderWidth: 1,
      borderColor: c.borderRose,
      alignItems: 'center',
      justifyContent: 'center',
    },
    questionNumberText: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 11,
      color: c.accentRose,
    },
    questionText: {
      flex: 1,
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      lineHeight: 21,
      color: c.textPrimary,
    },

    // Share button
    shareBtn: {
      backgroundColor: c.accentRose,
      borderRadius: 14,
      paddingVertical: 16,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      marginTop: 24,
    },
    shareBtnText: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 16,
      color: c.bgPrimary,
    },
    footerNote: {
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      color: c.textMuted,
      textAlign: 'center',
      marginTop: 12,
    },
    sourcesCard: {
        backgroundColor: c.bgSecondary,
        borderWidth: 1,
        borderColor: c.borderRose,
        borderRadius: 12,
        padding: 14,
        marginTop: 16,
        gap: 8,
    },
    sourcesTitle: {
        fontFamily: theme.fonts.sansSemiBold,
        fontSize: 11,
        textTransform: 'uppercase',
        letterSpacing: 1,
        color: c.textMuted,
    },
    sourcesText: {
        fontFamily: theme.fonts.sans,
        fontSize: 11,
        lineHeight: 18,
        color: c.textMuted,
    },
  })
}