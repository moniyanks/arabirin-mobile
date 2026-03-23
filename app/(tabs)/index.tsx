import { useMemo } from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import {
  CalendarDays, Heart, Activity,
  Moon, ChevronRight, Brain,
} from 'lucide-react-native'
import Svg, { Circle } from 'react-native-svg'
import { useColors } from '../../styles'
import { useAppData } from '../../context/AppDataContext'
import { makeHomeStyles } from '../../styles/screens/home'
import { formatDate, getCurrentCycleDay, getNextPeriodDate, getPhaseInfo } from '../../utils/cycleHelper'
import { getGreetingText } from '../../utils/greetingHelper'
import {
  getPredictionConfidence, getBodyIntelligenceMessage,
  getModeContext, getPhaseLabel, getRingInnerLabel, getPhaseSupportMessage,
} from '../../utils/homeHelper'
import { calculateFertilityInsight, FERTILE_STATUS_MESSAGES } from '../../utils/fertilityIntelligence'
import { format, parseISO } from 'date-fns'



const SYMPTOM_SHORTCUTS = [
  { key: 'cramps', label: 'Cramps', icon: '⚡' },
  { key: 'mood',   label: 'Mood',   icon: '💭' },
  { key: 'energy', label: 'Energy', icon: '✦'  },
  { key: 'flow',   label: 'Flow',   icon: '◉'  },
  { key: 'sleep',  label: 'Sleep',  icon: '◌'  },
]

const TTC_SHORTCUTS = [
  { key: 'cervicalMucus',  label: 'CM',        icon: '💧' },
  { key: 'ovulationPain',  label: 'O-Pain',    icon: '⚡' },
  { key: 'spotting',       label: 'Spotting',  icon: '◉'  },
  { key: 'mood',           label: 'Mood',      icon: '💭' },
  { key: 'energy',         label: 'Energy',    icon: '✦'  },
]

