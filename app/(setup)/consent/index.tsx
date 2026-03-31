import { useCallback, useState } from 'react'
import type { NativeScrollEvent, NativeSyntheticEvent } from 'react-native'
import {
  View,
  Text,
  ScrollView,
  Pressable,
  ActivityIndicator,
  Alert,
} from 'react-native'
import { useRouter } from 'expo-router'
import { SafeAreaView } from 'react-native-safe-area-context'
import Constants from 'expo-constants'
import * as Device from 'expo-device'

import { useColors } from '../../../styles'
import { makeConsentStyles } from '../../../styles/screens/consent'
import { useAppData } from '../../../context/AppDataContext'
import { PrivacyPolicyContent, TermsOfServiceContent } from '../../../components/legal/LegalDocuments'
import { setupFlowService } from '../../../services/setupFlowService'
import { toAppError } from '../../../lib/errors/appError'

type Step = 'age' | 'privacy' | 'terms' | 'confirm'

const STEPS: Step[] = ['age', 'privacy', 'terms', 'confirm']
const EFFECTIVE_DATE = '5 April 2026'
const APP_VERSION = Constants.expoConfig?.version ?? '1.0.0'

function isScrolledToBottom(event: NativeSyntheticEvent<NativeScrollEvent>): boolean {
  const { layoutMeasurement, contentOffset, contentSize } = event.nativeEvent
  return layoutMeasurement.height + contentOffset.y >= contentSize.height - 40
}

