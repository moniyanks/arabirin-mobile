import { useState } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  ActivityIndicator
} from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import { authFlowService } from '../../../services/authFlowService'
import { useColors } from '../../../styles'
import { makeAuthStyles } from '../../../styles/screens/auth'
import ArabirinIcon from '../../../assets/icons/arabirin.svg'

type Step = 'welcome' | 'email' | 'otp'

function ArcDecoration({ color }: { color: string }) {
  return (
    <View
      style={{
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        alignItems: 'center',
        height: 280
      }}
    >
      <Svg width="390" height="280" viewBox="0 0 390 280" fill="none">
        <Circle cx="195" cy="-20" r="160" stroke={color} strokeWidth={0.5} opacity={0.12} />
        <Circle cx="195" cy="-20" r="210" stroke={color} strokeWidth={0.4} opacity={0.07} />
        <Circle cx="195" cy="-20" r="260" stroke={color} strokeWidth={0.35} opacity={0.04} />
      </Svg>
    </View>
  )
}

function normalizeEmailInput(value: string): string {
  return value.trim().toLowerCase()
}

function formatAuthError(error: unknown): string {
  if (error instanceof Error && error.message.trim()) {
    return error.message
  }

  return 'Something went wrong. Please try again.'
}

export default function AuthScreen() {
  const colors = useColors()
  const s = makeAuthStyles(colors)
  const router = useRouter()

  const [step, setStep] = useState<Step>('welcome')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const canSubmitEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalizeEmailInput(email))
  const canSubmitOtp = otp.replace(/\D/g, '').length === 6

  const handleSendOtp = async () => {
    if (!canSubmitEmail || loading) return

    setLoading(true)
    setError('')

    try {
      const normalizedEmail = await authFlowService.requestOtp(email)
      setEmail(normalizedEmail)
      setOtp('')
      setStep('otp')
    } catch (err) {
      setError(formatAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (!canSubmitOtp || loading) return

    setLoading(true)
    setError('')

    try {
      const normalizedOtp = otp.replace(/\D/g, '').slice(0, 6)
      const result = await authFlowService.verifyOtpAndResolveRoute(email, normalizedOtp)
      router.replace(result.route)
    } catch (err) {
      setError(formatAuthError(err))
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={s.safe}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.inner}>
            {step === 'welcome' && (
              <View style={s.welcomeContainer}>
                <ArcDecoration color={colors.accentRose} />

                <View style={s.logoMark}>
                  <ArabirinIcon width={80} height={80} color={colors.accentRose} />
                </View>

                <Text style={s.appName}>Welcome to{'\n'}Àràbìrín</Text>

                <Text style={s.subtitle}>
                  Your body holds wisdom.{'\n'}Let&apos;s help you understand it.
                </Text>

                <Pressable style={s.btn} onPress={() => setStep('email')}>
                  <Text style={s.btnText}>Let&apos;s Begin →</Text>
                </Pressable>

                <Pressable style={s.ghostBtn} onPress={() => setStep('email')}>
                  <Text style={s.ghostBtnText}>
                    Already have an account?{' '}
                    <Text style={{ textDecorationLine: 'underline' }}>Sign in</Text>
                  </Text>
                </Pressable>
              </View>
            )}

            {step === 'email' && (
              <View style={s.stepContainer}>
                <Text style={s.stepLabel}>Sign in</Text>
                <Text style={s.heading}>Enter your email</Text>
                <Text style={s.hint}>We&apos;ll send you a secure one-time sign-in code.</Text>

                <TextInput
                  style={s.input}
                  placeholder="you@example.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={(value) => {
                    setEmail(value)
                    if (error) setError('')
                  }}
                  autoCapitalize="none"
                  autoCorrect={false}
                  keyboardType="email-address"
                  textContentType="emailAddress"
                  autoComplete="email"
                />

                {!!error && <Text style={s.error}>{error}</Text>}

                <Pressable
                  style={[s.btn, (!canSubmitEmail || loading) && s.btnDisabled]}
                  onPress={handleSendOtp}
                  disabled={!canSubmitEmail || loading}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.accentRose} />
                  ) : (
                    <Text style={s.btnText}>Send code →</Text>
                  )}
                </Pressable>

                <Pressable
                  style={s.ghostBtn}
                  onPress={() => {
                    if (loading) return
                    setStep('welcome')
                    setError('')
                  }}
                >
                  <Text style={s.ghostBtnText}>← Back</Text>
                </Pressable>
              </View>
            )}

            {step === 'otp' && (
              <View style={s.stepContainer}>
                <Text style={s.stepLabel}>Verify</Text>
                <Text style={s.heading}>Check your email</Text>
                <Text style={s.hint}>
                  We sent a 6-digit code to{'\n'}
                  <Text style={s.emailHighlight}>{normalizeEmailInput(email)}</Text>
                </Text>

                <TextInput
                  style={s.otpInput}
                  placeholder="000000"
                  placeholderTextColor={colors.textMuted}
                  value={otp}
                  onChangeText={(value) => {
                    setOtp(value.replace(/\D/g, '').slice(0, 6))
                    if (error) setError('')
                  }}
                  keyboardType="number-pad"
                  autoComplete="one-time-code"
                  textContentType="oneTimeCode"
                  autoFocus
                />

                {!!error && <Text style={s.error}>{error}</Text>}

                <Pressable
                  style={[s.btn, (!canSubmitOtp || loading) && s.btnDisabled]}
                  onPress={handleVerifyOtp}
                  disabled={!canSubmitOtp || loading}
                >
                  {loading ? (
                    <ActivityIndicator color={colors.accentRose} />
                  ) : (
                    <Text style={s.btnText}>Verify →</Text>
                  )}
                </Pressable>

                <Pressable
                  style={s.ghostBtn}
                  onPress={() => {
                    if (loading) return
                    setStep('email')
                    setOtp('')
                    setError('')
                  }}
                >
                  <Text style={s.ghostBtnText}>← Use a different email</Text>
                </Pressable>
              </View>
            )}
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  )
}
