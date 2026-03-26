import type { PhaseKey } from './cycleHelper'
import { normalizeConditionKeys } from './conditions'

export function getModeContext(mode?: string) {
  switch (mode) {
    case 'pregnant':
      return 'Pregnancy journey'
    case 'postpartum':
      return 'Postpartum recovery'
    case 'healing':
      return 'Loss or recovery'
    case 'perimenopause':
      return 'Perimenopause support'
    case 'ttc':
      return 'Trying to conceive'
    case 'cycle':
    default:
      return 'Cycle awareness'
  }
}

export function getPhaseLabel(phase: PhaseKey) {
  switch (phase) {
    case 'period':
      return 'MENSTRUAL'
    case 'follicular':
      return 'FOLLICULAR'
    case 'fertile':
      return 'FERTILE'
    case 'ovulation':
      return 'OVULATION'
    case 'luteal':
      return 'LUTEAL'
    default:
      return 'CYCLE'
  }
}

export function getRingInnerLabel(phase: PhaseKey) {
  switch (phase) {
    case 'period':
      return 'Menstrual'
    case 'follicular':
      return 'Low Flow'
    case 'fertile':
      return 'Fertile'
    case 'ovulation':
      return 'Peak Day'
    case 'luteal':
      return 'Wind Down'
    default:
      return 'Cycle'
  }
}

export function getPhaseSupportMessage(phase: PhaseKey) {
  switch (phase) {
    case 'period':
      return 'Rest and be gentle with yourself. Your body is releasing.'
    case 'follicular':
      return 'Energy levels may be rising. A good time to begin gently.'
    case 'fertile':
      return 'You may feel more open, social, or energised right now.'
    case 'ovulation':
      return 'This can be a high-energy point in your cycle. Notice how you feel.'
    case 'luteal':
      return 'Turn inward. Slow down where you can and nourish yourself.'
    default:
      return 'We’re learning your rhythm.'
  }
}

export function getPredictionConfidence(periodsCount: number) {
  if (periodsCount === 0) return null
  if (periodsCount >= 5) {
    return { label: 'High confidence', tone: 'high' as const }
  }
  if (periodsCount >= 3) {
    return { label: 'Good confidence', tone: 'medium' as const }
  }
  return { label: 'Building accuracy', tone: 'low' as const }
}

export function getBodyIntelligenceMessage(params: {
  mode?: string
  phase: PhaseKey
  symptomLogs: Array<{
    mood?: string | null
    flow?: string | null
    cramps?: string | null
    energy?: string | null
  }>
  periodsCount: number
}) {
  const { mode, phase, symptomLogs, periodsCount } = params

  if (mode === 'pregnant') {
    return {
      title: 'Body Intelligence',
      message:
        'Your body is doing deep, steady work. Use today’s check-ins to notice energy, mood, and anything that feels different.',
    }
  }

  if (mode === 'postpartum') {
    return {
      title: 'Body Intelligence',
      message:
        'Recovery is rarely linear. Tracking bleeding, energy, and mood can help you notice what support you need.',
    }
  }

  if (mode === 'healing') {
    return {
      title: 'Body Intelligence',
      message:
        'Your body may need gentleness right now. Logging how you feel can help you recognise patterns without pressure.',
    }
  }

  if (mode === 'perimenopause') {
    return {
      title: 'Body Intelligence',
      message:
        'Cycle shifts can feel unpredictable during this transition. Tracking changes over time can make them easier to understand.',
    }
  }

  if (mode === 'ttc') {
    return {
      title: 'Body Intelligence',
      message:
        'Small patterns matter. Consistent logging can make your fertile window and symptom rhythm easier to notice over time.',
    }
  }

  if (symptomLogs.length === 0 || periodsCount < 2) {
    return {
      title: 'Body Intelligence',
      message:
        'We’re still learning your body patterns. Log a few more cycles and symptoms to unlock deeper insights.',
    }
  }

  if (phase === 'period') {
    return {
      title: 'Body Intelligence',
      message:
        'During your period, symptoms like cramps, flow changes, mood shifts, and low energy can be especially useful to track.',
    }
  }

  if (phase === 'fertile' || phase === 'ovulation') {
    return {
      title: 'Body Intelligence',
      message:
        'This part of your cycle can bring noticeable changes in energy, mood, and body signals. Today is a good day to check in.',
    }
  }

  return {
    title: 'Body Intelligence',
    message:
      'Your recent logs are starting to form a clearer picture. The more consistently you track, the more helpful your insights become.',
  }
}

export function getEnhancedBodyInsight({
  mode,
  phase,
  cycleDay,
  nextPeriodDisplay,
  conditions = [],
}: {
  mode: string
  phase: string
  cycleDay: number | null
  nextPeriodDisplay: string
  conditions?: string[]
}) {
 const normalizedConditions = normalizeConditionKeys(conditions)

  const hasFibroids = normalizedConditions.includes('fibroids')
  const hasPCOS = normalizedConditions.includes('pcos')
  const hasSickleCell = normalizedConditions.includes('sickle_cell')
  const hasThalassemia = normalizedConditions.includes('thalassemia')

  if (mode !== 'cycle') {
    return {
      title: 'Your body is speaking',
      message:
        'Keep logging to uncover patterns in your energy, symptoms, and overall rhythm.',
    }
  }

  if (hasFibroids && phase === 'period') {
    return {
      title: 'This phase may need closer attention',
      message:
        'If your bleeding, pain, or fatigue feels heavier than usual, it may be helpful to keep a close record this cycle.',
    }
  }

  if (hasPCOS) {
    return {
      title: 'Your rhythm may not always feel predictable',
      message:
        'Keep tracking changes in timing, mood, energy, and body signals so patterns become easier to recognise over time.',
    }
  }

  if ((hasSickleCell || hasThalassemia) && phase === 'period') {
    return {
      title: 'This phase may call for gentler pacing',
      message:
        'Pay attention to energy, pain, and how your body feels through bleeding days so your patterns are easier to understand over time.',
    }
  }

  if (phase === 'period') {
    return {
      title: 'Your body may need more softness right now',
      message: cycleDay
        ? `You’re in day ${cycleDay} of your cycle. This is a good time to notice bleeding, pain, energy, and rest needs.`
        : 'This is a good time to notice bleeding, pain, energy, and rest needs.',
    }
  }

  if (phase === 'follicular') {
    return {
      title: 'Your body may be rebuilding energy',
      message: cycleDay
        ? `Cycle day ${cycleDay} can bring a sense of renewal, steadier energy, and more openness to routine.`
        : 'This phase can bring a sense of renewal, steadier energy, and more openness to routine.',
    }
  }

  if (phase === 'fertile') {
    return {
      title: 'Your body may feel more responsive right now',
      message:
        'This window can bring shifts in energy, mood, body awareness, and cervical changes worth noticing.',
    }
  }

  if (phase === 'ovulation') {
    return {
      title: 'Your body may be at a peak moment in the cycle',
      message:
        'You may notice stronger body signals right now. This is a good time to pay attention to how you feel physically and emotionally.',
    }
  }

  if (phase === 'luteal') {
    return {
      title: 'Your body may be asking for more care',
      message:
        nextPeriodDisplay !== '—'
          ? `As your next period approaches around ${nextPeriodDisplay}, you may notice changes in mood, appetite, energy, or tenderness.`
          : 'As your next period approaches, you may notice changes in mood, appetite, energy, or tenderness.',
    }
  }

  return {
    title: 'Your body is showing a pattern',
    message: 'Keep logging to better understand what is shifting across your cycle.',
  }
}