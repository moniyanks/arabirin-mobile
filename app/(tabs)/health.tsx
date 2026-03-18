import { useState, useMemo } from 'react'
import {
  View, Text, Pressable, ScrollView, Modal,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { X, ChevronRight } from 'lucide-react-native'
import { useColors } from '../../styles'
import { makeHealthStyles } from '../../styles/screens/health'
import { useAppData } from '../../context/AppDataContext'
import { getPhaseInfo } from '../../utils/cycleHelper'
import type { PhaseKey } from '../../utils/cycleHelper'

// ── Phase education content ──
const PHASE_EDUCATION: Record<string, {
  title: string
  body: string
  tip: string
  tipLabel: string
}> = {
  period: {
    title: 'Your period phase',
    body: 'Your body is shedding the uterine lining it built last cycle. Progesterone and oestrogen are at their lowest, which is why you may feel tired, tender, or emotional. This is not weakness — it is your body doing exactly what it should.',
    tip: 'Honour the rest. Warm foods, gentle movement, and extra sleep will serve you better than pushing through right now.',
    tipLabel: 'What helps',
  },
  follicular: {
    title: 'Your follicular phase',
    body: 'Oestrogen is rising as your body prepares a new egg. You may notice your energy returning, your mind feeling clearer, and a quiet sense of optimism settling in. This is your natural reset.',
    tip: 'This is a great time to start new projects, have important conversations, and move your body in ways that feel energising.',
    tipLabel: 'What this phase is good for',
  },
  fertile: {
    title: 'Your fertile window',
    body: 'Oestrogen is peaking and your body is approaching ovulation. You may feel more sociable, confident, and physically at your best. Your cervical mucus becomes clear and stretchy — this is your body\'s natural sign.',
    tip: 'If you are trying to conceive, this is your most important window. If you are not, be mindful — this is when fertility is highest.',
    tipLabel: 'What to know',
  },
  ovulation: {
    title: 'Your ovulation day',
    body: 'An egg has been released — this is your peak day. Oestrogen is at its highest and a surge of LH triggered ovulation. Many women feel their most magnetic, energetic, and clear-headed today.',
    tip: 'Your body temperature rises slightly after ovulation. If you track basal body temperature, today you may notice the shift.',
    tipLabel: 'What to watch',
  },
  luteal: {
    title: 'Your luteal phase',
    body: 'Progesterone rises after ovulation to prepare the uterine lining. If no pregnancy occurs, both hormones drop toward the end of this phase — this is what triggers PMS symptoms like bloating, mood shifts, and fatigue.',
    tip: 'Magnesium-rich foods like dark chocolate, leafy greens, and nuts can ease PMS symptoms. Gentle movement helps too.',
    tipLabel: 'What helps',
  },
  unknown: {
    title: 'Your cycle',
    body: 'Log your first period to unlock your personal phase education. Once we know your cycle, we can tell you exactly what is happening in your body each day.',
    tip: 'Tap the Calendar tab to log your period start date.',
    tipLabel: 'Get started',
  },
}

// ── Health conditions ──
const HEALTH_CONDITIONS = [
  {
    key: 'fibroids',
    emoji: '🔴',
    color: '#D99B9B',
    title: 'Fibroids',
    desc: 'Up to 80% of Black women develop fibroids by age 50',
    what: 'Fibroids are non-cancerous growths that develop in or around the uterus. They are made of muscle and fibrous tissue.',
    stats: 'Up to 80% of Black women develop fibroids by age 50 — significantly higher than other groups.',
    symptoms: [
      'Heavy or prolonged periods',
      'Pelvic pain or pressure',
      'Frequent urination',
      'Pain during sex',
      'Lower back pain',
      'Bloating or enlarged abdomen',
    ],
    action: 'See a doctor if your periods are unusually heavy, last longer than 7 days, or if you feel pelvic pressure.',
  },
  {
    key: 'endo',
    emoji: '🟣',
    color: '#9B8FD9',
    title: 'Endometriosis',
    desc: 'Often misdiagnosed or dismissed in Black women',
    what: 'Endometriosis occurs when tissue similar to the uterine lining grows outside the uterus, causing pain and inflammation.',
    stats: 'Black women are significantly less likely to be diagnosed with endometriosis — not because they have it less, but because they are less likely to be believed.',
    symptoms: [
      'Severe period cramps',
      'Chronic pelvic pain',
      'Pain during or after sex',
      'Pain with bowel movements',
      'Heavy periods',
      'Fatigue and bloating',
    ],
    action: 'Trust your pain. If cramps are debilitating, seek a second opinion. You deserve to be heard.',
  },
  {
    key: 'pcos',
    emoji: '🔵',
    color: '#9BB5D9',
    title: 'PCOS',
    desc: 'Polycystic ovary syndrome affects 1 in 10 women',
    what: 'Polycystic Ovary Syndrome (PCOS) is a hormonal disorder that affects how the ovaries work.',
    stats: '1 in 10 women have PCOS. It is one of the most common causes of irregular periods and fertility challenges.',
    symptoms: [
      'Irregular or missed periods',
      'Excess hair growth on face or body',
      'Acne or oily skin',
      'Weight gain',
      'Thinning hair on scalp',
      'Difficulty getting pregnant',
    ],
    action: 'Ask your doctor for a hormone panel and ultrasound if you have irregular cycles or any of the above symptoms.',
  },
  {
    key: 'maternal',
    emoji: '🤱🏾',
    color: '#D9B89B',
    title: 'Maternal Health',
    desc: 'Black women are 3x more likely to die in childbirth',
    what: 'Maternal health covers the health of women during pregnancy, childbirth and the postnatal period.',
    stats: 'Black women are 3-4x more likely to die from pregnancy-related causes than white women — regardless of income or education level.',
    symptoms: [
      'Severe headaches in pregnancy',
      'Vision changes',
      'Severe swelling of hands or face',
      'Chest pain or difficulty breathing',
      'Excessive bleeding after birth',
      'Signs of postpartum depression',
    ],
    action: 'Advocate loudly for yourself. Bring someone with you to appointments. Document everything. You deserve safe care.',
  },
]

type Condition = typeof HEALTH_CONDITIONS[number] | null

export default function HealthScreen() {
  const colors = useColors()
  const s      = useMemo(() => makeHealthStyles(colors), [colors])
  const router = useRouter()
  const { periods, cycleLength, periodLength } = useAppData()

  const [activeCondition, setActiveCondition] = useState<Condition>(null)

  const currentDay = periods.length > 0
    ? Math.max(1, Math.ceil((Date.now() - new Date(periods[periods.length - 1].startDate).getTime()) / 86400000))
    : 1

  const phaseInfo = getPhaseInfo(currentDay, cycleLength || 28, periodLength || 5)
  const phase     = phaseInfo.phase || 'unknown'
  const edu       = PHASE_EDUCATION[phase] ?? PHASE_EDUCATION.unknown

  const phaseLabel: Record<string, string> = {
    period: 'Menstrual', follicular: 'Follicular',
    fertile: 'Fertile', ovulation: 'Ovulation',
    luteal: 'Luteal', unknown: 'Cycle',
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Phase education card */}
        <View style={s.phaseCard}>
          <View style={s.phaseCardHeader}>
            <View style={s.phasePill}>
              <Text style={s.phasePillText}>{phaseLabel[phase] ?? phase}</Text>
            </View>
            <Text style={s.phaseCardTitle}>{edu.title}</Text>
          </View>

          <Text style={s.phaseCardBody}>{edu.body}</Text>

          <View style={s.tipBox}>
            <Text style={s.tipLabel}>{edu.tipLabel}</Text>
            <Text style={s.tipText}>{edu.tip}</Text>
          </View>

          {phase === 'unknown' && (
            <Pressable
              style={s.logNowBtn}
              onPress={() => router.push('/(tabs)/calendar')}
            >
              <Text style={s.logNowBtnText}>Log my period →</Text>
            </Pressable>
          )}
        </View>

        {/* Health Hub */}
        <View style={s.hubSection}>
          <Text style={s.hubTitle}>Black Women's Health Hub</Text>
          <Text style={s.hubSubtitle}>Conditions that disproportionately affect us</Text>

          <View style={s.hubCards}>
            {HEALTH_CONDITIONS.map((condition) => (
              <Pressable
                key={condition.key}
                style={s.hubCard}
                onPress={() => setActiveCondition(condition)}
              >
                <Text style={s.hubEmoji}>{condition.emoji}</Text>
                <View style={s.hubContent}>
                  <Text style={s.hubCardTitle}>{condition.title}</Text>
                  <Text style={s.hubCardDesc}>{condition.desc}</Text>
                </View>
                <ChevronRight color={colors.textMuted} size={18} strokeWidth={1.5} />
              </Pressable>
            ))}
          </View>
        </View>
      </ScrollView>

      {/* Health condition modal */}
      <Modal
        visible={!!activeCondition}
        animationType="slide"
        transparent
        onRequestClose={() => setActiveCondition(null)}
      >
        <View style={s.modalOverlay}>
          <Pressable style={s.modalBackdrop} onPress={() => setActiveCondition(null)} />

          <View style={s.modalSheet}>
            <View style={s.handleWrap}>
              <View style={s.handle} />
            </View>

            <ScrollView
              contentContainerStyle={s.modalContent}
              showsVerticalScrollIndicator={false}
            >
              {activeCondition && (
                <>
                  <View style={s.modalHeader}>
                    <Text style={s.modalEmoji}>{activeCondition.emoji}</Text>
                    <Text style={s.modalTitle}>{activeCondition.title}</Text>
                    <Pressable style={s.closeBtn} onPress={() => setActiveCondition(null)}>
                      <X color={colors.textMuted} size={20} strokeWidth={1.5} />
                    </Pressable>
                  </View>

                  <View style={[s.statsBox, { borderColor: activeCondition.color + '40' }]}>
                    <Text style={s.statsText}>{activeCondition.stats}</Text>
                  </View>

                  <View style={s.modalSection}>
                    <Text style={s.modalSectionTitle}>What is it?</Text>
                    <Text style={s.modalBodyText}>{activeCondition.what}</Text>
                  </View>

                  <View style={s.modalSection}>
                    <Text style={s.modalSectionTitle}>Symptoms to watch for</Text>
                    {activeCondition.symptoms.map((symptom, i) => (
                      <View key={i} style={s.symptomItem}>
                        <View style={[s.symptomDot, { backgroundColor: activeCondition.color }]} />
                        <Text style={s.symptomText}>{symptom}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={s.actionBox}>
                    <Text style={s.actionText}>💛 {activeCondition.action}</Text>
                  </View>

                  <Pressable style={s.closeFullBtn} onPress={() => setActiveCondition(null)}>
                    <Text style={s.closeFullBtnText}>Close</Text>
                  </Pressable>
                </>
              )}
            </ScrollView>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}