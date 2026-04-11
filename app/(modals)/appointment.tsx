import { useMemo, useState } from 'react'
import { View, Text, Pressable, ScrollView, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { X, Share2, ChevronDown, ChevronUp } from 'lucide-react-native'
import { format } from 'date-fns'
import { useColors } from '../../styles'
import { makeAppointmentStyles } from '../../styles/screens/appointment'
import { useAppData } from '../../context/AppDataContext'
import { buildBodyMetrics } from '../../utils/bodyIntelligence'
import { generateAndShareAppointmentPDF } from '../../utils/appointmentReport'
import { DOCTOR_QUESTIONS, SYMPTOM_LABELS, MODE_LABELS } from '../../utils/appointmentReport/config'
import type { QuestionSourceKey, SupportedMode } from '../../utils/appointmentReport/types'

export default function AppointmentScreen() {
  const colors = useColors()
  const s = useMemo(() => makeAppointmentStyles(colors), [colors])
  const router = useRouter()
  const { profile, periods, symptomLogs, periodLength } = useAppData()

  const [expandedSection, setExpandedSection] = useState<string | null>('symptoms')
  const [sharing, setSharing] = useState(false)

  const mode = profile?.mode ?? 'cycle'
  const name = profile?.name ?? 'Sister'
  const questions = DOCTOR_QUESTIONS[mode as QuestionSourceKey] ?? DOCTOR_QUESTIONS.cycle

  const metrics = useMemo(
    () => buildBodyMetrics(periods, symptomLogs, profile),
    [periods, symptomLogs, profile]
  )

  // ── Symptom frequency from logs ──
  const symptomSummary = useMemo(() => {
    if (!symptomLogs.length) return []
    const counts: Record<string, number> = {}
    symptomLogs.forEach((log) => {
      if (log.cramps && log.cramps !== 'none') counts.cramps = (counts.cramps || 0) + 1
      if (log.flow && log.flow !== 'none') counts.flow = (counts.flow || 0) + 1
      log.extras?.forEach((ex) => {
        counts[ex] = (counts[ex] || 0) + 1
      })
    })
    return Object.entries(counts)
      .map(([key, count]) => ({ key, label: SYMPTOM_LABELS[key] || key, count }))
      .sort((a, b) => b.count - a.count)
  }, [symptomLogs])

  // ── Flow severity summary ──
  const flowSummary = useMemo(() => {
    const heavy = symptomLogs.filter((l) => l.flow === 'heavy').length
    const medium = symptomLogs.filter((l) => l.flow === 'medium').length
    const light = symptomLogs.filter((l) => l.flow === 'light').length
    return { heavy, medium, light, total: heavy + medium + light }
  }, [symptomLogs])

  // ── Mood summary ──
  const moodSummary = useMemo(() => {
    const counts: Record<string, number> = {}
    symptomLogs.forEach((log) => {
      if (log.mood) counts[log.mood] = (counts[log.mood] || 0) + 1
    })
    return Object.entries(counts)
      .sort((a, b) => b[1] - a[1])
      .slice(0, 3)
      .map(([mood, count]) => ({ mood, count }))
  }, [symptomLogs])

  // ── Average cycle ──
  const avgCycle = metrics.avgCycleLength ?? null

  const reportDate = format(new Date(), 'd MMMM yyyy')

  // ── Share report  ──
  const handleShare = async () => {
    setSharing(true)

    try {
      const result = await generateAndShareAppointmentPDF(profile, periods, symptomLogs)

      if (!result.success) {
        throw new Error(result.error)
      }
    } catch (err) {
      console.error('PDF generation failed:', err)
      alert(
        err instanceof Error
          ? err.message
          : 'We could not generate your appointment report right now.'
      )
    } finally {
      setSharing(false)
    }
  }

  const toggleSection = (key: string) => setExpandedSection((prev) => (prev === key ? null : key))

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.topBar}>
        <View>
          <Text style={s.topBarTitle}>Appointment Prep</Text>
          <Text style={s.topBarSub}>Your body's story, ready to share</Text>
        </View>
        <Pressable style={s.closeBtn} onPress={() => router.back()}>
          <X color={colors.textMuted} size={20} strokeWidth={1.5} />
        </Pressable>
      </View>

      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Report header */}
        <View style={s.reportHeader}>
          <Text style={s.reportName}>{name}</Text>
          <Text style={s.reportMeta}>
            {MODE_LABELS[mode as SupportedMode] || mode} · {reportDate}
          </Text>
          <Text style={s.reportMeta}>
            {periods.length} periods logged · {symptomLogs.length} symptom entries
          </Text>
        </View>

        {/* Disclaimer */}
        <View style={s.disclaimer}>
          <Text style={s.disclaimerText}>
            This is your personal tracking data — not a medical diagnosis. Share it with your
            healthcare provider to support your conversation.
          </Text>
        </View>

        {/* Section 1 — Cycle pattern */}
        <Pressable style={s.sectionHeader} onPress={() => toggleSection('cycle')}>
          <Text style={s.sectionTitle}>Cycle Pattern</Text>
          {expandedSection === 'cycle' ? (
            <ChevronUp color={colors.textMuted} size={18} strokeWidth={1.5} />
          ) : (
            <ChevronDown color={colors.textMuted} size={18} strokeWidth={1.5} />
          )}
        </Pressable>

        {expandedSection === 'cycle' && (
          <View style={s.sectionBody}>
            {periods.length === 0 ? (
              <Text style={s.emptyText}>No periods logged yet.</Text>
            ) : (
              <>
                <View style={s.dataRow}>
                  <Text style={s.dataLabel}>Periods logged</Text>
                  <Text style={s.dataValue}>{periods.length}</Text>
                </View>
                {avgCycle && (
                  <View style={s.dataRow}>
                    <Text style={s.dataLabel}>Average cycle length</Text>
                    <Text style={s.dataValue}>{avgCycle} days</Text>
                  </View>
                )}
                <View style={s.dataRow}>
                  <Text style={s.dataLabel}>Average period length</Text>
                  <Text style={s.dataValue}>{periodLength} days</Text>
                </View>
                {metrics.minCycle && metrics.maxCycle && (
                  <View style={s.dataRow}>
                    <Text style={s.dataLabel}>Cycle range</Text>
                    <Text style={s.dataValue}>
                      {metrics.minCycle}–{metrics.maxCycle} days
                    </Text>
                  </View>
                )}
                {periods[periods.length - 1] && (
                  <View style={s.dataRow}>
                    <Text style={s.dataLabel}>Last period started</Text>
                    <Text style={s.dataValue}>
                      {format(new Date(periods[periods.length - 1].startDate), 'd MMM yyyy')}
                    </Text>
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Section 2 — Symptom patterns */}
        <Pressable style={s.sectionHeader} onPress={() => toggleSection('symptoms')}>
          <Text style={s.sectionTitle}>Symptom Patterns</Text>
          {expandedSection === 'symptoms' ? (
            <ChevronUp color={colors.textMuted} size={18} strokeWidth={1.5} />
          ) : (
            <ChevronDown color={colors.textMuted} size={18} strokeWidth={1.5} />
          )}
        </Pressable>

        {expandedSection === 'symptoms' && (
          <View style={s.sectionBody}>
            {symptomLogs.length === 0 ? (
              <Text style={s.emptyText}>
                No symptoms logged yet. Start logging to build your report.
              </Text>
            ) : (
              <>
                {/* Flow severity */}
                {flowSummary.total > 0 && (
                  <View style={s.subSection}>
                    <Text style={s.subSectionTitle}>Flow severity</Text>
                    {flowSummary.heavy > 0 && (
                      <View style={s.dataRow}>
                        <Text style={s.dataLabel}>Heavy flow</Text>
                        <Text style={[s.dataValue, { color: colors.accentRose }]}>
                          {flowSummary.heavy} days logged
                        </Text>
                      </View>
                    )}
                    {flowSummary.medium > 0 && (
                      <View style={s.dataRow}>
                        <Text style={s.dataLabel}>Medium flow</Text>
                        <Text style={s.dataValue}>{flowSummary.medium} days logged</Text>
                      </View>
                    )}
                    {flowSummary.light > 0 && (
                      <View style={s.dataRow}>
                        <Text style={s.dataLabel}>Light flow</Text>
                        <Text style={s.dataValue}>{flowSummary.light} days logged</Text>
                      </View>
                    )}
                  </View>
                )}

                {/* Symptoms frequency */}
                {symptomSummary.length > 0 && (
                  <View style={s.subSection}>
                    <Text style={s.subSectionTitle}>Recurring symptoms</Text>
                    {symptomSummary.map((item) => (
                      <View key={item.key} style={s.dataRow}>
                        <Text style={s.dataLabel}>{item.label}</Text>
                        <Text style={s.dataValue}>{item.count}x logged</Text>
                      </View>
                    ))}
                  </View>
                )}

                {/* Mood patterns */}
                {moodSummary.length > 0 && (
                  <View style={s.subSection}>
                    <Text style={s.subSectionTitle}>Mood patterns</Text>
                    {moodSummary.map((item) => (
                      <View key={item.mood} style={s.dataRow}>
                        <Text style={[s.dataLabel, { textTransform: 'capitalize' }]}>
                          {item.mood}
                        </Text>
                        <Text style={s.dataValue}>{item.count}x logged</Text>
                      </View>
                    ))}
                  </View>
                )}
              </>
            )}
          </View>
        )}

        {/* Section 3 — Questions for doctor */}
        <Pressable style={s.sectionHeader} onPress={() => toggleSection('questions')}>
          <Text style={s.sectionTitle}>Questions for Your Doctor</Text>
          {expandedSection === 'questions' ? (
            <ChevronUp color={colors.textMuted} size={18} strokeWidth={1.5} />
          ) : (
            <ChevronDown color={colors.textMuted} size={18} strokeWidth={1.5} />
          )}
        </Pressable>

        {expandedSection === 'questions' && (
          <View style={s.sectionBody}>
            <Text style={s.questionsIntro}>
              Based on your {MODE_LABELS[mode as SupportedMode] || mode} journey, here are questions
              worth raising:
            </Text>
            {questions.map((q, i) => (
              <View key={i} style={s.questionItem}>
                <View style={s.questionNumber}>
                  <Text style={s.questionNumberText}>{i + 1}</Text>
                </View>
                <Text style={s.questionText}>{q}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Share button */}
        <Pressable style={s.shareBtn} onPress={handleShare} disabled={sharing}>
          {sharing ? (
            <ActivityIndicator color={colors.bgPrimary} />
          ) : (
            <>
              <Share2 color={colors.bgPrimary} size={18} strokeWidth={1.5} />
              <Text style={s.shareBtnText}>Download PDF report</Text>
            </>
          )}
        </Pressable>

        <Text style={s.footerNote}>
          Generated by Àràbìrín · Your data, your story, your health.
        </Text>
      </ScrollView>
    </SafeAreaView>
  )
}
