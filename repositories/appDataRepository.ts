import { supabase } from '../lib/supabase'
import { AppError } from '../lib/errors/appError'
import type { Consent, Period, Profile, Settings, SymptomLog } from '../types/appData'

function throwReadError(message: string, cause: unknown): never {
  throw new AppError({
    code: 'DB_READ_FAILED',
    message,
    userMessage: 'We could not load your health data right now.',
    cause,
    retryable: true,
  })
}

function throwWriteError(message: string, cause: unknown): never {
  throw new AppError({
    code: 'DB_WRITE_FAILED',
    message,
    userMessage: 'We could not save your changes right now.',
    cause,
    retryable: true,
  })
}

export const appDataRepository = {
  async fetchProfile(userId: string): Promise<Profile> {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .maybeSingle()

    if (error) throwReadError('Failed to fetch profile.', error)
    return data ?? null
  },

  async fetchConsent(userId: string): Promise<Consent> {
    const { data, error } = await supabase
      .from('user_consents')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throwReadError('Failed to fetch user consent.', error)
    return data ?? null
  },

  async fetchSettings(userId: string): Promise<Settings> {
    const { data, error } = await supabase
      .from('user_settings')
      .select('*')
      .eq('user_id', userId)
      .maybeSingle()

    if (error) throwReadError('Failed to fetch user settings.', error)
    return data ?? null
  },

  async fetchPeriods(userId: string): Promise<Period[]> {
    const { data, error } = await supabase
      .from('periods')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: true })

    if (error) throwReadError('Failed to fetch periods.', error)

    return (data || []).map((row) => ({
      id: row.id,
      startDate: row.start_date,
      endDate: row.end_date,
    }))
  },

  async fetchSymptomLogs(userId: string): Promise<SymptomLog[]> {
    const { data, error } = await supabase
      .from('symptom_logs')
      .select('*')
      .eq('user_id', userId)
      .order('log_date', { ascending: false })

    if (error) throwReadError('Failed to fetch symptom logs.', error)
    return data || []
  },

  async insertPeriod(userId: string, startDate: string, endDate: string) {
    const { error } = await supabase.from('periods').insert({
      user_id: userId,
      start_date: startDate,
      end_date: endDate,
    })

    if (error) throwWriteError('Failed to insert period.', error)
  },

  async endPeriod(userId: string, periodId: string, endDate: string) {
    const { error } = await supabase
      .from('periods')
      .update({ end_date: endDate })
      .eq('id', periodId)
      .eq('user_id', userId)

    if (error) throwWriteError('Failed to end period.', error)
  },

  async updatePeriod(userId: string, id: string, startDate: string, endDate: string | null) {
    const { error } = await supabase
      .from('periods')
      .update({
        start_date: startDate,
        end_date: endDate,
      })
      .eq('id', id)
      .eq('user_id', userId)

    if (error) throwWriteError('Failed to update period.', error)
  },

  async deletePeriod(userId: string, periodId: string) {
    const { error } = await supabase
      .from('periods')
      .delete()
      .eq('id', periodId)
      .eq('user_id', userId)

    if (error) throwWriteError('Failed to delete period.', error)
  },

  async upsertSymptomLog(userId: string, logData: Partial<SymptomLog> & { date: string }) {
    const { error } = await supabase.from('symptom_logs').upsert(
      {
        user_id: userId,
        log_date: logData.date,
        mood: logData.mood ?? null,
        flow: logData.flow ?? null,
        cramps: logData.cramps ?? null,
        energy: logData.energy ?? null,
        extras: logData.extras ?? [],
        notes: logData.notes ?? null,
      },
      { onConflict: 'user_id,log_date' }
    )

    if (error) throwWriteError('Failed to upsert symptom log.', error)
  },
}