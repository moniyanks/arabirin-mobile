import { StyleSheet } from 'react-native'
import { theme } from '..'

export function makeJourneyChangeSheetStyles(c: any) {
  return StyleSheet.create({
    overlay: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.45)',
      justifyContent: 'flex-end'
    },
    backdrop: {
      flex: 1
    },
    sheet: {
      backgroundColor: c.bgSecondary,
      borderTopLeftRadius: 24,
      borderTopRightRadius: 24,
      paddingHorizontal: 20,
      paddingTop: 12,
      paddingBottom: 24,
      gap: 14
    },
    handleWrap: {
      alignItems: 'center',
      marginBottom: 2
    },
    handle: {
      width: 44,
      height: 5,
      borderRadius: 999,
      backgroundColor: c.borderSoft
    },
    title: {
      ...theme.typography.titleLg,
      color: c.textPrimary
    },
    body: {
      ...theme.typography.bodyMd,
      color: c.textMuted
    },
    optionsList: {
      gap: 10
    },
    optionCard: {
      padding: 16,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.borderSoft,
      backgroundColor: c.cardSoft,
      gap: 4
    },
    optionCardDisabled: {
      opacity: 0.55
    },
    optionTitle: {
      ...theme.typography.titleMd,
      color: c.textPrimary
    },
    optionText: {
      ...theme.typography.bodySm,
      color: c.textMuted
    },
    sectionTitle: {
      ...theme.typography.titleMd,
      color: c.textPrimary,
      marginTop: 2
    },
    helperText: {
      ...theme.typography.bodySm,
      color: c.textMuted,
      lineHeight: 20
    },
    dateField: {
      paddingHorizontal: 14,
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.borderSoft,
      backgroundColor: c.bgPrimary
    },
    dateFieldText: {
      ...theme.typography.bodyMd,
      color: c.textPrimary
    },
    error: {
      ...theme.typography.bodySm,
      color: c.accentRose
    },
    actionRow: {
      flexDirection: 'row',
      gap: 10,
      marginTop: 4
    },
    secondaryBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 14,
      borderWidth: 1,
      borderColor: c.borderSoft,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.bgSecondary
    },
    secondaryBtnText: {
      ...theme.typography.button,
      color: c.textPrimary
    },
    primaryBtn: {
      flex: 1,
      paddingVertical: 14,
      borderRadius: 14,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.accentRose
    },
    primaryBtnDisabled: {
      opacity: 0.7
    },
    primaryBtnText: {
      ...theme.typography.button,
      color: c.bgPrimary
    }
  })
}
