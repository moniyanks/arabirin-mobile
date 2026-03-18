import { useMemo } from 'react'
import { View, Text, Pressable, ScrollView } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import {
  TrendingUp, Users, Activity,
  Brain, AlertCircle, ChevronRight,
} from 'lucide-react-native'
import { useColors } from '../../styles'
import { makeInsightsStyles } from '../../styles/screens/insights'
import { useAppData } from '../../context/AppDataContext'
import { daysBetween } from '../../utils/cycleHelper'
import { buildBodyMetrics, generateInsights } from '../../utils/bodyIntelligence'
import type { Insight } from '../../utils/bodyIntelligence'

const SYMPTOM_LABELS: Record<string, string> = {
  cramps: 'Cramps', bloating: 'Bloating', headache: 'Headache',
  backPain: 'Back pain', breastTenderness: 'Breast tenderness',
  nausea: 'Nausea', insomnia: 'Insomnia',
}

function getCycleInterpretation(value: number | string) {
  if (value === '—') return null
  const n = Number(value)
  if (n < 21) return { text: 'Shorter than typical (21–35 days)', sage: false }
  if (n > 35) return { text: 'Longer than typical (21–35 days)',  sage: false }
  return             { text: 'Within typical range (21–35 days)', sage: true  }
}

function getPeriodInterpretation(value: number | string) {
  if (value === '—') return null
  const n = Number(value)
  if (n < 2) return { text: 'Shorter than typical (2–7 days)', sage: false }
  if (n > 7) return { text: 'Longer than typical (2–7 days)',  sage: false }
  return            { text: 'Within typical range (2–7 days)', sage: true  }
}

function getCycleStability(periods: Array<{ startDate: string }>) {
  if (periods.length < 3) return null
  const lengths: number[] = []
  for (let i = 1; i < periods.length; i++) {
    lengths.push(daysBetween(periods[i - 1].startDate, periods[i].startDate))
  }
  const avg      = lengths.reduce((a, b) => a + b, 0) / lengths.length
  const irregular = lengths.some((l) => Math.abs(l - avg) > 7)
  return {
    stable: !irregular,
    label:  irregular ? 'Variable cycle' : 'Stable cycle',
    range:  `${Math.min(...lengths)}–${Math.max(...lengths)} days over last ${periods.length} cycles`,
  }
}

function getConfidenceLabel(count: number) {
  if (count === 0) return null
  if (count >= 5) return { label: 'High',     desc: 'Based on 5+ cycles'             }
  if (count >= 3) return { label: 'Good',     desc: `Based on ${count} cycles`       }
  return              { label: 'Building', desc: `Based on ${count} cycle${count > 1 ? 's' : ''}` }
}

// Simple bar chart using RN Views
function SimpleBarChart({
  data, maxValue, colors, s,
}: {
  data: Array<{ name: string; days: number }>
  maxValue: number
  colors: any
  s: any
}) {
  return (
    <View style={s.barChart}>
      {data.map((item) => (
        <View key={item.name} style={s.barRow}>
          <Text style={s.barLabel}>{item.name}</Text>
          <View style={s.barTrack}>
            <View style={[s.barFill, { width: `${(item.days / maxValue) * 100}%` }]} />
          </View>
          <Text style={s.barValue}>{item.days}d</Text>
        </View>
      ))}
      <View style={s.barReferenceLine} />
    </View>
  )
}

