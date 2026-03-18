import { useMemo, useState } from 'react'
import {
  View, Text, Pressable, ScrollView,
  Share, ActivityIndicator,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { X, Share2, FileText, ChevronDown, ChevronUp } from 'lucide-react-native'
import { format } from 'date-fns'
import { useColors } from '../../styles'
import { makeAppointmentStyles } from '../../styles/screens/appointment'
import { useAppData } from '../../context/AppDataContext'
import { buildBodyMetrics } from '../../utils/bodyIntelligence'
import { daysBetween } from '../../utils/cycleHelper'

// ── Condition-specific doctor questions ──
const DOCTOR_QUESTIONS: Record<string, string[]> = {
  fibroids: [
    'Could my symptoms be consistent with uterine fibroids?',
    'Can we do an ultrasound to check for fibroids?',
    'Should we check my iron levels given my heavy bleeding?',
    'What are my treatment options if fibroids are found?',
    'How often should I be monitored if I have fibroids?',
    'Could my fibroids be affecting my fertility?',
  ],
  endo: [
    'Could my pain be consistent with endometriosis?',
    'What diagnostic steps can we take to investigate endometriosis?',
    'Can you refer me to a specialist in endometriosis?',
    'What pain management options are available to me?',
    'How might endometriosis affect my fertility?',
    'What should I track to help with diagnosis?',
  ],
  pcos: [
    'Can we test my hormone levels to check for PCOS?',
    'Would an ultrasound help diagnose my irregular cycles?',
    'Should we check my insulin resistance?',
    'What lifestyle changes would help manage PCOS symptoms?',
    'How might PCOS affect my fertility?',
    'What are the long-term health implications I should know about?',
  ],
  ttc: [
    'Based on my cycle data, when is my most fertile window?',
    'Are there any tests you recommend before we start trying?',
    'How long should we try before seeking further help?',
    'Should I be tracking my basal body temperature?',
    'Are there any supplements you recommend?',
    'What would prompt you to refer us to a fertility specialist?',
  ],
  pregnant: [
    'What symptoms should prompt me to contact you immediately?',
    'Am I at higher risk for any complications I should watch for?',
    'What does my blood pressure look like and is it normal?',
    'Can we discuss my birth plan and preferences?',
    'What should I know about Group B Strep testing?',
    'Who should I contact if I have concerns between appointments?',
  ],
  postpartum: [
    'What is a normal recovery timeline for my type of delivery?',
    'What signs of postpartum depression should I watch for?',
    'When should I expect my period to return?',
    'Are my current symptoms normal for this stage of recovery?',
    'What are my contraception options while breastfeeding?',
    'Can we discuss pelvic floor recovery?',
  ],
  cycle: [
    'Are my cycle patterns within a normal range?',
    'Could my symptoms indicate an underlying condition?',
    'Should I be tracking anything specific?',
    'Are there any tests you recommend based on my history?',
    'What changes in my cycle should prompt me to seek care?',
    'Are there lifestyle factors that could improve my cycle health?',
  ],
}

const SYMPTOM_LABELS: Record<string, string> = {
  cramps: 'Cramps', bloating: 'Bloating', headache: 'Headache',
  backPain: 'Back pain', breastTenderness: 'Breast tenderness',
  nausea: 'Nausea', insomnia: 'Insomnia',
}

const MODE_LABELS: Record<string, string> = {
  fibroids: 'Fibroids', endo: 'Endometriosis', pcos: 'PCOS',
  ttc: 'Trying to Conceive', pregnant: 'Pregnancy', postpartum: 'Postpartum',
  cycle: 'Cycle Tracking', healing: 'Loss or Recovery',
  perimenopause: 'Perimenopause',
}

export default function AppointmentScreen() {
  const colors  = useColors()
  const s       = useMemo(() => makeAppointmentStyles(colors), [colors])
  const router  = useRouter()
  const { profile, periods, symptomLogs, cycleLength, periodLength } = useAppData()

  const [expandedSection, setExpandedSection] = useState<string | null>('symptoms')
  const [sharing, setSharing] = useState(false)

  const mode = (profile as any)?.mode as string ?? 'cycle'
  const name = (profile as any)?.name as string ?? 'Sister'
  const questions = DOCTOR_QUESTIONS[mode] ?? DOCTOR_QUESTIONS.cycle

  const metrics = useMemo(() =>
    buildBodyMetrics(periods, symptomLogs, profile),
    [periods, symptomLogs, profile]
  )

  // ── Symptom frequency from logs ──
  const symptomSummary = useMemo(() => {
    if (!symptomLogs.length) return []
    const counts: Record<string, number> = {}
    symptomLogs.forEach((log) => {
      if (log.cramps && log.cramps !== 'none') counts.cramps = (counts.cramps || 0) + 1
      if (log.flow && log.flow !== 'none')     counts.flow   = (counts.flow   || 0) + 1
      log.extras?.forEach((ex) => { counts[ex] = (counts[ex] || 0) + 1 })
    })
    return Object.entries(counts)
      .map(([key, count]) => ({ key, label: SYMPTOM_LABELS[key] || key, count }))
      .sort((a, b) => b.count - a.count)
  }, [symptomLogs])

  // ── Flow severity summary ──
  const flowSummary = useMemo(() => {
    const heavy  = symptomLogs.filter((l) => l.flow === 'heavy').length
    const medium = symptomLogs.filter((l) => l.flow === 'medium').length
    const light  = symptomLogs.filter((l) => l.flow === 'light').length
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
  const avgCycle = useMemo(() => {
    if (periods.length < 2) return null
    const lengths: number[] = []
    for (let i = 1; i < periods.length; i++) {
      lengths.push(daysBetween(periods[i - 1].startDate, periods[i].startDate))
    }
    return Math.round(lengths.reduce((a, b) => a + b, 0) / lengths.length)
  }, [periods])

  const reportDate = format(new Date(), 'd MMMM yyyy')

  // ── Share report as text ──
  const handleShare = async () => {
    setSharing(true)
    try {
      const lines = [
        `ÀRÀBÌRÍN — APPOINTMENT PREP REPORT`,
        `Prepared for: ${name}`,
        `Date: ${reportDate}`,
        `Journey: ${MODE_LABELS[mode] || mode}`,
        ``,
        `── CYCLE SUMMARY ──`,
        `Periods logged: ${periods.length}`,
        avgCycle ? `Average cycle length: ${avgCycle} days` : `Not enough data for average cycle`,
        `Period length: ${periodLength} days`,
        ``,
        `── SYMPTOM PATTERNS (last ${symptomLogs.length} logs) ──`,
        ...symptomSummary.map((s) => `• ${s.label}: logged ${s.count} times`),
        ``,
        flowSummary.total > 0 ? `── FLOW SEVERITY ──` : '',
        flowSummary.heavy  > 0 ? `• Heavy flow: ${flowSummary.heavy} days logged` : '',
        flowSummary.medium > 0 ? `• Medium flow: ${flowSummary.medium} days logged` : '',
        flowSummary.light  > 0 ? `• Light flow: ${flowSummary.light} days logged` : '',
        ``,
        `── QUESTIONS FOR MY DOCTOR ──`,
        ...questions.map((q, i) => `${i + 1}. ${q}`),
        ``,
        `── DISCLAIMER ──`,
        `This report contains personal health tracking data recorded in the Àràbìrín app.`,
        `It is not a medical diagnosis and should not be used as a substitute for 
        professional medical advice, diagnosis, or treatment  Please share with your healthcare provider`,
        `as a supporting context for your consultation.`,
        ``,
        `Generated by Àràbìrín · All health statistics are sourced from peer-reviewed research . arabirin.com`,
      ].filter(Boolean)

      await Share.share({
        title: 'My Appointment Prep — Àràbìrín',
        message: lines.join('\n'),
      })
    } finally {
      setSharing(false)
    }
  }

  const toggleSection = (key: string) =>
    setExpandedSection((prev) => prev === key ? null : key)

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
            {MODE_LABELS[mode] || mode} · {reportDate}
          </Text>
          <Text style={s.reportMeta}>
            {periods.length} periods logged · {symptomLogs.length} symptom entries
          </Text>
        </View>

        {/* Disclaimer */}
        <View style={s.disclaimer}>
          <Text style={s.disclaimerText}>
            This is your personal tracking data — not a medical diagnosis. Share it with your healthcare provider to support your conversation.
          </Text>
        </View>

        {/* Section 1 — Cycle pattern */}
        <Pressable
          style={s.sectionHeader}
          onPress={() => toggleSection('cycle')}
        >
          <Text style={s.sectionTitle}>Cycle Pattern</Text>
          {expandedSection === 'cycle'
            ? <ChevronUp color={colors.textMuted} size={18} strokeWidth={1.5} />
            : <ChevronDown color={colors.textMuted} size={18} strokeWidth={1.5} />
          }
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
                    <Text style={s.dataValue}>{metrics.minCycle}–{metrics.maxCycle} days</Text>
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
        <Pressable
          style={s.sectionHeader}
          onPress={() => toggleSection('symptoms')}
        >
          <Text style={s.sectionTitle}>Symptom Patterns</Text>
          {expandedSection === 'symptoms'
            ? <ChevronUp color={colors.textMuted} size={18} strokeWidth={1.5} />
            : <ChevronDown color={colors.textMuted} size={18} strokeWidth={1.5} />
          }
        </Pressable>

        {expandedSection === 'symptoms' && (
          <View style={s.sectionBody}>
            {symptomLogs.length === 0 ? (
              <Text style={s.emptyText}>No symptoms logged yet. Start logging to build your report.</Text>
            ) : (
              <>
                {/* Flow severity */}
                {flowSummary.total > 0 && (
                  <View style={s.subSection}>
                    <Text style={s.subSectionTitle}>Flow severity</Text>
                    {flowSummary.heavy  > 0 && (
                      <View style={s.dataRow}>
                        <Text style={s.dataLabel}>Heavy flow</Text>
                        <Text style={[s.dataValue, { color: colors.accentRose }]}>{flowSummary.heavy} days logged</Text>
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
                        <Text style={[s.dataLabel, { textTransform: 'capitalize' }]}>{item.mood}</Text>
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
        <Pressable
          style={s.sectionHeader}
          onPress={() => toggleSection('questions')}
        >
          <Text style={s.sectionTitle}>Questions for Your Doctor</Text>
          {expandedSection === 'questions'
            ? <ChevronUp color={colors.textMuted} size={18} strokeWidth={1.5} />
            : <ChevronDown color={colors.textMuted} size={18} strokeWidth={1.5} />
          }
        </Pressable>

        {expandedSection === 'questions' && (
          <View style={s.sectionBody}>
            <Text style={s.questionsIntro}>
              Based on your {MODE_LABELS[mode] || mode} journey, here are questions worth raising:
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
        <View style={s.sourcesCard}>
            <Text style={s.sourcesTitle}>Sources</Text>
            <Text style={s.sourcesText}>
                Baird et al. (2003). Am J Obstet Gynecol, 188(1), 100-107.{'\n'}
                Bougie et al. (2019). BJOG, 126(9), 1104-1115.{'\n'}
                Bozdag et al. (2016). Human Reproduction, 31(12), 2841-2855.{'\n'}
                CDC MMWR (2019). Pregnancy-Related Deaths, United States 2007-2016.{'\n'}
                Hoffman et al. (2016). PNAS, 113(16), 4296-4301.
            </Text>
        </View>

        {/* Share button */}
        <Pressable style={s.shareBtn} onPress={handleShare} disabled={sharing}>
          {sharing
            ? <ActivityIndicator color={colors.bgPrimary} />
            : (
              <>
                <Share2 color={colors.bgPrimary} size={18} strokeWidth={1.5} />
                <Text style={s.shareBtnText}>Share with my doctor</Text>
              </>
            )
          }
        </Pressable>

        <Text style={s.footerNote}>
          Generated by Àràbìrín · Your data, your story, your health.
        </Text>

      </ScrollView>
    </SafeAreaView>
  )
}