import { useMemo } from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import {
  CalendarDays,
  Heart,
  Activity,
  Moon,
  ChevronRight,
  Brain,
} from 'lucide-react-native'

import { useColors } from '../../styles'
import { useAppData } from '../../context/AppDataContext'
import { makeHomeStyles } from '../../styles/screens/home'
import { formatDate, getCurrentCycleDay, getNextPeriodDate, getPhaseInfo } from '../../utils/cycleHelper'
import { getGreetingText} from '../../utils/greetingHelper'
import {
  getPredictionConfidence,
  getBodyIntelligenceMessage,
  getModeContext,
  getPhaseLabel,
} from '../../utils/homeHelper'

const SYMPTOM_SHORTCUTS = [
  { key: 'cramps', label: 'Cramps', icon: '⚡' },
  { key: 'mood', label: 'Mood', icon: '💭' },
  { key: 'energy', label: 'Energy', icon: '✦' },
  { key: 'flow', label: 'Flow', icon: '◉' },
  { key: 'sleep', label: 'Sleep', icon: '◌' },
]

export default function HomeScreen() {
  const colors = useColors()
  const styles = useMemo(() => makeHomeStyles(colors), [colors])
  const router = useRouter()

  const { profile, periods, symptomLogs, cycleLength, periodLength } = useAppData()

  const name =
    ((profile as any)?.name as string | undefined)?.trim() || 'Sister'
  const mode = ((profile as any)?.mode as string | undefined) || 'cycle'
  const firstLetter = name.charAt(0).toUpperCase() || 'A'

  const greeting = getGreetingText()
  const currentCycleDay = getCurrentCycleDay(periods, cycleLength)
  const nextPeriodDate = getNextPeriodDate(periods, cycleLength)
  const phaseInfo = getPhaseInfo(currentCycleDay, cycleLength, periodLength)
  const predictionConfidence = getPredictionConfidence(periods.length)

  const bodyIntelligence = getBodyIntelligenceMessage({
    mode,
    phase: phaseInfo.phase,
    symptomLogs,
    periodsCount: periods.length,
  })

  const nextPeriodDisplay = nextPeriodDate ? formatDate(nextPeriodDate) : '—'

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        <View style={styles.topBar}>
          <View>
            <Text style={styles.logo}>Àràbìrín</Text>
            <Text style={styles.tagline}>BODY INTELLIGENCE FOR EVERY STAGE</Text>
          </View>

          <Pressable
            style={styles.avatar}
            onPress={() => router.push('/(tabs)/profile')}
          >
            <Text style={styles.avatarText}>{firstLetter}</Text>
          </Pressable>
        </View>

        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>
            {greeting}, {name} 🌸
          </Text>
          <Text style={styles.context}>{getModeContext(mode)}</Text>
        </View>

        <View style={styles.heroCard}>
          <View style={styles.phaseBadge}>
            <Text style={styles.phaseBadgeText}>
              {mode === 'cycle' ? getPhaseLabel(phaseInfo.phase) : getModeContext(mode)}
            </Text>
          </View>

          <Text style={styles.heroTitle}>
            {mode === 'cycle'
              ? currentCycleDay
                ? `Cycle Day ${currentCycleDay}`
                : 'Your cycle overview'
              : 'Your journey today'}
          </Text>

          <Text style={styles.heroMessage}>
            {mode === 'cycle' && phaseInfo.message
              ? phaseInfo.message
              : bodyIntelligence.message}
          </Text>
        </View>

        {mode === 'cycle' && nextPeriodDate && predictionConfidence && (
          <View style={styles.predictionRow}>
            <View>
              <Text style={styles.predictionLabel}>Next period</Text>
              <Text style={styles.predictionDate}>{nextPeriodDisplay}</Text>
            </View>

            <View
              style={[
                styles.confidencePill,
                predictionConfidence.tone === 'high' && styles.confidenceHigh,
                predictionConfidence.tone === 'medium' && styles.confidenceMedium,
                predictionConfidence.tone === 'low' && styles.confidenceLow,
              ]}
            >
              <Text
                style={[
                  styles.confidenceText,
                  predictionConfidence.tone === 'high' && styles.confidenceHighText,
                  predictionConfidence.tone === 'medium' && styles.confidenceMediumText,
                  predictionConfidence.tone === 'low' && styles.confidenceLowText,
                ]}
              >
                {predictionConfidence.label}
              </Text>
            </View>
          </View>
        )}

        <Pressable
          style={styles.logBanner}
          onPress={() => router.push('/(tabs)/calendar')}
        >
          <Text style={styles.logBannerText}>Log today’s symptoms</Text>
          <ChevronRight color={colors.bgPrimary} size={20} strokeWidth={1.8} />
        </Pressable>

        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.shortcutRow}
        >
          {SYMPTOM_SHORTCUTS.map((item) => (
            <Pressable
              key={item.key}
              style={styles.shortcutBtn}
              onPress={() => router.push('/(tabs)/calendar')}
            >
              <Text style={styles.shortcutIcon}>{item.icon}</Text>
              <Text style={styles.shortcutLabel}>{item.label}</Text>
            </Pressable>
          ))}
        </ScrollView>

        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Cycle</Text>
            <Text style={styles.statValue}>
              {mode === 'cycle' && cycleLength ? `${cycleLength}d` : '—'}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Day</Text>
            <Text style={styles.statValue}>
              {mode === 'cycle' && currentCycleDay ? currentCycleDay : '—'}
            </Text>
          </View>

          <View style={styles.statCard}>
            <Text style={styles.statLabel}>Next</Text>
            <Text style={styles.statValue}>
              {mode === 'cycle' ? nextPeriodDisplay : '—'}
            </Text>
          </View>
        </View>

        <Pressable
          style={styles.intelligenceCard}
          onPress={() => router.push('/(tabs)/insights')}
        >
          <View style={styles.intelligenceIconWrap}>
            <Brain color={colors.accentRose} size={20} strokeWidth={1.8} />
          </View>

          <View style={styles.intelligenceBody}>
            <Text style={styles.intelligenceTitle}>{bodyIntelligence.title}</Text>
            <Text style={styles.intelligenceDesc}>{bodyIntelligence.message}</Text>
          </View>

          <ChevronRight color={colors.textMuted} size={20} strokeWidth={1.8} />
        </Pressable>

        <View style={styles.quickActionGrid}>
          <Pressable
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/calendar')}
          >
            <CalendarDays color={colors.accentRose} size={18} strokeWidth={1.8} />
            <Text style={styles.quickActionTitle}>Calendar</Text>
            <Text style={styles.quickActionDesc}>
              Review your dates, logs, and patterns.
            </Text>
          </Pressable>

          <Pressable
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/health')}
          >
            <Heart color={colors.accentRose} size={18} strokeWidth={1.8} />
            <Text style={styles.quickActionTitle}>Health</Text>
            <Text style={styles.quickActionDesc}>
              Learn what may be happening in your body.
            </Text>
          </Pressable>

          <Pressable
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/insights')}
          >
            <Activity color={colors.accentRose} size={18} strokeWidth={1.8} />
            <Text style={styles.quickActionTitle}>Insights</Text>
            <Text style={styles.quickActionDesc}>
              See trends from your recent logs.
            </Text>
          </Pressable>

          <Pressable
            style={styles.quickActionCard}
            onPress={() => router.push('/(tabs)/sisters')}
          >
            <Moon color={colors.accentRose} size={18} strokeWidth={1.8} />
            <Text style={styles.quickActionTitle}>Sisters Circle</Text>
            <Text style={styles.quickActionDesc}>
              Find support and join the founding sisters.
            </Text>
          </Pressable>
        </View>

        <Pressable
          style={styles.sistersTeaser}
          onPress={() => router.push('/(tabs)/sisters')}
        >
          <View style={styles.sistersTeaserTextWrap}>
            <Text style={styles.sistersEyebrow}>Sisters Circle</Text>
            <Text style={styles.sistersTitle}>You are not alone in this.</Text>
            <Text style={styles.sistersDesc}>
              Join the founding sisters and help shape a safer support space.
            </Text>
          </View>

          <ChevronRight color={colors.accentRose} size={20} strokeWidth={1.8} />
        </Pressable>
      </ScrollView>
    </SafeAreaView>
  )
}