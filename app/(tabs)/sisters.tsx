import { useState, useMemo } from 'react'
import {
  View, Text, Pressable, ScrollView,
  TextInput, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { Users, AlertCircle } from 'lucide-react-native'
import { useColors } from '../../styles'
import { makeSistersStyles } from '../../styles/screens/sisters'
import { useAuth } from '../../context/AuthContext'

const FORMSPREE_URL = 'https://formspree.io/f/mvzwkpaz'

const CIRCLES = [
  { key: 'all',      label: 'All'             },
  { key: 'general',  label: 'General'         },
  { key: 'fibroids', label: 'Fibroids'        },
  { key: 'endo',     label: 'Endometriosis'   },
  { key: 'pcos',     label: 'PCOS'            },
  { key: 'maternal', label: 'Maternal Health' },
  { key: 'loss',     label: 'Pregnancy Loss'  },
]

type SubmitState = 'idle' | 'loading' | 'success' | 'error'

export default function SistersScreen() {
  const colors = useColors()
  const s      = useMemo(() => makeSistersStyles(colors), [colors])
  const { user } = useAuth()

  const [activeCircle, setActiveCircle] = useState('all')
  const [email,        setEmail]        = useState('')
  const [submitState,  setSubmitState]  = useState<SubmitState>('idle')

  const handleWaitlist = async () => {
    if (!email.includes('@')) return
    setSubmitState('loading')
    try {
      const res = await fetch(FORMSPREE_URL, {
        method:  'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body:    JSON.stringify({ email, source: 'Sisters Circle Waitlist — Mobile' }),
      })
      setSubmitState(res.ok ? 'success' : 'error')
    } catch {
      setSubmitState('error')
    }
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Header */}
        <View style={s.header}>
          <Text style={s.title}>Sisters Circle</Text>
          <Text style={s.subtitle}>
            A safe space to share experiences — not medical advice
          </Text>
        </View>

        {/* Disclaimer */}
        <View style={s.disclaimer}>
          <AlertCircle color={colors.textMuted} size={15} strokeWidth={1.5} />
          <Text style={s.disclaimerText}>
            Everything shared here is personal experience only. Always speak to a qualified healthcare provider about your symptoms and treatment.
          </Text>
        </View>

        {/* Waitlist card */}
        {submitState !== 'success' ? (
          <View style={s.waitlistCard}>
            <View style={s.waitlistTop}>
              <View style={s.waitlistIconWrap}>
                <Users color={colors.accentRose} size={20} strokeWidth={1.5} />
              </View>
              <View style={{ flex: 1 }}>
                <Text style={s.waitlistTitle}>Be a founding sister</Text>
                <Text style={s.waitlistCount}>Join sisters already waiting</Text>
              </View>
            </View>

            <Text style={s.waitlistDesc}>
              Sisters Circle is coming soon. Founding sisters get early access, a special badge, and help shape this community.
            </Text>

            <TextInput
              style={s.waitlistInput}
              value={email}
              onChangeText={setEmail}
              placeholder="your@email.com"
              placeholderTextColor={colors.textMuted}
              keyboardType="email-address"
              autoCapitalize="none"
              autoComplete="email"
            />

            {submitState === 'error' && (
              <Text style={s.errorText}>Something went wrong. Please try again.</Text>
            )}

            <Pressable
              style={[s.waitlistBtn, (!email.includes('@') || submitState === 'loading') && s.waitlistBtnDisabled]}
              onPress={handleWaitlist}
              disabled={!email.includes('@') || submitState === 'loading'}
            >
              {submitState === 'loading'
                ? <ActivityIndicator color={colors.bgPrimary} />
                : <Text style={s.waitlistBtnText}>Join the waitlist →</Text>
              }
            </Pressable>
          </View>
        ) : (
          <View style={s.successCard}>
            <Text style={s.successIcon}>◉</Text>
            <Text style={s.successTitle}>You're in, sister</Text>
            <Text style={s.successDesc}>
              We'll let you know the moment Sisters Circle opens.
            </Text>
          </View>
        )}

        {/* Circles filter */}
        <Text style={s.sectionLabel}>CIRCLES</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.circlesRow}
        >
          {CIRCLES.map((c) => (
            <Pressable
              key={c.key}
              style={[s.circleBtn, activeCircle === c.key && s.circleBtnActive]}
              onPress={() => setActiveCircle(c.key)}
            >
              <Text style={[s.circleBtnText, activeCircle === c.key && s.circleBtnTextActive]}>
                {c.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        {/* Locked composer */}
        <View style={s.composerLocked}>
          <View style={s.composerAvatar}>
            <Text style={s.composerAvatarText}>◉</Text>
          </View>
          <Text style={s.composerPlaceholder}>Share your experience...</Text>
          <View style={s.composerSoonPill}>
            <Text style={s.composerSoonText}>Coming soon</Text>
          </View>
        </View>

        {/* Empty state */}
        <View style={s.emptyState}>
          <Text style={s.emptyIcon}>◌</Text>
          <Text style={s.emptyTitle}>
            {activeCircle === 'all'
              ? 'Sisters Circle is opening soon'
              : `No posts in ${CIRCLES.find((c) => c.key === activeCircle)?.label} yet`}
          </Text>
          <Text style={s.emptyText}>
            Be among the first to share your experience when we launch. Your story could help another sister feel less alone.
          </Text>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}