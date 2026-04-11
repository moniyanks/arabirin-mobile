import { CONDITION_CATALOG } from '../../constants/conditions'
import type { ConditionKey } from '../../types/conditions'

export type SistersCircleKey = 'all' | 'general' | ConditionKey

export type SistersCircleContent = {
  key: SistersCircleKey
  label: string
  title: string
  description: string
  prompts: string[]
}

const GENERAL_CONTENT: SistersCircleContent = {
  key: 'general',
  label: 'Cycle Support',
  title: 'Cycle Support',
  description:
    'A gentle space for everyday cycle experiences, body changes, symptoms, and emotional support.',
  prompts: [
    'What changed in your body or mood this cycle?',
    'What symptom has been the hardest to explain to other people?',
    'What has helped you feel more supported recently?'
  ]
}

const CONDITION_CONTENT: Record<ConditionKey, SistersCircleContent> = {
  fibroids: {
    key: 'fibroids',
    label: CONDITION_CATALOG.fibroids.label,
    title: 'Fibroids Circle',
    description:
      'Support for women navigating heavy bleeding, pelvic pressure, fatigue, procedures, and everyday life with fibroids.',
    prompts: [
      'What symptom has affected your daily routine the most?',
      'What do you wish someone understood about living with fibroids?',
      'What helped you advocate for yourself at an appointment?'
    ]
  },

  endometriosis: {
    key: 'endometriosis',
    label: CONDITION_CATALOG.endometriosis.label,
    title: 'Endometriosis Circle',
    description:
      'A space for pain stories, symptom patterns, self-advocacy, and support through the uncertainty endometriosis can bring.',
    prompts: [
      'What does your pain feel like on the hardest days?',
      'What do you wish clinicians asked you sooner?',
      'What has helped you feel believed or understood?'
    ]
  },

  pcos: {
    key: 'pcos',
    label: CONDITION_CATALOG.pcos.label,
    title: 'PCOS Circle',
    description:
      'Support for irregular cycles, ovulation questions, hormone-related changes, and the emotional weight of uncertainty.',
    prompts: [
      'What part of PCOS has felt the most invisible to others?',
      'What patterns are you noticing in your cycles or symptoms?',
      'What kind of support do you wish was easier to find?'
    ]
  },

  maternal_health: {
    key: 'maternal_health',
    label: CONDITION_CATALOG.maternal_health.label,
    title: 'Maternal Health Circle',
    description:
      'A supportive space for pregnancy, postpartum changes, body recovery, and the emotional complexity of maternal health.',
    prompts: [
      'What has surprised you most about your body in this season?',
      'What kind of support has helped you feel steadier?',
      'What do you wish more people understood about maternal recovery?'
    ]
  },

  pregnancy_loss: {
    key: 'pregnancy_loss',
    label: CONDITION_CATALOG.pregnancy_loss.label,
    title: 'Pregnancy Loss Circle',
    description:
      'A gentle space for grief, reflection, body changes after loss, and support that does not rush healing.',
    prompts: [
      'What has felt hardest to put into words lately?',
      'What kind of support has felt safe and what has not?',
      'What do you wish people understood about grief and recovery?'
    ]
  },

  sickle_cell: {
    key: 'sickle_cell',
    label: CONDITION_CATALOG.sickle_cell.label,
    title: 'Sickle Cell Circle',
    description:
      'Support for women navigating cycle health alongside fatigue, pain, and the realities of sickle cell.',
    prompts: [
      'How does sickle cell affect your day-to-day energy or cycle experience?',
      'What do you wish providers understood better?',
      'What support has made your routines more manageable?'
    ]
  },

  thalassemia: {
    key: 'thalassemia',
    label: CONDITION_CATALOG.thalassemia.label,
    title: 'Thalassemia Circle',
    description:
      'A space for women balancing reproductive health, fatigue, blood-health concerns, and everyday self-advocacy.',
    prompts: [
      'What has been hardest about explaining your energy or fatigue?',
      'How do you notice your cycle affecting the rest of your body?',
      'What support or language has helped you advocate for yourself?'
    ]
  }
}

export function resolveSistersCircleContent(
  key: SistersCircleKey,
  prioritizedConditionKeys: ConditionKey[] = []
): SistersCircleContent {
  if (key === 'general') {
    return GENERAL_CONTENT
  }

  if (key !== 'all') {
    return CONDITION_CONTENT[key]
  }

  const firstRelevantCondition = prioritizedConditionKeys.find(
    (conditionKey) => CONDITION_CONTENT[conditionKey]
  )

  if (firstRelevantCondition) {
    const primary = CONDITION_CONTENT[firstRelevantCondition]

    return {
      key: 'all',
      label: 'All',
      title: 'Recommended for you',
      description:
        'Your circles are prioritized using the conditions already reflected in your profile.',
      prompts: primary.prompts
    }
  }

  return {
    key: 'all',
    label: 'All',
    title: 'Start with guided support',
    description:
      'Explore thoughtful prompts and lived experiences across cycles, symptoms, fertility, and reproductive health.',
    prompts: GENERAL_CONTENT.prompts
  }
}