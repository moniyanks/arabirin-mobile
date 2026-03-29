import type { calculateConditionScore } from '../conditionIntelligence'

export type SupportedMode =
  | 'cycle'
  | 'ttc'
  | 'pregnant'
  | 'postpartum'
  | 'healing'
  | 'perimenopause'

export type QuestionSourceKey =
  | 'fibroids'
  | 'endo'
  | 'pcos'
  | 'thalassemia'
  | 'cycle'
  | 'ttc'

export type ReportMetricValue = string | number | null | undefined

export type ReportConditionScore = ReturnType<typeof calculateConditionScore>

export type TopSymptom = {
  key: string
  label: string
  count: number
}

export type MoodSummaryItem = {
  mood: string
  count: number
}

export type ConditionCard = {
  name: string
  scoreLabel: string
  signals: Array<{ label: string; met: boolean }>
  enoughData: boolean
  logsAnalysed: number
}

export type ReportViewModel = {
  generatedDate: string
  preparedFor: string
  modeLabel: string
  trackedConditionsLabel: string | null
  symptomEntryCount: number
  periodsLoggedCount: number
  cycleSummary: {
    avgCycleLength: string
    avgPeriodLength: string
    cycleRange: string | null
    lastPeriodStarted: string | null
    nextPeriodPredicted: string | null
    fertileWindow: string | null
    predictionConfidence: 'High' | 'Good' | 'Building'
    recentPeriodStarts: string[]
  }
  flowSummary: {
    heavyFlow: number
    mediumFlow: number
    lightFlow: number
    hasAnyFlow: boolean
  }
  topSymptoms: TopSymptom[]
  moodSummary: MoodSummaryItem[]
  conditionCards: ConditionCard[]
  questions: string[]
}

export type GenerateAppointmentPdfResult =
  | { success: true; uri: string; shared: boolean }
  | { success: false; error: string }