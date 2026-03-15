import type { PhaseKey } from './cycleHelper'

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
      return 'Period'
    case 'follicular':
      return 'Follicular'
    case 'fertile':
      return 'Fertile'
    case 'ovulation':
      return 'Ovulation'
    case 'luteal':
      return 'Luteal'
    default:
      return 'Journey'
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