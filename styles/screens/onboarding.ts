import { StyleSheet } from 'react-native'
import { theme, type ThemeColors } from '../../constants/theme'

export const makeOnboardingStyles = (c: ThemeColors) =>
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
      paddingTop: 8,
      paddingBottom: 8,
    },
    stepLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: c.textMuted,
      textAlign: 'center',
      marginBottom: 12,
    },
    progressRow: {
      flexDirection: 'row',
      justifyContent: 'center',
      gap: 8,
    },
    progressDot: {
      width: 8,
      height: 8,
      borderRadius: 999,
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose
    },
    progressDotActive: {
      backgroundColor: c.accentRose,
      borderColor: c.accentRose
    },
    progressDotDone: {
      backgroundColor: c.accentGold,
      borderColor: c.accentGold,
    },

    // ── Content area ──
    content: {
      flex: 1,
      paddingHorizontal: 24,
      paddingTop: 40,
    },

    // ── Welcome step ──
    welcomeInner: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 40,
    },
    logoMark: {
      fontFamily: theme.fonts.serif,
      fontSize: 56,
      color: c.accentRose,
      textAlign: 'center',
      marginBottom: 16,
    },
    appName: {
      fontFamily: theme.fonts.serif,
      fontSize: 36,
      color: c.accentRose,
      textAlign: 'center',
      marginBottom: 12,
    },
    subtitle: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      color: c.textMuted,
      textAlign: 'center',
      lineHeight: 22,
      marginBottom: 56,
      paddingHorizontal: 16,
    },

    // ── Questions ──
    question: {
      fontFamily: theme.fonts.serif,
      fontSize: 28,
      color: c.accentGold,
      marginBottom: 8,
      lineHeight: 34,
      textAlign: 'center',
    },
    hint: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
      lineHeight: 20,
      marginBottom: 32,
      textAlign: 'center',
    },

    // ── Text input ──
    textInput: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 14,
      paddingVertical: 16,
      paddingHorizontal: 20,
      color: c.accentGold,
      fontFamily: theme.fonts.sans,
      fontSize: 16,
      marginBottom: 32,
      minHeight: 54,
    },

    // ── Option buttons ──
    optionRow: {
      flexDirection: 'row',
      flexWrap: 'wrap',
      gap: 10,
      marginBottom: 16,
      textAlign: 'center',
    },
    optionBtn: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 12,
      paddingVertical: 12,
      paddingHorizontal: 18,
      minHeight: 44,
      minWidth: 44,
      alignItems: 'center',
      justifyContent: 'center',
    },
    optionBtnText: {
      fontFamily: theme.fonts.sans,
      fontSize: 15,
      color: c.textMuted,
    },
    optionSelected: {
      backgroundColor: c.accentRose,
      borderColor: c.accentRose,
    },
    optionSelectedText: {
      color: c.bgPrimary,
      fontFamily: theme.fonts.sansSemiBold,
    },

    // ── Mode list ──
    modeList: {
      width: '100%',
      gap: 12,
    },
    modeBtn: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 14,
      paddingVertical: 16,
      paddingHorizontal: 18,
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: 12,
      minHeight: 64,
    },
    modeBtnSelected: {
      borderColor: c.accentRose,
      backgroundColor: 'rgba(217, 155, 155, 0.08)',
    },
    modeBtnInner: {
      flex: 1,
      gap: 3,
    },
    modeLabel: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 15,
      color: c.accentGold,
    },
    modeDesc: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: c.textMuted,
      lineHeight: 18,
    },
    modeCheck: {
      width: 22,
      height: 22,
      borderRadius: 11,
      borderWidth: 1.5,
      borderColor: c.borderRose,
      alignItems: 'center',
      justifyContent: 'center',
      flexShrink: 0,
    },
    modeCheckActive: {
      backgroundColor: c.accentRose,
      borderColor: c.accentRose,
    },
    modeCheckTick: {
      color: c.bgPrimary,
      fontSize: 12,
      fontWeight: '700',
    },

    modeCard: {
      width: '100%',
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 16,
      paddingVertical: 18,
      paddingHorizontal: 16,
    },
    modeCardActive: {
      borderColor: c.accentRose,
      backgroundColor: c.bgSecondary,
    },
    modeTitle: {
      fontFamily: theme.fonts.serif,
      fontSize: 20,
      color: c.accentGold,
      marginBottom: 6,
    },
    modeTitleActive: {
      color: c.accentRose,
    },

    modeDescActive: {
      color: c.textPrimary,
    },

    // ── Date display ──
    dateDisplay: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 14,
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginBottom: 12,
      minHeight: 54,
      justifyContent: 'center',
    },
    dateDisplayText: {
      fontFamily: theme.fonts.sans,
      fontSize: 16,
      color: c.accentGold,
    },
    dateHint: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: c.textMuted,
      marginBottom: 32,
      lineHeight: 18,
    },

    // ── Inline date picker rows ──
    datePickerRow: {
      flexDirection: 'row',
      gap: 8,
      marginBottom: 32,
    },
    datePickerCol: {
      flex: 1,
      gap: 6,
    },
    datePickerLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 10,
      color: c.textMuted,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
    },
    datePickerScroll: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 12,
      maxHeight: 180,
    },
    datePickerItem: {
      paddingVertical: 12,
      paddingHorizontal: 12,
      alignItems: 'center',
    },
    datePickerItemText: {
      fontFamily: theme.fonts.sans,
      fontSize: 15,
      color: c.textMuted,
    },
    datePickerItemSelected: {
      backgroundColor: 'rgba(217, 155, 155, 0.12)',
    },
    datePickerItemTextSelected: {
      color: c.accentRose,
      fontFamily: theme.fonts.sansSemiBold,
    },

    // ── Footer ──
    footer: {
      paddingHorizontal: 24,
      paddingTop: 12,
      paddingBottom: 16,
      borderTopWidth: 1,
      borderTopColor: c.borderRose,
      backgroundColor: c.bgPrimary,
      gap: 12,
    },
    btn: {
      minHeight: 54,
      borderRadius: 999,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: c.accentRose,
    },
    btnDisabled: {
      opacity: 0.5,
    },
    btnText: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 16,
      color: c.bgPrimary,
    },
    ghostBtn: {
      alignItems: 'center',
      minHeight: 44,
      justifyContent: 'center',
    },
    ghostBtnText: {
      fontFamily: theme.fonts.sans,
      fontSize: 15,
      color: c.textMuted,
    },
    error: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.accentRose,
      textAlign: 'center',
    },

    stepCount: {
      fontFamily: theme.fonts.sans,
      fontSize: 12,
      color: c.textMuted,
      letterSpacing: 1.6,
      textTransform: 'uppercase',
      marginBottom: 24,
      textAlign: 'center',
    },
    questionSmall: {
      fontFamily: theme.fonts.serif,
      fontSize: 24,
      color: c.accentGold,
      textAlign: 'center',
      marginBottom: 8,
      marginTop: 32,
      lineHeight: 30,
    },
    dateField: {
      width: '100%',
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 14,
      paddingVertical: 16,
      paddingHorizontal: 20,
      marginBottom: 32,
      minHeight: 54,
      justifyContent: 'center',
    },
    dateFieldText: {
      fontFamily: theme.fonts.sans,
      fontSize: 16,
      color: c.accentGold,
    }, 
    
  })
