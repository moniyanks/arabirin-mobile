import React from 'react'
import { View, Text, ScrollView, Pressable } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useLocalSearchParams, useRouter } from 'expo-router'
import { useColors } from '../styles'
import { makeConsentStyles } from '../styles/screens/consent'
import { PrivacyPolicyContent, TermsOfServiceContent } from '../components/legal/LegalDocuments'

const EFFECTIVE_DATE = '5 April 2026'

type LegalTab = 'privacy' | 'terms' | 'medical'

export default function LegalScreen() {
  const colors = useColors()
  const s = makeConsentStyles(colors)
  const router = useRouter()
  const params = useLocalSearchParams<{ tab?: string }>()

  const activeTab: LegalTab =
    params.tab === 'terms' || params.tab === 'medical' || params.tab === 'privacy'
      ? params.tab
      : 'privacy'

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Pressable
          onPress={() => router.push('/(tabs)/profile')}
          style={{
            alignSelf: 'flex-start',
            paddingVertical: 6,
            paddingHorizontal: 2,
            marginBottom: 8,
          }}
        >
          <Text style={{ color: colors.accentRose, fontSize: 14 }}>← Back</Text>
        </Pressable>
        <Text style={s.stepLabel}>Legal & safety</Text>
        <Text style={s.stepTitle}>
          {activeTab === 'privacy' && 'Privacy Policy'}
          {activeTab === 'terms' && 'Terms of Service'}
          {activeTab === 'medical' && 'Medical Disclaimer'}
        </Text>

        <View style={{ flexDirection: 'row', gap: 8, marginTop: 12 }}>
          <Pressable
            onPress={() => router.replace('/legal?tab=privacy')}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: colors.borderRose,
              backgroundColor:
                activeTab === 'privacy' ? 'rgba(217,155,155,0.10)' : colors.bgSecondary,
            }}
          >
            <Text style={{ color: colors.accentRose }}>Privacy</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace('/legal?tab=terms')}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: colors.borderRose,
              backgroundColor:
                activeTab === 'terms' ? 'rgba(217,155,155,0.10)' : colors.bgSecondary,
            }}
          >
            <Text style={{ color: colors.accentRose }}>Terms</Text>
          </Pressable>

          <Pressable
            onPress={() => router.replace('/legal?tab=medical')}
            style={{
              paddingHorizontal: 14,
              paddingVertical: 8,
              borderRadius: 999,
              borderWidth: 1,
              borderColor: colors.borderRose,
              backgroundColor:
                activeTab === 'medical' ? 'rgba(217,155,155,0.10)' : colors.bgSecondary,
            }}
          >
            <Text style={{ color: colors.accentRose }}>Medical</Text>
          </Pressable>
        </View>
      </View>

      <ScrollView style={s.docScroll} contentContainerStyle={s.docContent}>
        {activeTab === 'privacy' && (
          <PrivacyPolicyContent s={s} effectiveDate={EFFECTIVE_DATE} />
        )}

        {activeTab === 'terms' && (
          <TermsOfServiceContent s={s} effectiveDate={EFFECTIVE_DATE} />
        )}

        {activeTab === 'medical' && <MedicalDisclaimerContent s={s} />}
      </ScrollView>
    </SafeAreaView>
  )
}

function MedicalDisclaimerContent({ s }: { s: any }) {
  return (
    <>
      <Text style={s.docTitle}>Medical Disclaimer</Text>
      <Text style={s.docVersion}>Wellness & educational use only</Text>

      <Text style={s.docBody}>
        Àràbìrìn is a personal wellness and body intelligence app designed to help
        users track cycles, symptoms, and patterns over time.
      </Text>

      <Text style={s.docBody}>
        The App does not provide medical advice, diagnosis, treatment, or clinical
        decision-making support. Any information, reminders, insights, or community
        content available in the App is provided for educational and informational
        purposes only.
      </Text>

      <Text style={s.docSection}>1. Not medical advice</Text>
      <Text style={s.docBody}>
        Nothing in Àràbìrìn should be interpreted as medical advice or as a substitute
        for consultation with a qualified healthcare professional.
      </Text>

      <Text style={s.docSection}>2. Insight limitations</Text>
      <Text style={s.docBody}>
        Body insights, cycle predictions, fertile window estimates, and symptom-based
        observations are generated from user input and general pattern logic. They may
        not reflect your individual health condition and may not be accurate in every case.
      </Text>

      <Text style={s.docSection}>3. Community content</Text>
      <Text style={s.docBody}>
        Content shared in Sister’s Circle reflects the experiences and opinions of users.
        It is not medical guidance and should not be relied upon as professional advice.
      </Text>

      <Text style={s.docSection}>4. Seek professional care when needed</Text>
      <Text style={s.docBody}>
        If you have questions about pain, bleeding, fertility, cycle irregularity, or
        any other health concern, you should consult a licensed healthcare professional.
      </Text>

      <Text style={s.docSection}>5. Emergencies</Text>
      <Text style={s.docBody}>
        Àràbìrìn is not intended for emergency use. If you believe you may be experiencing
        a medical emergency, call your local emergency services or seek immediate medical attention.
      </Text>
    </>
  )
}