import { useMemo, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { AlertCircle, TrendingUp } from 'lucide-react-native'
import { type ThemeColors } from '../../constants/theme'
import { useAppData } from '../../context/AppDataContext'
import { makeConditionIntelligenceStyles } from '../../styles/components/conditionIntelligence'
import {
  calculateConditionScore,
  getConditionsFromProfile,
  CONDITION_LABELS,
  CONDITION_COLORS,
  SCORE_LEVEL_LABELS,
  SCORE_DESCRIPTIONS,
  MIN_LOGS_FOR_SCORE,
  type ConditionKey,
} from '../../utils/conditionIntelligence'
import type { Period, SymptomLog, Profile } from '../../context/AppDataContext'

// ── Single condition card — extracted to avoid hooks-in-loop violation ──
function ConditionCard({
  condition, colors, s, periods, symptomLogs, profile,
  expanded, onToggleExpand, onAppointmentPress,
}: {
  condition:          ConditionKey
  colors:             ThemeColors
  s:                  ReturnType<typeof makeConditionIntelligenceStyles>
  periods:            Period[]
  symptomLogs:        SymptomLog[]
  profile:            Profile
  expanded:           boolean
  onToggleExpand:     () => void
  onAppointmentPress: () => void
}) {
  const score = useMemo(
    () => calculateConditionScore(condition, symptomLogs, periods, profile),
    [condition, symptomLogs, periods, profile]
  )

  const conditionColor = CONDITION_COLORS[condition]
  const conditionLabel = CONDITION_LABELS[condition]
  const logsNeeded     = Math.max(0, MIN_LOGS_FOR_SCORE - score.logsAnalysed)

  // ── Not enough data ──
  if (!score.hasEnoughData) {
    return (
      <View style={s.card}>
        <View style={s.cardHeader}>
          <View style={[s.dot, { backgroundColor: conditionColor }]} />
          <Text style={s.cardTitle}>{conditionLabel} Insights</Text>
        </View>
        <Text style={s.buildingTitle}>Building your profile</Text>
        <Text style={s.buildingDesc}>
          Log {logsNeeded} more symptom {logsNeeded !== 1 ? 'entries' : 'entry'} to unlock
          your {conditionLabel} insights.
        </Text>
        <View style={s.progressTrack}>
          <View style={[
            s.progressFill,
            {
              width: `${Math.min((score.logsAnalysed / MIN_LOGS_FOR_SCORE) * 100, 100)}%` as any,
              backgroundColor: conditionColor,
            },
          ]} />
        </View>
        <Text style={s.progressLabel}>
          {score.logsAnalysed} of {MIN_LOGS_FOR_SCORE} entries
        </Text>
      </View>
    )
  }

  // ── Score display ──
  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <View style={[s.dot, { backgroundColor: conditionColor }]} />
        <Text style={s.cardTitle}>{conditionLabel} Insights</Text>
        <View style={[s.pill, {
          backgroundColor: conditionColor + '20',
          borderColor:     conditionColor + '50',
        }]}>
          <Text style={[s.pillText, { color: conditionColor }]}>
            {SCORE_LEVEL_LABELS[score.level]}
          </Text>
        </View>
      </View>

      <View style={s.scoreTrack}>
        <View style={[s.scoreFill, {
          width: `${score.percentage}%` as any,
          backgroundColor: conditionColor,
        }]} />
        <View style={[s.zoneMarker, { left: '30%' as any }]} />
        <View style={[s.zoneMarker, { left: '60%' as any }]} />
      </View>
      <View style={s.zoneLabels}>
        <Text style={s.zoneLabel}>Low</Text>
        <Text style={s.zoneLabel}>Moderate</Text>
        <Text style={s.zoneLabel}>Notable</Text>
      </View>

      <Text style={s.desc}>{SCORE_DESCRIPTIONS[condition][score.level]}</Text>

      <View style={s.disclaimer}>
        <AlertCircle color={colors.textMuted} size={13} strokeWidth={1.5} />
        <Text style={s.disclaimerText}>
          This is not a diagnosis. Share with your healthcare provider.
        </Text>
      </View>

      <Pressable style={s.expandBtn} onPress={onToggleExpand}>
        <Text style={s.expandBtnText}>
          {expanded ? 'Hide signal breakdown' : 'View signal breakdown'}
        </Text>
        <TrendingUp color={colors.textMuted} size={14} strokeWidth={1.5} />
      </Pressable>

      {expanded && (
        <View style={s.signals}>
          {score.signals.map((signal, i) => (
            <View key={i} style={s.signalRow}>
              <View style={[s.signalDot, {
                backgroundColor: signal.met ? conditionColor : colors.borderRose,
              }]} />
              <View style={{ flex: 1 }}>
                <Text style={[s.signalLabel, {
                  color: signal.met ? colors.textPrimary : colors.textMuted,
                }]}>
                  {signal.label}
                </Text>
                <Text style={s.signalDetail}>{signal.detail}</Text>
              </View>
              <Text style={[s.signalWeight, {
                color: signal.met ? conditionColor : colors.textMuted,
              }]}>
                {signal.weight}%
              </Text>
            </View>
          ))}
          <Text style={s.signalsFootnote}>
            Based on {score.logsAnalysed} entries over {score.weeksOfData} weeks
          </Text>
        </View>
      )}

      {score.level !== 'low' && (
        <Pressable
          style={[s.ctaBtn, { borderColor: conditionColor + '60' }]}
          onPress={onAppointmentPress}
        >
          <Text style={[s.ctaBtnText, { color: conditionColor }]}>
            Prepare for your appointment →
          </Text>
        </Pressable>
      )}
    </View>
  )
}

// ── Main export ──
export function ConditionIntelligence({ colors }: { colors: ThemeColors }) {
  const s      = useMemo(() => makeConditionIntelligenceStyles(colors), [colors])
  const router = useRouter()
  const { profile, periods, symptomLogs } = useAppData()

  const [expandedCondition, setExpandedCondition] = useState<string | null>(null)

  const conditions = getConditionsFromProfile(profile?.conditions ?? [])
  console.log('profile conditions:', profile?.conditions)
  console.log('parsed conditions:', conditions)

  if (!conditions.length) return null

  return (
    <View style={{ gap: 12 }}>
      {conditions.map((condition) => (
        <ConditionCard
          key={condition}
          condition={condition}
          colors={colors}
          s={s}
          periods={periods}
          symptomLogs={symptomLogs}
          profile={profile}
          expanded={expandedCondition === condition}
          onToggleExpand={() =>
            setExpandedCondition(
              expandedCondition === condition ? null : condition
            )
          }
          onAppointmentPress={() => router.push('/(modals)/appointment')}
        />
      ))}
    </View>
  )
}