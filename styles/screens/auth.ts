import { StyleSheet } from 'react-native'
import { theme, type ThemeColors } from '../../constants/theme'

export const makeAuthStyles = (c: ThemeColors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.bgPrimary,
    },
    scroll: {
      flex: 1,
    },
    inner: {
      flex: 1,
      paddingHorizontal: 28,
      paddingBottom: 40,
    },

    // ── Welcome step ──
    welcomeContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingBottom: 40,
      gap: 0,
    },
    // arc decoration sits behind everything
    arcContainer: {
      position: 'absolute',
      top: 0,
      left: 0,
      right: 0,
      alignItems: 'center',
      height: 300,
    },
    logoMark: {
      marginBottom: 0,
    },
    appName: {
      fontFamily: theme.fonts.serif,
      fontSize: 34,
      color: c.accentRose,
      textAlign: 'center',
      marginBottom: 14,
      lineHeight: 42,
    },
    subtitle: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      color: c.textMuted,
      textAlign: 'center',
      lineHeight: 23,
      marginBottom: 40,
      paddingHorizontal: 24,
    },

    // ── Email / OTP steps ──
    stepContainer: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 0,
      paddingBottom: 80,
    },
    stepLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      color: c.textMuted,
      letterSpacing: 1.2,
      textTransform: 'uppercase',
      marginBottom: 12,
      opacity: 0.6,
    },
    heading: {
      fontFamily: theme.fonts.serif,
      fontSize: 32,
      color: c.accentRose,
      marginBottom: 10,
      lineHeight: 38,
    },
    hint: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      color: c.textMuted,
      lineHeight: 22,
      marginBottom: 28,
    },
    emailHighlight: {
      color: c.accentRose,
      fontFamily: theme.fonts.sansMedium,
    },
    input: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: theme.radius.md,
      paddingVertical: 16,
      paddingHorizontal: 20,
      color: c.accentGold,
      fontFamily: theme.fonts.sans,
      fontSize: 15,
      marginBottom: 28,
      minHeight: 54,
    },
    otpInput: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: theme.radius.md,
      paddingVertical: 16,
      paddingHorizontal: 20,
      color: c.accentRose,
      fontFamily: theme.fonts.sans,
      fontSize: 30,
      letterSpacing: 12,
      textAlign: 'center',
      marginBottom: 28,
      minHeight: 64,
    },

    // ── Buttons ──
    btn: {
      borderWidth: 1.4,
      borderColor: c.accentRose,
      borderRadius: theme.radius.pill,
      paddingVertical: 18,
      paddingHorizontal: 40,
      alignItems: 'center',
      alignSelf: 'stretch',
      backgroundColor: 'transparent',
    },
    btnDisabled: {
      opacity: 0.3,
    },
    btnText: {
      fontFamily: theme.fonts.sansMedium,
      fontSize: 15,
      color: c.accentRose,
      letterSpacing: 0.4,
    },
    ghostBtn: {
      alignItems: 'center',
      marginTop: 14,
      padding: 8,
      minHeight: 44,
      justifyContent: 'center',
    },
    ghostBtnText: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: c.textMuted,
    },
    error: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: '#e07878',
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 19,
    },
  })