const RING_SIZE    = 220
const STROKE_WIDTH = 14
const RADIUS       = (RING_SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

function getCycleRingProgress(currentCycleDay: number | null, cycleLength: number) {
  if (!currentCycleDay || !cycleLength || cycleLength <= 0) return 0
  return Math.min(currentCycleDay / cycleLength, 1)
}

function TtcHeroCard({
  colors, styles, periods, symptomLogs, profile,
}: {
  colors:      any
  styles:      any
  periods:     any[]
  symptomLogs: any[]
  profile:     any
}) {
  const insight = useMemo(
    () => calculateFertilityInsight(periods, symptomLogs, profile),
    [periods, symptomLogs, profile]
  )

  const formatShort = (d: string | null) =>
    d ? format(parseISO(d), 'd MMM') : '—'

  const statusMessage = FERTILE_STATUS_MESSAGES[insight.fertileWindowStatus]

  const heroText =
    insight.fertileWindowStatus === 'no_data'
      ? 'Log your first period to unlock your fertile window predictions.'
      : insight.fertileWindowStatus === 'in_fertile'
        ? 'You are in your fertile window.'
        : insight.fertileWindowStatus === 'ovulation_day'
          ? 'Today is your estimated ovulation day.'
          : insight.fertileWindowStatus === 'after_ovulation'
            ? 'Your fertile window has passed this cycle.'
            : `${insight.daysUntilFertile} day${insight.daysUntilFertile !== 1 ? 's' : ''} until your fertile window`

  return (
    <View style={styles.heroCard}>
      <View style={styles.phaseBadge}>
        <Text style={styles.phaseBadgeText}>
          {insight.fertileWindowStatus === 'in_fertile' || insight.fertileWindowStatus === 'ovulation_day'
            ? 'FERTILE WINDOW'
            : 'TRYING TO CONCEIVE'
          }
        </Text>
      </View>

      <Text style={styles.heroTitle}>{heroText}</Text>

      {insight.fertileStart && (
        <View style={{ gap: 6, alignItems: 'center' }}>
          <Text style={styles.heroMessage}>
            Fertile window: {formatShort(insight.fertileStart)} — {formatShort(insight.fertileEnd)}
          </Text>
          <Text style={styles.heroMessage}>
            Ovulation day: {formatShort(insight.ovulationDay)}
          </Text>
        </View>
      )}

      {insight.fertileWindowStatus === 'no_data' && (
        <Text style={styles.heroMessage}>
          {statusMessage}
        </Text>
      )}

      <View style={[styles.confidencePill,
        insight.confidence === 'high'   ? styles.confidenceHigh   :
        insight.confidence === 'medium' ? styles.confidenceMedium : styles.confidenceLow
      ]}>
        <Text style={[styles.confidenceText,
          insight.confidence === 'high'   ? styles.confidenceHighText   :
          insight.confidence === 'medium' ? styles.confidenceMediumText : styles.confidenceLowText
        ]}>
          {insight.confidence === 'high'   ? 'High confidence' :
           insight.confidence === 'medium' ? 'Good confidence' : 'Building accuracy'}
        </Text>
      </View>
    </View>
  )
}

export default function HomeScreen() {
  const colors = useColors()
  const styles = useMemo(() => makeHomeStyles(colors), [colors])
  const router = useRouter()

  const { profile, periods, symptomLogs, cycleLength, periodLength } = useAppData()

  const name        = profile?.name?.trim() || 'Sister'
  const mode        = profile?.mode || 'cycle'
  const firstLetter = name.charAt(0).toUpperCase() || 'A'

  const greeting           = getGreetingText()
  const currentCycleDay    = getCurrentCycleDay(periods, cycleLength)
  const nextPeriodDate     = getNextPeriodDate(periods, cycleLength)
  const phaseInfo          = getPhaseInfo(currentCycleDay, cycleLength, periodLength)
  const predictionConfidence = getPredictionConfidence(periods.length)
  const bodyIntelligence   = getBodyIntelligenceMessage({ mode, phase: phaseInfo.phase, symptomLogs, periodsCount: periods.length })
  const ringInnerLabel     = getRingInnerLabel(phaseInfo.phase)
  const phaseSupportMessage = getPhaseSupportMessage(phaseInfo.phase)
  const nextPeriodDisplay  = nextPeriodDate ? formatDate(nextPeriodDate) : '—'
  const ringProgress       = getCycleRingProgress(currentCycleDay, cycleLength)
  const strokeDashoffset   = CIRCUMFERENCE * (1 - ringProgress)

  const hasNoPeriods = periods.length === 0

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView
        style={styles.container}
        contentContainerStyle={styles.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Top bar */}
        <View style={styles.topBar}>
          <View>
            <Text style={styles.logo}>Àràbìrín</Text>
            <Text style={styles.tagline}>BODY INTELLIGENCE FOR EVERY STAGE</Text>
          </View>
          <Pressable style={styles.avatar} onPress={() => router.push('/(tabs)/profile')}>
            <Text style={styles.avatarText}>{firstLetter}</Text>
          </Pressable>
        </View>

        {/* Greeting */}
        <View style={styles.greetingBlock}>
          <Text style={styles.greeting}>{greeting}, {name} 🌸</Text>
          <Text style={styles.context}>{getModeContext(mode)}</Text>
        </View>

        {/* ── Empty state — no periods logged yet ── */}
        {hasNoPeriods ? (
          <View style={styles.emptyStateCard}>
            <Text style={styles.emptyStateIcon}>◉</Text>
            <Text style={styles.emptyStateTitle}>
              Your cycle story starts here
            </Text>
            <Text style={styles.emptyStateDesc}>
              Log your first period to unlock your cycle ring, predictions, and body insights.
            </Text>
            <Pressable
              style={styles.emptyStateBtn}
              onPress={() => router.push('/(tabs)/calendar')}
            >
              <Text style={styles.emptyStateBtnText}>Log my first period →</Text>
            </Pressable>

            {/* Still show quick actions so app feels useful */}
            <View style={styles.emptyStateGrid}>
              <Pressable
                style={styles.emptyStateGridCard}
                onPress={() => router.push('/(tabs)/health')}
              >
                <Heart color={colors.accentRose} size={18} strokeWidth={1.8} />
                <Text style={styles.emptyStateGridTitle}>Health Hub</Text>
                <Text style={styles.emptyStateGridDesc}>
                  Learn about conditions that affect us
                </Text>
              </Pressable>
              <Pressable
                style={styles.emptyStateGridCard}
                onPress={() => router.push('/(tabs)/sisters')}
              >
                <Moon color={colors.accentRose} size={18} strokeWidth={1.8} />
                <Text style={styles.emptyStateGridTitle}>Sisters Circle</Text>
                <Text style={styles.emptyStateGridDesc}>
                  Join the founding sisters waitlist
                </Text>
              </Pressable>
            </View>
          </View>
        ) : (
          <>
            {/* ── Cycle ring or journey card ── */}
            {mode === 'cycle' ? (
              <View style={styles.ringHeroCard}>
                <View style={styles.phaseBadge}>
                  <Text style={styles.phaseBadgeText}>{getPhaseLabel(phaseInfo.phase)}</Text>
                </View>
                <View style={styles.ringWrap}>
                  <Svg width={RING_SIZE} height={RING_SIZE}>
                    <Circle
                      stroke={colors.borderRose}
                      fill="none"
                      cx={RING_SIZE / 2}
                      cy={RING_SIZE / 2}
                      r={RADIUS}
                      strokeWidth={STROKE_WIDTH}
                    />
                    <Circle
                      stroke={colors.accentRose}
                      fill="none"
                      cx={RING_SIZE / 2}
                      cy={RING_SIZE / 2}
                      r={RADIUS}
                      strokeWidth={STROKE_WIDTH}
                      strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
                      strokeDashoffset={strokeDashoffset}
                      strokeLinecap="round"
                      transform={`rotate(-90, ${RING_SIZE / 2}, ${RING_SIZE / 2})`}
                    />
                  </Svg>
                  <View style={styles.ringCenter}>
                    {phaseInfo.phase === 'period' ? (
                      <>
                        <Text style={styles.ringCenterValue}>
                          {currentCycleDay ? `Day ${currentCycleDay}` : '—'}
                        </Text>
                        <Text style={styles.ringCenterSubLabel}>{ringInnerLabel}</Text>
                      </>
                    ) : (
                      <Text style={styles.ringCenterValueAlt}>{ringInnerLabel}</Text>
                    )}
                  </View>
                </View>
                <Text style={styles.heroMessage}>{phaseSupportMessage}</Text>
              </View>
            
            ) : mode === 'ttc' ? (
              <TtcHeroCard
                colors={colors}
                styles={styles}
                periods={periods}
                symptomLogs={symptomLogs}
                profile={profile}
              />


            ) : (
              <View style={styles.heroCard}>
                <View style={styles.phaseBadge}>
                  <Text style={styles.phaseBadgeText}>{getModeContext(mode)}</Text>
                </View>
                <Text style={styles.heroTitle}>Your journey today</Text>
                <Text style={styles.heroMessage}>{bodyIntelligence.message}</Text>
              </View>
            )}

            {/* Next period prediction */}
            {mode === 'cycle' && nextPeriodDate && predictionConfidence && (
              <View style={styles.predictionRow}>
                <View>
                  <Text style={styles.predictionLabel}>Next period</Text>
                  <Text style={styles.predictionDate}>{nextPeriodDisplay}</Text>
                </View>
                <View style={[
                  styles.confidencePill,
                  predictionConfidence.tone === 'high'   && styles.confidenceHigh,
                  predictionConfidence.tone === 'medium' && styles.confidenceMedium,
                  predictionConfidence.tone === 'low'    && styles.confidenceLow,
                ]}>
                  <Text style={[
                    styles.confidenceText,
                    predictionConfidence.tone === 'high'   && styles.confidenceHighText,
                    predictionConfidence.tone === 'medium' && styles.confidenceMediumText,
                    predictionConfidence.tone === 'low'    && styles.confidenceLowText,
                  ]}>
                    {predictionConfidence.label}
                  </Text>
                </View>
              </View>
            )}

            {/* Log banner */}
            <Pressable style={styles.logBanner} onPress={() => router.push('/(tabs)/calendar')}>
              <Text style={styles.logBannerText}>{mode === 'ttc' ? 'Log today\'s signs' : 'Log today\'s symptoms'}</Text>
              <ChevronRight color={colors.bgPrimary} size={20} strokeWidth={1.8} />
            </Pressable>

            {/* Symptom shortcuts */}
            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.shortcutRow}
            >
              {(mode === 'ttc' ? TTC_SHORTCUTS : SYMPTOM_SHORTCUTS).map((item) => (
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

            {/* Stats row */}
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

            {/* Body intelligence */}
            <Pressable style={styles.intelligenceCard} onPress={() => router.push('/(tabs)/insights')}>
              <View style={styles.intelligenceIconWrap}>
                <Brain color={colors.accentRose} size={20} strokeWidth={1.8} />
              </View>
              <View style={styles.intelligenceBody}>
                <Text style={styles.intelligenceTitle}>{bodyIntelligence.title}</Text>
                <Text style={styles.intelligenceDesc}>{bodyIntelligence.message}</Text>
              </View>
              <ChevronRight color={colors.textMuted} size={20} strokeWidth={1.8} />
            </Pressable>

            {/* Quick action grid */}
            <View style={styles.quickActionGrid}>
              {[
                { icon: <CalendarDays color={colors.accentRose} size={18} strokeWidth={1.8} />, title: 'Calendar',      desc: 'Review your dates, logs, and patterns.',       route: '/(tabs)/calendar' },
                { icon: <Heart        color={colors.accentRose} size={18} strokeWidth={1.8} />, title: 'Health',         desc: 'Learn what may be happening in your body.',    route: '/(tabs)/health'   },
                { icon: <Activity     color={colors.accentRose} size={18} strokeWidth={1.8} />, title: 'Insights',       desc: 'See trends from your recent logs.',            route: '/(tabs)/insights' },
                { icon: <Moon         color={colors.accentRose} size={18} strokeWidth={1.8} />, title: 'Sisters Circle', desc: 'Find support and join the founding sisters.',  route: '/(tabs)/sisters'  },
              ].map((card) => (
                <Pressable
                  key={card.title}
                  style={styles.quickActionCard}
                  onPress={() => router.push(card.route as any)}
                >
                  {card.icon}
                  <Text style={styles.quickActionTitle}>{card.title}</Text>
                  <Text style={styles.quickActionDesc}>{card.desc}</Text>
                </Pressable>
              ))}
            </View>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}