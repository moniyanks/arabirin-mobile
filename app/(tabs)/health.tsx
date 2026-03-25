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
import { ConditionIntelligence } from '../../components/health/ConditionIntelligence'
import { FertilityIntelligence } from '../../components/health/FertilityIntelligence'

// ── Phase education content ──
const PHASE_EDUCATION: Record<string, {
  title: string
  body: string
  tip: string
  tipLabel: string
}> = {
  period: {
    title: 'Your menstrual phase',
    body: 'During menstruation, progesterone and oestrogen are at their lowest as your uterus sheds its lining. This hormonal shift is commonly associated with fatigue, cramping, and emotional sensitivity. These experiences are a normal part of the cycle for many women.',
    tip: 'Rest where possible. Warmth, gentle movement, and staying hydrated are commonly reported to help with discomfort during this phase.',
    tipLabel: 'What may help',
  },
  follicular: {
    title: 'Your follicular phase',
    body: 'As oestrogen rises and your body prepares to release an egg, many women report increasing energy, mental clarity, and a more positive mood. This phase begins on the first day of your period and continues until ovulation.',
    tip: 'This phase is often associated with higher energy and motivation — a potentially good time for new projects or challenging tasks.',
    tipLabel: 'What this phase may support',
  },
  fertile: {
    title: 'Your fertile window',
    body: 'Oestrogen peaks in the days leading up to ovulation. Many women report feeling more sociable and energetic during this time. Changes in cervical mucus — becoming clearer and more stretchy — are commonly associated with this phase.',
    tip: 'If you are trying to conceive, this window is generally considered the most important for timing. If you are not, this is worth being aware of.',
    tipLabel: 'What to be aware of',
  },
  ovulation: {
    title: 'Your ovulation day',
    body: 'Ovulation occurs when an egg is released from the ovary, triggered by a surge in luteinising hormone (LH). Many women report feeling their most energetic around this time. Basal body temperature typically rises slightly after ovulation.',
    tip: 'Tracking basal body temperature alongside app predictions can help you understand your personal ovulation patterns over time.',
    tipLabel: 'What to track',
  },
  luteal: {
    title: 'Your luteal phase',
    body: 'After ovulation, progesterone rises to prepare the uterine lining. If no pregnancy occurs, both oestrogen and progesterone drop near the end of this phase. This hormonal shift is commonly associated with PMS symptoms including bloating, mood changes, and fatigue.',
    tip: 'Magnesium-rich foods such as dark leafy greens, nuts, and seeds are associated with reduced PMS symptoms in some research. Gentle exercise may also help.',
    tipLabel: 'What research suggests may help',
  },
  unknown: {
    title: 'Understanding your cycle',
    body: 'Log your first period to unlock personalised phase information. Once Àràbìrín knows your cycle, it can help you understand what may be happening in your body each day.',
    tip: 'Tap the Calendar tab to log your period start date and begin building your cycle picture.',
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
    desc: 'Studies show up to 80% of Black women develop fibroids by age 50',
    what: 'Fibroids are non-cancerous growths that develop in or around the uterus. They are made of muscle and fibrous tissue and vary widely in size and location.',
    stats: 'Research suggests up to 80% of Black women develop fibroids by age 50 — a significantly higher rate than other groups. Black women also tend to develop fibroids earlier, with more severe symptoms. (Baird et al., Am J Obstet Gynecol, 2003)',
    symptoms: [
      'Heavy or prolonged periods',
      'Pelvic pain or pressure',
      'Frequent urination',
      'Pain during sex',
      'Lower back pain',
      'Bloating or enlarged abdomen',
    ],
    action: 'If your periods are unusually heavy, last longer than 7 days, or you feel persistent pelvic pressure, speak to a healthcare provider. You are entitled to ask for an ultrasound.',
    source: 'Baird et al., American Journal of Obstetrics and Gynecology, 2003',
  },
  {
    key: 'endo',
    emoji: '🟣',
    color: '#9B8FD9',
    title: 'Endometriosis',
    desc: 'Research shows Black women are less likely to be diagnosed, not less likely to have it',
    what: 'Endometriosis occurs when tissue similar to the uterine lining grows outside the uterus, causing inflammation, pain, and in some cases, fertility challenges.',
    stats: 'Studies indicate Black women are diagnosed with endometriosis at significantly lower rates than white women — not because they have it less, but due to documented disparities in how their pain is assessed and believed. (Bougie et al., BJOG, 2019)',
    symptoms: [
      'Severe period cramps',
      'Chronic pelvic pain',
      'Pain during or after sex',
      'Pain with bowel movements or urination',
      'Heavy periods',
      'Fatigue and bloating',
    ],
    action: 'Trust your pain. If cramps are debilitating or interfering with your daily life, you are entitled to seek a second opinion. Documenting your symptoms over time can support your case.',
    source: 'Bougie et al., BJOG: An International Journal of Obstetrics and Gynaecology, 2019',
  },
  {
    key: 'pcos',
    emoji: '🔵',
    color: '#9BB5D9',
    title: 'PCOS',
    desc: 'Polycystic ovary syndrome is estimated to affect 1 in 10 women worldwide',
    what: 'Polycystic Ovary Syndrome (PCOS) is a hormonal condition that affects how the ovaries work. It is one of the most common causes of irregular periods and is associated with fertility challenges.',
    stats: 'PCOS is estimated to affect approximately 1 in 10 women of reproductive age worldwide, though many remain undiagnosed. It is associated with insulin resistance, which may be more prevalent in women of colour. (Bozdag et al., Human Reproduction, 2016)',
    symptoms: [
      'Irregular or missed periods',
      'Excess hair growth on face or body',
      'Acne or oily skin',
      'Weight changes',
      'Thinning hair on scalp',
      'Difficulty getting pregnant',
    ],
    action: 'If you have irregular cycles or recognise several of these symptoms, ask your healthcare provider about hormone panel testing and an ultrasound. Early diagnosis can make a significant difference.',
    source: 'Bozdag et al., Human Reproduction, 2016',
  },
  {
    key: 'maternal',
    emoji: '🤱🏾',
    color: '#D9B89B',
    title: 'Maternal Health',
    desc: 'CDC data shows Black women face significantly higher pregnancy-related mortality rates',
    what: 'Maternal health covers the health and wellbeing of women during pregnancy, childbirth, and the postnatal period. Disparities in maternal outcomes for Black women are well-documented and not explained by income or education alone.',
    stats: 'According to CDC data, Black women in the United States are approximately 3 times more likely to die from pregnancy-related causes than white women — a disparity that persists across income and education levels. (CDC MMWR, Pregnancy-Related Deaths, 2019)',
    symptoms: [
      'Severe headaches during pregnancy',
      'Sudden vision changes',
      'Severe swelling of hands, feet, or face',
      'Chest pain or difficulty breathing',
      'Excessive bleeding after birth',
      'Persistent sadness or anxiety after birth',
    ],
    action: 'Advocate clearly for yourself at every appointment. Bring a support person when possible. If a concern is dismissed, you have the right to ask again, request documentation, and seek a second opinion.',
    source: 'CDC MMWR: Racial/Ethnic Disparities in Pregnancy-Related Deaths, 2019',
  },
  {
    key: 'thalassemia',
    emoji: '🩸',
    color: '#C17B7B',
    title: 'Thalassemia',
    desc: 'A blood disorder that significantly impacts menstrual health in women of colour',
    what: 'Thalassemia is an inherited blood disorder that affects haemoglobin production. Women with thalassemia or thalassemia trait may experience significant menstrual and reproductive health challenges that are frequently overlooked.',
    stats: 'Thalassemia trait is significantly more common in people of African, Mediterranean, Middle Eastern, and South Asian descent. Many women carry the trait without knowing it, yet it can significantly affect their menstrual health and fertility. (Weatherall, Am J Human Genetics, 2010)',
    symptoms: [
      'Delayed onset of periods',
      'Irregular or absent periods',
      'Unusually heavy periods',
      'Severe fatigue during menstruation',
      'Pale skin or yellowing',
      'Difficulty getting pregnant',
      'Bone pain',
    ],
    action: 'If you experience heavy periods alongside persistent fatigue, ask your healthcare provider about a full blood count and haemoglobin electrophoresis test. Knowing your thalassemia status matters for your reproductive health planning.',
    source: 'Weatherall DJ. American Journal of Human Genetics, 2010. De Sanctis V et al. Journal of Pediatric Endocrinology and Metabolism, 2013.',
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
         <Pressable
            style={s.appointmentBtn}
            onPress={() => router.push('/(modals)/appointment')}
          >
            <View style={s.appointmentBtnLeft}>
              <Text style={s.appointmentBtnTitle}>Appointment Prep</Text>
              <Text style={s.appointmentBtnDesc}>
                Your symptom report, cycle data and doctor questions — ready to share
              </Text>
            </View>
            <ChevronRight color={colors.accentRose} size={20} strokeWidth={1.5} />
          </Pressable>

          {/* Condition Intelligence Score */}
         <ConditionIntelligence colors={colors} /> 
         <FertilityIntelligence colors={colors} />


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