import { StyleSheet } from 'react-native'
import { theme, type ThemeColors } from '../../constants/theme'

export const makeAuthStyles = (c: ThemeColors) =>
  StyleSheet.create({
    safe: {
      flex: 1,
      backgroundColor: c.bgPrimary,
    },
    scroll: {
      flexGrow: 1,
    },
    inner: {
      flex: 1,
      paddingHorizontal: 24,
      paddingBottom: 40,
    },

    // ── Welcome step ──
    welcomeContainer: {
      flex: 1,
      alignItems: 'center',
      justifyContent: 'center',
      paddingTop: 80,
      paddingBottom: 60,
      gap: 0,
    },
    logoMark: {
      fontFamily: theme.fonts.serif,
      fontSize: 56,
      color: c.accentRose,
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 64,
    },
    appName: {
      fontFamily: theme.fonts.serif,
      fontSize: 36,
      color: c.accentRose,
      textAlign: 'center',
      marginBottom: 16,
      lineHeight: 42,
    },
    subtitle: {
      fontFamily: theme.fonts.sans,
      fontSize: 15,
      color: c.textMuted,
      textAlign: 'center',
      lineHeight: 24,
      marginBottom: 40,
      paddingHorizontal: 16,
    },

    // ── Email / OTP steps ──
    stepContainer: {
      flex: 1,
      paddingTop: 80,
    },
    stepLabel: {
      fontFamily: theme.fonts.sans,
      fontSize: 11,
      color: c.textMuted,
      letterSpacing: 1.6,
      textTransform: 'uppercase',
      marginBottom: 16,
    },
    heading: {
      fontFamily: theme.fonts.serif,
      fontSize: 28,
      color: c.accentGold,
      marginBottom: 8,
      lineHeight: 34,
    },
    hint: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      color: c.textMuted,
      lineHeight: 22,
      marginBottom: 32,
    },
    emailHighlight: {
      color: c.accentRose,
      fontFamily: theme.fonts.sansMedium,
    },
    input: {
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
    otpInput: {
      backgroundColor: c.bgSecondary,
      borderWidth: 1,
      borderColor: c.borderRose,
      borderRadius: 14,
      paddingVertical: 16,
      paddingHorizontal: 20,
      color: c.accentGold,
      fontFamily: theme.fonts.sans,
      fontSize: 28,
      letterSpacing: 10,
      textAlign: 'center',
      marginBottom: 32,
      minHeight: 54,
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
    },
    btnDisabled: {
      opacity: 0.4,
    },
    btnText: {
      fontFamily: theme.fonts.sansSemiBold,
      fontSize: 16,
      color: c.bgPrimary,
    },
    ghostBtn: {
      alignItems: 'center',
      marginTop: 16,
      padding: 8,
      minHeight: 44,
      justifyContent: 'center',
    },
    ghostBtnText: {
      fontFamily: theme.fonts.sans,
      fontSize: 14,
      color: c.textMuted,
    },
    error: {
      fontFamily: theme.fonts.sans,
      fontSize: 13,
      color: '#ff8080',
      textAlign: 'center',
      marginBottom: 16,
    },
  })
