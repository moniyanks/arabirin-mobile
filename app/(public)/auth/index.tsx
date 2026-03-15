import { useState } from 'react'
import {
  View, Text, TextInput, Pressable,
  KeyboardAvoidingView, Platform,
  ScrollView, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { supabase } from '../../../lib/supabase'
import { useColors } from '../../../styles'
import { makeAuthStyles } from '../../../styles/screens/auth'

type Step = 'welcome' | 'email' | 'otp'

export default function AuthScreen() {
  const colors = useColors()
  const s = makeAuthStyles(colors)
  const router = useRouter()

  const [step, setStep] = useState<Step>('welcome')
  const [email, setEmail] = useState('')
  const [otp, setOtp] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const handleSendOtp = async () => {
    if (!email.includes('@')) return
    setLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.auth.signInWithOtp({ email })
      if (err) throw err
      setStep('otp')
    } catch (err: any) {
      setError(err.message || 'Failed to send code')
    } finally {
      setLoading(false)
    }
  }

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) return
    setLoading(true)
    setError('')
    try {
      const { error: err } = await supabase.auth.verifyOtp({
        email,
        token: otp,
        type: 'email',
      })
      if (err) throw new Error('Invalid or expired code. Please request a new one.')

      // Check what user needs next and navigate directly
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Authentication failed')

      const { data: consent } = await supabase
        .from('user_consents')
        .select('user_id')
        .eq('user_id', user.id)
        .maybeSingle()

      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle()

      if (!consent) {
        router.replace('/(setup)/consent')
      } else if (!profile) {
        router.replace('/(setup)/onboarding')
      } else {
        router.replace('/(tabs)')
      }
    } catch (err: any) {
      setError(err.message || 'Failed to verify code')
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
          contentContainerStyle={s.scroll}
          keyboardShouldPersistTaps="handled"
          showsVerticalScrollIndicator={false}
        >
          <View style={s.inner}>

            {/* ── Welcome ── */}
            {step === 'welcome' && (
              <View style={s.welcomeContainer}>
                <Text style={s.logoMark}>◉</Text>
                <Text style={s.appName}>Welcome to Àràbìrín</Text>
                <Text style={s.subtitle}>
                  Your body holds wisdom.{'\n'}Let's help you understand it.
                </Text>
                <Pressable style={s.btn} onPress={() => setStep('email')}>
                  <Text style={s.btnText}>Let's Begin →</Text>
                </Pressable>
              </View>
            )}

            {/* ── Email ── */}
            {step === 'email' && (
              <View style={s.stepContainer}>
                <Text style={s.stepLabel}>Sign in or create an account</Text>
                <Text style={s.heading}>What’s your email?</Text>
                <Text style={s.hint}>
                  We’ll send you a one-time code.{'\n'}No password needed.
                </Text>
                <TextInput
                  style={s.input}
                  placeholder="your@email.com"
                  placeholderTextColor={colors.textMuted}
                  value={email}
                  onChangeText={(v) => setEmail(v.trim())}
                  keyboardType="email-address"
                  autoCapitalize="none"
                  autoComplete="email"
                  autoFocus
                />
                {!!error && <Text style={s.error}>{error}</Text>}
                <Pressable
                  style={[s.btn, (!email.includes('@') || loading) && s.btnDisabled]}
                  onPress={handleSendOtp}
                  disabled={!email.includes('@') || loading}
                >
                  {loading
                    ? <ActivityIndicator color={colors.bgPrimary} />
                    : <Text style={s.btnText}>Send code →</Text>
                  }
                </Pressable>
                <Pressable
                  style={s.ghostBtn}
                  onPress={() => setStep('welcome')}
                >
                  <Text style={s.ghostBtnText}>← Back</Text>
                </Pressable>
              </View>
            )}

            {/* ── OTP ── */}
            {step === 'otp' && (
              <View style={s.stepContainer}>
                <Text style={s.stepLabel}>Verify</Text>
                <Text style={s.heading}>Check your email</Text>
                <Text style={s.hint}>
                  We sent a 6-digit code to{'\n'}
                  <Text style={s.emailHighlight}>{email}</Text>
                </Text>
                <TextInput
                  style={s.otpInput}
                  placeholder="000000"
                  placeholderTextColor={colors.textMuted}
                  value={otp}
                  onChangeText={(v) => setOtp(v.replace(/\D/g, '').slice(0, 6))}
                  keyboardType="number-pad"
                  autoComplete="one-time-code"
                  autoFocus
                />
                {!!error && <Text style={s.error}>{error}</Text>}
                <Pressable
                  style={[s.btn, (otp.length < 6 || loading) && s.btnDisabled]}
                  onPress={handleVerifyOtp}
                  disabled={otp.length < 6 || loading}
                >
                  {loading
                    ? <ActivityIndicator color={colors.bgPrimary} />
                    : <Text style={s.btnText}>Verify →</Text>
                  }
                </Pressable>
                <Pressable
                  style={s.ghostBtn}
                  onPress={() => { setStep('email'); setOtp(''); setError('') }}
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
