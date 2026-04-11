import { AppMode } from '../constants/appMode'
import type { ConditionKey } from './conditions'

export type BootstrapStatus = 'idle' | 'loading' | 'ready' | 'error'

export type Period = {
  id: string
  startDate: string
  endDate: string | null
}

export type SymptomLog = {
  id: string
  user_id: string
  log_date: string
  mood: string | null
  flow: string | null
  cramps: string | null
  energy: string | null
  extras: string[]
  notes: string | null
}

export type Profile = {
  id: string
  name: string
  mode: AppMode
  cycle_length: number
  period_length: number
  conditions: ConditionKey[]
  age?: number | null
  height?: number | null
  weight?: number | null
  pregnancy_lmp_date?: string | null
  pregnancy_due_date?: string | null
  pregnancy_dating_method?: 'lmp' | 'edd' | null
  updated_at?: string
} | null

export type Consent = {
  user_id: string
  accepted_at: string
  age_confirmed: boolean
  health_data_consent: boolean
  privacy_policy_version: string
  terms_version: string
} | null

export type Settings = {
  user_id: string
  reminders_enabled: boolean
  daily_reminders_enabled: boolean
  analytics_opt_in: boolean
  app_language: string
  notification_ids?: unknown
} | null