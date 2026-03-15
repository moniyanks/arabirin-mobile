import { StyleSheet } from 'react-native'
import { theme, type ThemeColors } from '../../constants/theme'

export const makeConsentStyles = (c: ThemeColors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.bgPrimary,
    },
    container: {
      flex: 1,
    },

    // ── Header ──
    header: {
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 16,
      borderBottomWidth: 1,
      borderBottomColor: c.borderRose,
    },
    stepLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      color: c.textMuted,
      letterSpacing: 1.6,
      textTransform: 'uppercase',
      marginBottom: 6,
    },
    stepTitle: {
      fontFamily: theme.fonts.serif,
      fontSize: 26,
      color: c.accentGold,
      lineHeight: 32,
    },
    progressRow: {
      flexDirection: 'row',
      gap: 6,
      marginTop: 16,
    },
    progressDot: {
      height: 3,
      flex: 1,
      borderRadius: 2,
      backgroundColor: c.borderRose,
    },
    progressDotActive: {
      backgroundColor: c.accentRose,
    },
    progressDotDone: {
      backgroundColor: c.accentSage,
    },

    // ── Scrollable document area ──
    docScroll: {
      flex: 1,
    },
    docContent: {
      paddingHorizontal: 24,
      paddingTop: 24,
      paddingBottom: 40,
    },

    // ── Legal document typography ──
    docTitle: {
      fontFamily: theme.fonts.serif,
      fontSize: 22,
      color: c.accentRose,
      marginBottom: 4,
    },
    docVersion: {
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      color: c.textMuted,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginBottom: 24,
    },
    docSection: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 13,
      color: c.accentRose,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginTop: 24,
      marginBottom: 8,
    },
    docBody: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      color: c.textMuted,
      lineHeight: 22,
      marginBottom: 12,
    },
    docBullet: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      color: c.textMuted,
      lineHeight: 22,
      marginBottom: 6,
      paddingLeft: 16,
    },
    docHighlight: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 14,
      color: c.accentGold,
      lineHeight: 22,
    },
    docLink: {
      color: c.accentRose,
    },

    // ── Scroll indicator ──
    scrollIndicator: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 8,
      paddingVertical: 12,
      backgroundColor: c.bgSecondary,
      borderTopWidth: 1,
      borderTopColor: c.borderRose,
    },
    scrollIndicatorText: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: c.textMuted,
      letterSpacing: 0.5,
    },

    // ── Bottom action area ──
    footer: {
      paddingHorizontal: 24,
      paddingTop: 16,
      paddingBottom: 32,
      borderTopWidth: 1,
      borderTopColor: c.borderRose,
      backgroundColor: c.bgPrimary,
      gap: 12,
    },
    checkRow: {
      flexDirection: 'row',
      alignItems: 'flex-start',
      gap: 12,
    },
    checkbox: {
      width: 22,
      height: 22,
      borderRadius: 6,
      borderWidth: 1.5,
      borderColor: c.borderRose,
      alignItems: 'center',
      justifyContent: 'center',
      marginTop: 2,
      flexShrink: 0,
    },
    checkboxChecked: {
      backgroundColor: c.accentRose,
      borderColor: c.accentRose,
    },
    checkboxTick: {
      color: c.bgPrimary,
      fontSize: 13,
      fontWeight: '700',
    },
    checkLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      color: c.textMuted,
      lineHeight: 20,
      flex: 1,
    },
    checkLabelBold: {
      fontFamily: theme.fonts.sansSemiBold,
      color: c.accentGold,
    },

    // ── Buttons ──
    btn: {
      backgroundColor: c.accentRose,
      borderRadius: 14,
      paddingVertical: 18,
      alignItems: 'center',
      shadowColor: c.accentRose,
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.3,
      shadowRadius: 10,
      elevation: 6,
      marginTop: 4,
    },
    btnDisabled: {
      opacity: 0.35,
    },
    btnText: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 16,
      color: c.bgPrimary,
    },
    ghostBtn: {
      alignItems: 'center',
      padding: 8,
      minHeight: 44,
      justifyContent: 'center',
    },
    ghostBtnText: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      color: c.textMuted,
    },

    // ── Age gate screen ──
    ageContainer: {
      flex: 1,
      paddingHorizontal: 24,
      justifyContent: 'center',
      paddingBottom: 60,
    },
    ageIcon: {
      fontSize: 48,
      textAlign: 'center',
      marginBottom: 24,
    },
    ageTitle: {
      fontFamily: theme.fonts.serif,
      fontSize: 28,
      color: c.accentGold,
      textAlign: 'center',
      marginBottom: 12,
      lineHeight: 34,
    },
    ageSubtitle: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      color: c.textMuted,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 40,
    },
    ageBtns: {
      gap: 10,
    },
    ageBtn: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 14,
      paddingVertical: 18,
      alignItems: 'center',
    },
    ageBtnText: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 16,
      color: c.accentGold,
    },
    ageBtnUnder: {
      backgroundColor: 'transparent',
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 14,
      paddingVertical: 18,
      alignItems: 'center',
    },
    ageBtnUnderText: {
      fontFamily: theme.fonts.sans,
      fontSize: 16,
      color: c.textMuted,
    },

    // ── Final confirmation screen ──
    confirmContainer: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 32,
    },
    confirmTitle: {
      fontFamily: theme.fonts.serif,
      fontSize: 22,
      color: c.accentGold,
      marginBottom: 6,
    },
    confirmSubtitle: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
      lineHeight: 20,
      marginBottom: 28,
    },
    summaryCard: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 16,
      padding: 20,
      gap: 14,
      marginBottom: 24,
    },
    summaryRow: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: 12,
    },
    summaryIcon: {
      fontSize: 18,
    },
    summaryText: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      color: c.textMuted,
      flex: 1,
      lineHeight: 20,
    },
    summaryDivider: {
      height: 1,
      backgroundColor: c.borderRose,
    },
    error: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: '#ff8080',
      textAlign: 'center',
      marginBottom: 8,
    },
  })