export default function ConsentScreen() {
  const colors = useColors()
  const s = makeConsentStyles(colors)
  const { refetchAll } = useAppData()
  const router = useRouter()

  const [step, setStep] = useState<Step>('age')
  const [privacyScrolled, setPrivacyScrolled] = useState(false)
  const [termsScrolled, setTermsScrolled] = useState(false)
  const [privacyViewedAt, setPrivacyViewedAt] = useState<string | null>(null)
  const [termsViewedAt, setTermsViewedAt] = useState<string | null>(null)
  const [agreedPrivacy, setAgreedPrivacy] = useState(false)
  const [agreedTerms, setAgreedTerms] = useState(false)
  const [agreedHealth, setAgreedHealth] = useState(false)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const stepIndex = STEPS.indexOf(step)

  const handlePrivacyScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (privacyScrolled) return

      if (isScrolledToBottom(event)) {
        setPrivacyScrolled(true)
        setPrivacyViewedAt(new Date().toISOString())
      }
    },
    [privacyScrolled]
  )

  const handleTermsScroll = useCallback(
    (event: NativeSyntheticEvent<NativeScrollEvent>) => {
      if (termsScrolled) return

      if (isScrolledToBottom(event)) {
        setTermsScrolled(true)
        setTermsViewedAt(new Date().toISOString())
      }
    },
    [termsScrolled]
  )

  const handleUnderAge = () => {
    Alert.alert(
      'Age Requirement',
      'Àràbìrín is designed for users aged 18 and over due to the sensitive nature of reproductive health data. We are unable to create an account for you at this time.',
      [{ text: 'OK' }]
    )
  }

  const handleSubmit = async () => {
    if (!agreedHealth || loading) return

    setLoading(true)
    setError('')

    try {
      await setupFlowService.submitConsent({
        privacyViewedAt: privacyViewedAt ?? new Date().toISOString(),
        termsViewedAt: termsViewedAt ?? new Date().toISOString(),
        appPlatform: Device.osName?.toLowerCase() ?? 'unknown',
        appVersion: APP_VERSION,
      })

      await refetchAll()
      router.replace('/(setup)/onboarding')
    } catch (err) {
      const appError = toAppError(err, {
        code: 'DB_WRITE_FAILED',
        userMessage: 'We could not save your consent right now.',
        retryable: true,
      })
      setError(appError.userMessage)
    } finally {
      setLoading(false)
    }
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.stepLabel}>
          {step === 'age' && 'Step 1 of 4 — Age Verification'}
          {step === 'privacy' && 'Step 2 of 4 — Privacy Policy'}
          {step === 'terms' && 'Step 3 of 4 — Terms of Service'}
          {step === 'confirm' && 'Step 4 of 4 — Your Consent'}
        </Text>
        <Text style={s.stepTitle}>
          {step === 'age' && 'Before we begin'}
          {step === 'privacy' && 'Privacy Policy'}
          {step === 'terms' && 'Terms of Service'}
          {step === 'confirm' && 'Review & agree'}
        </Text>
        <View style={s.progressRow}>
          {STEPS.map((st, i) => (
            <View
              key={st}
              style={[
                s.progressDot,
                i < stepIndex && s.progressDotDone,
                i === stepIndex && s.progressDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {step === 'age' && (
        <View style={s.ageContainer}>
          <Text style={s.ageIcon}>🔒</Text>
          <Text style={s.ageTitle}>Are you 18 years or older?</Text>
          <Text style={s.ageSubtitle}>
            Àràbìrín collects and processes sensitive reproductive health data.
            Under applicable data protection law, we are required to verify your
            age before processing this category of personal data.
          </Text>
          <View style={s.ageBtns}>
            <Pressable style={s.ageBtn} onPress={() => setStep('privacy')}>
              <Text style={s.ageBtnText}>Yes, I am 18 or older →</Text>
            </Pressable>
            <Pressable style={s.ageBtnUnder} onPress={handleUnderAge}>
              <Text style={s.ageBtnUnderText}>No, I am under 18</Text>
            </Pressable>
          </View>
        </View>
      )}

      {step === 'privacy' && (
        <>
          <ScrollView
            style={s.docScroll}
            contentContainerStyle={s.docContent}
            onScroll={handlePrivacyScroll}
            scrollEventThrottle={100}
            showsVerticalScrollIndicator
          >
            <PrivacyPolicyContent s={s} effectiveDate={EFFECTIVE_DATE} />
          </ScrollView>

          {!privacyScrolled && (
            <View style={s.scrollIndicator}>
              <Text style={s.scrollIndicatorText}>↓ Scroll to read the full policy</Text>
            </View>
          )}

          <View style={s.footer}>
            <View style={s.checkRow}>
              <Pressable
                style={[s.checkbox, agreedPrivacy && s.checkboxChecked]}
                onPress={() => {
                  if (!privacyScrolled) return
                  setAgreedPrivacy((value) => !value)
                }}
              >
                {agreedPrivacy && <Text style={s.checkboxTick}>✓</Text>}
              </Pressable>

              <Text style={s.checkLabel}>
                I have read and agree to the{' '}
                <Text style={s.checkLabelBold}>Privacy Policy</Text>
              </Text>
            </View>

            <Pressable
              style={[s.btn, !agreedPrivacy && s.btnDisabled]}
              onPress={() => {
                if (!agreedPrivacy) return
                setStep('terms')
              }}
              disabled={!agreedPrivacy}
            >
              <Text style={s.btnText}>Continue →</Text>
            </Pressable>
          </View>
        </>
      )}

      {step === 'terms' && (
        <>
          <ScrollView
            style={s.docScroll}
            contentContainerStyle={s.docContent}
            onScroll={handleTermsScroll}
            scrollEventThrottle={100}
            showsVerticalScrollIndicator
          >
            <TermsOfServiceContent s={s} effectiveDate={EFFECTIVE_DATE} />
          </ScrollView>

          {!termsScrolled && (
            <View style={s.scrollIndicator}>
              <Text style={s.scrollIndicatorText}>↓ Scroll to read the full terms</Text>
            </View>
          )}

          <View style={s.footer}>
            <View style={s.checkRow}>
              <Pressable
                style={[s.checkbox, agreedTerms && s.checkboxChecked]}
                onPress={() => {
                  if (!termsScrolled) return
                  setAgreedTerms((value) => !value)
                }}
              >
                {agreedTerms && <Text style={s.checkboxTick}>✓</Text>}
              </Pressable>

              <Text style={s.checkLabel}>
                I have read and agree to the{' '}
                <Text style={s.checkLabelBold}>Terms of Service</Text>
              </Text>
            </View>

            <Pressable
              style={[s.btn, !agreedTerms && s.btnDisabled]}
              onPress={() => {
                if (!agreedTerms) return
                setStep('confirm')
              }}
              disabled={!agreedTerms}
            >
              <Text style={s.btnText}>Continue →</Text>
            </Pressable>
          </View>
        </>
      )}

      {step === 'confirm' && (
        <>
          <ScrollView style={s.docScroll} contentContainerStyle={s.confirmContainer}>
            <Text style={s.confirmTitle}>Almost there</Text>
            <Text style={s.confirmSubtitle}>
              Please review what you are agreeing to before we set up your account.
            </Text>

            <View style={s.summaryCard}>
              <View style={s.summaryRow}>
                <Text style={s.summaryIcon}>✓</Text>
                <Text style={s.summaryText}>You have read the Privacy Policy</Text>
              </View>

              <View style={s.summaryDivider} />

              <View style={s.summaryRow}>
                <Text style={s.summaryIcon}>✓</Text>
                <Text style={s.summaryText}>You have read the Terms of Service</Text>
              </View>
            </View>

            <View style={s.checkRow}>
              <Pressable
                style={[s.checkbox, agreedHealth && s.checkboxChecked]}
                onPress={() => setAgreedHealth((value) => !value)}
              >
                {agreedHealth && <Text style={s.checkboxTick}>✓</Text>}
              </Pressable>

              <Text style={s.checkLabel}>
                I consent to Àràbìrín Technologies collecting, storing and processing
                my <Text style={s.checkLabelBold}>sensitive reproductive health data</Text>{' '}
                for the purpose of providing cycle tracking and health insights,
                in accordance with the Privacy Policy.
              </Text>
            </View>
          </ScrollView>

          <View style={s.footer}>
            {!!error && <Text style={s.error}>{error}</Text>}

            <Pressable
              style={[s.btn, (!agreedHealth || loading) && s.btnDisabled]}
              onPress={handleSubmit}
              disabled={!agreedHealth || loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.bgPrimary} />
              ) : (
                <Text style={s.btnText}>I agree — create my account →</Text>
              )}
            </Pressable>

            <Pressable
              style={s.ghostBtn}
              onPress={() => {
                if (loading) return
                setStep('terms')
              }}
            >
              <Text style={s.ghostBtnText}>← Back</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}