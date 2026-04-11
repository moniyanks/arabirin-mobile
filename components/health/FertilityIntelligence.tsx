import { useMemo, useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { format, parseISO } from 'date-fns'
import { ChevronRight, AlertCircle } from 'lucide-react-native'
import { type ThemeColors } from '../../constants/theme'
import { useAppData } from '../../context/AppDataContext'
import { makeFertilityIntelligenceStyles } from '../../styles/components/fertilityIntelligence'
import {
  calculateFertilityInsight,
  CYCLE_QUALITY_LABELS,
  CYCLE_QUALITY_COLORS,
  FERTILE_STATUS_MESSAGES
} from '../../utils/fertilityIntelligence'

export function FertilityIntelligence({ colors }: { colors: ThemeColors }) {
  const s = useMemo(() => makeFertilityIntelligenceStyles(colors), [colors])
  const router = useRouter()
  const { profile, periods, symptomLogs } = useAppData()

  const [expanded, setExpanded] = useState(false)

  const mode = profile?.mode ?? 'cycle'

  const insight = useMemo(
    () => calculateFertilityInsight(periods, symptomLogs, profile),
    [periods, symptomLogs, profile]
  )

  const qualityColor = CYCLE_QUALITY_COLORS[insight.cycleQuality]
  const statusMessage = FERTILE_STATUS_MESSAGES[insight.fertileWindowStatus]

  const formatDateShort = (d: string | null) => (d ? format(parseISO(d), 'd MMM') : '—')

  if (mode !== 'ttc') return null

  return (
    <View style={s.card}>
      <View style={s.cardHeader}>
        <View style={[s.dot, { backgroundColor: colors.accentRose }]} />
        <Text style={s.cardTitle}>Fertility Intelligence</Text>
        <View
          style={[
            s.confidencePill,
            {
              backgroundColor: colors.accentRose + '20',
              borderColor: colors.accentRose + '50'
            }
          ]}
        >
          <Text style={[s.confidencePillText, { color: colors.accentRose }]}>
            {insight.confidence === 'high'
              ? 'High confidence'
              : insight.confidence === 'medium'
                ? 'Good confidence'
                : 'Building accuracy'}
          </Text>
        </View>
      </View>

      <View style={s.statusCard}>
        <Text style={s.statusMessage}>{statusMessage}</Text>
      </View>

      {insight.fertileStart && (
        <View style={s.datesRow}>
          <View style={s.dateCard}>
            <Text style={s.dateLabel}>Fertile window</Text>
            <Text style={s.dateValue}>
              {formatDateShort(insight.fertileStart)} — {formatDateShort(insight.fertileEnd)}
            </Text>
          </View>
          <View style={s.dateCard}>
            <Text style={s.dateLabel}>Ovulation day</Text>
            <Text style={[s.dateValue, { color: colors.accentRose }]}>
              {formatDateShort(insight.ovulationDay)}
            </Text>
          </View>
        </View>
      )}

      {insight.fertileWindowStatus === 'before_fertile' && insight.daysUntilFertile !== null && (
        <View style={s.countdownCard}>
          <Text style={s.countdownNumber}>{insight.daysUntilFertile}</Text>
          <Text style={s.countdownLabel}>
            day{insight.daysUntilFertile !== 1 ? 's' : ''} until your fertile window
          </Text>
        </View>
      )}

      <Pressable style={s.qualityRow} onPress={() => setExpanded(!expanded)}>
        <View style={s.qualityLeft}>
          <Text style={s.qualityLabel}>Cycle quality</Text>
          <Text style={[s.qualityValue, { color: qualityColor }]}>
            {CYCLE_QUALITY_LABELS[insight.cycleQuality]}
          </Text>
        </View>
        <View style={s.qualityBar}>
          <View
            style={[
              s.qualityFill,
              {
                width: `${insight.cycleQualityScore}%` as any,
                backgroundColor: qualityColor
              }
            ]}
          />
        </View>
        <ChevronRight color={colors.textMuted} size={16} strokeWidth={1.5} />
      </Pressable>

      {expanded && (
        <View style={s.factorsList}>
          {insight.cycleQualityFactors.map((factor, i) => (
            <View key={i} style={s.factorItem}>
              <View style={[s.factorDot, { backgroundColor: qualityColor }]} />
              <Text style={s.factorText}>{factor}</Text>
            </View>
          ))}
          {insight.lutealPhaseLength && (
            <View style={s.factorItem}>
              <View
                style={[
                  s.factorDot,
                  {
                    backgroundColor:
                      insight.lutealStatus === 'short' ? colors.accentRose : colors.accentSage
                  }
                ]}
              />
              <Text style={s.factorText}>
                Luteal phase: {insight.lutealPhaseLength} days
                {insight.lutealStatus === 'short' ? ' (short)' : ' (normal)'}
              </Text>
            </View>
          )}
          <Text style={s.factorsNote}>
            Based on {insight.cyclesAnalysed} cycle
            {insight.cyclesAnalysed !== 1 ? 's' : ''} analysed
          </Text>
        </View>
      )}

      {(insight.cervicalMucusLogs > 0 ||
        insight.ovulationPainLogs > 0 ||
        insight.spottingLogs > 0) && (
        <View style={s.symptomSummary}>
          <Text style={s.symptomSummaryTitle}>TTC SYMPTOMS LOGGED</Text>
          <View style={s.symptomRow}>
            {insight.cervicalMucusLogs > 0 && (
              <View style={s.symptomChip}>
                <Text style={s.symptomChipText}>Cervical mucus × {insight.cervicalMucusLogs}</Text>
              </View>
            )}
            {insight.ovulationPainLogs > 0 && (
              <View style={s.symptomChip}>
                <Text style={s.symptomChipText}>Ovulation pain × {insight.ovulationPainLogs}</Text>
              </View>
            )}
            {insight.spottingLogs > 0 && (
              <View style={s.symptomChip}>
                <Text style={s.symptomChipText}>Spotting × {insight.spottingLogs}</Text>
              </View>
            )}
          </View>
        </View>
      )}

      <View style={s.disclaimer}>
        <AlertCircle color={colors.textMuted} size={13} strokeWidth={1.5} />
        <Text style={s.disclaimerText}>
          Predictions are estimates based on your logged data. Always confirm with a healthcare
          provider.
        </Text>
      </View>

      <Pressable style={s.ctaBtn} onPress={() => router.push('/(modals)/appointment')}>
        <Text style={s.ctaBtnText}>Prepare for your appointment →</Text>
      </Pressable>
    </View>
  )
}