export default function InsightsScreen() {
  const colors = useColors()
  const s      = useMemo(() => makeInsightsStyles(colors), [colors])
  const router = useRouter()
  const { profile, periods, symptomLogs, cycleLength } = useAppData()

  const hasEnoughData = periods.length >= 2

  const metrics = useMemo(() =>
    buildBodyMetrics(periods, symptomLogs, profile),
    [periods, symptomLogs, profile]
  )

  const insights = useMemo(() => generateInsights(metrics), [metrics])

  const avgPeriodLength = useMemo(() => {
    const completed = periods.filter((p) => p.endDate)
    if (!completed.length) return '—'
    return Math.round(
      completed.reduce((sum, p) => sum + daysBetween(p.startDate, p.endDate!) + 1, 0) / completed.length
    )
  }, [periods])

  const longestCycle = useMemo(() => {
    if (periods.length < 3) return '—'
    let max = 0
    for (let i = 1; i < periods.length; i++) {
      const l = daysBetween(periods[i - 1].startDate, periods[i].startDate)
      if (l > max) max = l
    }
    return max
  }, [periods])

  const shortestCycle = useMemo(() => {
    if (periods.length < 3) return '—'
    let min = 999
    for (let i = 1; i < periods.length; i++) {
      const l = daysBetween(periods[i - 1].startDate, periods[i].startDate)
      if (l < min) min = l
    }
    return min
  }, [periods])

  const cycleLengthData = useMemo(() => {
    if (periods.length < 2) return []
    return periods.slice(1).map((p, i) => ({
      name: `C${i + 1}`,
      days: daysBetween(periods[i].startDate, p.startDate),
    }))
  }, [periods])

  const symptomFrequencyData = useMemo(() => {
    if (!symptomLogs?.length) return []
    const counts: Record<string, number> = {}
    symptomLogs.forEach((log) => {
      if (log.cramps && log.cramps !== 'none') counts.cramps = (counts.cramps || 0) + 1
      log.extras?.forEach((ex) => { counts[ex] = (counts[ex] || 0) + 1 })
    })
    return Object.entries(counts)
      .map(([key, count]) => ({ name: SYMPTOM_LABELS[key] || key, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6)
  }, [symptomLogs])

  const stability  = getCycleStability(periods)
  const confidence = getConfidenceLabel(periods.length)
  const cycleInterp  = getCycleInterpretation(cycleLength)
  const periodInterp = getPeriodInterpretation(avgPeriodLength)
  const maxCycleDays = cycleLengthData.length
    ? Math.max(...cycleLengthData.map((d) => d.days))
    : 35

  const getInsightColor = (insight: Insight) => {
    if (insight.severity === 'attention') return colors.accentRose
    if (insight.type === 'cycle')         return colors.accentSage
    return colors.accentGold
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {!hasEnoughData ? (
          <View style={s.emptyState}>
            <Activity color={colors.accentRose} size={40} strokeWidth={1.5} />
            <Text style={s.emptyTitle}>No insights yet</Text>
            <Text style={s.emptyText}>
              Log at least 2 periods to see your cycle insights and body patterns.
            </Text>
            <Pressable style={s.emptyBtn} onPress={() => router.push('/(tabs)/calendar')}>
              <Text style={s.emptyBtnText}>Log my period →</Text>
            </Pressable>
          </View>
        ) : (
          <>
            {/* Cycle summary */}
            <View style={s.summaryCard}>
              <View style={s.cardHeader}>
                <TrendingUp color={colors.accentRose} size={18} strokeWidth={1.5} />
                <Text style={s.cardHeaderLabel}>Your cycle summary</Text>
              </View>

              {stability && (
                <View style={[s.stabilityRow, stability.stable ? s.stabilityStable : s.stabilityVariable]}>
                  <View style={[s.stabilityDot, stability.stable ? s.stabilityDotStable : s.stabilityDotVariable]} />
                  <View>
                    <Text style={s.stabilityTitle}>{stability.label}</Text>
                    <Text style={s.stabilityRange}>{stability.range}</Text>
                  </View>
                </View>
              )}

              {confidence && (
                <View style={s.confidenceRow}>
                  <Text style={s.confidenceLabel}>Prediction confidence</Text>
                  <View style={s.confidencePill}>
                    <Text style={s.confidencePillText}>
                      {confidence.label} · {confidence.desc}
                    </Text>
                  </View>
                </View>
              )}
            </View>

            {/* Body Intelligence */}
            <Text style={s.sectionLabel}>BODY INTELLIGENCE</Text>
            <View style={s.intelligenceCard}>
              <View style={s.cardHeader}>
                <Brain color={colors.accentRose} size={18} strokeWidth={1.5} />
                <Text style={s.cardHeaderLabel}>Patterns from your body</Text>
                <View style={s.badge}>
                  <Text style={s.badgeText}>Personal · Explainable</Text>
                </View>
              </View>

              {insights.map((insight) => (
                <View key={insight.id} style={s.insightItem}>
                  <View style={[s.insightIconWrap, { backgroundColor: getInsightColor(insight) + '18' }]}>
                    {insight.severity === 'attention'
                      ? <AlertCircle color={colors.accentRose} size={15} strokeWidth={1.5} />
                      : insight.type === 'cycle'
                        ? <TrendingUp color={colors.accentSage} size={15} strokeWidth={1.5} />
                        : <Brain color={colors.accentGold} size={15} strokeWidth={1.5} />
                    }
                  </View>
                  <View style={s.insightBody}>
                    <View style={s.insightTopRow}>
                      <Text style={s.insightTitle}>{insight.title}</Text>
                      <View style={[
                        s.confidenceChip,
                        insight.confidence === 'high'   && s.confidenceChipHigh,
                        insight.confidence === 'medium' && s.confidenceChipMedium,
                        insight.confidence === 'low'    && s.confidenceChipLow,
                      ]}>
                        <Text style={[
                          s.confidenceChipText,
                          insight.confidence === 'high'   && s.confidenceChipTextHigh,
                          insight.confidence === 'medium' && s.confidenceChipTextMedium,
                          insight.confidence === 'low'    && s.confidenceChipTextLow,
                        ]}>
                          {insight.confidence}
                        </Text>
                      </View>
                    </View>
                    <Text style={s.insightText}>{insight.message}</Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Cycle trend chart */}
            {cycleLengthData.length >= 2 && (
              <>
                <Text style={s.sectionLabel}>CYCLE TREND</Text>
                <View style={s.chartCard}>
                  <Text style={s.chartTitle}>Cycle length over time</Text>
                  <Text style={s.chartSubtitle}>Days between each period</Text>
                  <SimpleBarChart
                    data={cycleLengthData}
                    maxValue={maxCycleDays}
                    colors={colors}
                    s={s}
                  />
                  <Text style={s.chartNote}>Each bar = days from one period to the next</Text>
                </View>
              </>
            )}

            {/* Symptom frequency */}
            {symptomFrequencyData.length > 0 && (
              <>
                <Text style={s.sectionLabel}>SYMPTOM PATTERNS</Text>
                <View style={s.chartCard}>
                  <Text style={s.chartTitle}>Most logged symptoms</Text>
                  <Text style={s.chartSubtitle}>Across all your entries</Text>
                  {symptomFrequencyData.map((item) => (
                    <View key={item.name} style={s.symptomRow}>
                      <Text style={s.symptomName}>{item.name}</Text>
                      <View style={s.symptomTrack}>
                        <View style={[
                          s.symptomFill,
                          { width: `${(item.count / symptomFrequencyData[0].count) * 100}%` },
                        ]} />
                      </View>
                      <Text style={s.symptomCount}>{item.count}x</Text>
                    </View>
                  ))}
                </View>
              </>
            )}

            {/* Stats grid */}
            <Text style={s.sectionLabel}>YOUR STATS</Text>
            <View style={s.statsGrid}>
              {[
                { value: cycleLength,       label: 'Avg Cycle',     unit: 'days', interp: cycleInterp  },
                { value: avgPeriodLength,   label: 'Avg Period',    unit: 'days', interp: periodInterp },
                { value: periods.length,    label: 'Periods Logged', unit: 'total', interp: null       },
                { value: longestCycle,      label: 'Longest Cycle', unit: 'days', interp: null         },
                { value: shortestCycle,     label: 'Shortest Cycle', unit: 'days', interp: null        },
                {
                  value: periods.length < 3 ? '—' : stability?.stable ? '✓' : '~',
                  label: 'Cycle Pattern',
                  unit: periods.length < 3 ? 'Need more data' : stability?.stable ? 'Regular' : 'Irregular',
                  interp: null,
                },
              ].map((stat, i) => (
                <View key={i} style={s.statCard}>
                  <Text style={s.statValue}>{stat.value}</Text>
                  <Text style={s.statLabel}>{stat.label}</Text>
                  <Text style={s.statUnit}>{stat.unit}</Text>
                  {stat.interp && (
                    <Text style={[s.statInterp, stat.interp.sage ? s.statInterpSage : s.statInterpRose]}>
                      {stat.interp.text}
                    </Text>
                  )}
                </View>
              ))}
            </View>

            {/* Sisters Circle teaser */}
            <Pressable style={s.sistersCard} onPress={() => router.push('/(tabs)/sisters')}>
              <View style={{ flex: 1 }}>
                <Text style={s.sistersEyebrow}>Sisters Circle</Text>
                <Text style={s.sistersTitle}>You are not alone in this.</Text>
                <Text style={s.sistersDesc}>
                  Join the founding sisters and help shape a safer support space.
                </Text>
              </View>
              <ChevronRight color={colors.accentRose} size={20} strokeWidth={1.5} />
            </Pressable>
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}