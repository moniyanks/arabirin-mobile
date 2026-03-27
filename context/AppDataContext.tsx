import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { supabase } from '../lib/supabase'
import { useAuth } from './AuthContext'
import { rescheduleAllReminders } from '../utils/notifications'
import { getNextPeriodDate, getFertileWindow } from '../utils/cycleHelper'
import { AppMode, normalizeAppMode } from '../constants/appMode'

type BootstrapStatus = 'idle' | 'loading' | 'ready' | 'error'

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
  conditions: string[]
  age?: number | null
  height?: number | null
  weight?: number | null
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
  analytics_opt_in: boolean
  app_language: string
} | null

type AppDataContextValue = {
  profile: Profile
  consent: Consent
  settings: Settings
  periods: Period[]
  symptomLogs: SymptomLog[]
  bootstrapStatus: BootstrapStatus
  error: string | null
  cycleLength: number
  periodLength: number
  refetchAll: () => Promise<void>
  refetchProfile: () => Promise<void>
  clearAppData: () => void
  addPeriod: (startDate: string) => Promise<void>
  endPeriod: (periodId: string) => Promise<void>
  updatePeriod: (id: string, startDate: string, endDate: string) => Promise<void>
  deletePeriod: (periodId: string) => Promise<void>
  saveSymptomLog: (data: Partial<SymptomLog> & { date: string }) => Promise<void>
}

const AppDataContext = createContext<AppDataContextValue | null>(null)

export function AppDataProvider({ children }: { children: ReactNode }) {
  const { user, status: authStatus } = useAuth()

  const [bootstrapStatus, setBootstrapStatus] = useState<BootstrapStatus>('idle')
  const [profile, setProfile] = useState<Profile>(null)
  const [consent, setConsent] = useState<Consent>(null)
  const [settings, setSettings] = useState<Settings>(null)
  const [periods, setPeriods] = useState<Period[]>([])
  const [symptomLogs, setSymptomLogs] = useState<SymptomLog[]>([])
  const [error, setError] = useState<string | null>(null)

  const resetState = useCallback(() => {
    setBootstrapStatus('idle')
    setProfile(null)
    setConsent(null)
    setSettings(null)
    setPeriods([])
    setSymptomLogs([])
    setError(null)
  }, [])

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles').select('*').eq('id', userId).maybeSingle()
    if (error) throw error
    return data ?? null
  }, [])

  const fetchConsent = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('user_consents').select('*').eq('user_id', userId).maybeSingle()
    if (error) throw error
    return data ?? null
  }, [])

  const fetchSettings = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('user_settings').select('*').eq('user_id', userId).maybeSingle()
    if (error) throw error
    return data ?? null
  }, [])

  const fetchPeriods = useCallback(async (userId: string): Promise<Period[]> => {
    const { data, error } = await supabase
      .from('periods').select('*').eq('user_id', userId)
      .order('start_date', { ascending: true })
    if (error) throw error
    return (data || []).map((p) => ({
      id: p.id,
      startDate: p.start_date,
      endDate: p.end_date,
    }))
  }, [])

  const fetchSymptomLogs = useCallback(async (userId: string): Promise<SymptomLog[]> => {
    const { data, error } = await supabase
      .from('symptom_logs').select('*').eq('user_id', userId)
      .order('log_date', { ascending: false })
    if (error) throw error
    return data || []
  }, [])

  const bootstrap = useCallback(async (userId: string) => {
    setBootstrapStatus('loading')
    setError(null)
    try {
      const [consentData, profileData, settingsData, periodsData, logsData] =
        await Promise.all([
          fetchConsent(userId),
          fetchProfile(userId),
          fetchSettings(userId),
          fetchPeriods(userId),
          fetchSymptomLogs(userId),
        ])
      setConsent(consentData)
      setProfile(profileData)
      setSettings(settingsData)
      setPeriods(periodsData)
      setSymptomLogs(logsData)
      setBootstrapStatus('ready')

      const mode       = normalizeAppMode(profileData?.mode)
      const nextPeriod = getNextPeriodDate(periodsData, profileData?.cycle_length ?? 28)
      const fertile    = getFertileWindow(periodsData, profileData?.cycle_length ?? 28)

      if (settingsData?.reminders_enabled) {
        rescheduleAllReminders(
          nextPeriod,
          fertile?.fertileStart ?? null,
          mode
        ).catch(() => {})
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to load app data')
      setBootstrapStatus('error')
    }
  }, [fetchConsent, fetchProfile, fetchSettings, fetchPeriods, fetchSymptomLogs])

  useEffect(() => {
    if (authStatus === 'loading') return
    if (authStatus === 'signed_out' || !user?.id) { resetState(); return }
    void bootstrap(user.id)
  }, [authStatus, user?.id, bootstrap, resetState])

  const cycleLength = profile?.cycle_length ?? 28
  const periodLength = profile?.period_length ?? 5

  const addPeriod = async (startDate: string) => {
    if (!user?.id) return
    const end = new Date(startDate)
    end.setDate(end.getDate() + (periodLength - 1))
    const endDate = end.toISOString().split('T')[0]
    await supabase.from('periods').insert({
      user_id: user.id, start_date: startDate, end_date: endDate,
    })
    setPeriods(await fetchPeriods(user.id))
  }

  const endPeriod = async (periodId: string) => {
    if (!user?.id) return
    await supabase.from('periods').update({
      end_date: new Date().toISOString().split('T')[0],
    }).eq('id', periodId).eq('user_id', user.id)
    setPeriods(await fetchPeriods(user.id))
  }

  const updatePeriod = async (id: string, startDate: string, endDate: string) => {
    if (!user?.id) return
    await supabase.from('periods').update({
      start_date: startDate, end_date: endDate || null,
    }).eq('id', id).eq('user_id', user.id)
    setPeriods(await fetchPeriods(user.id))
  }

  const deletePeriod = async (periodId: string) => {
    if (!user?.id) return
    await supabase.from('periods').delete()
      .eq('id', periodId).eq('user_id', user.id)
    setPeriods(await fetchPeriods(user.id))
  }

  const saveSymptomLog = async (logData: Partial<SymptomLog> & { date: string }) => {
    if (!user?.id) return
    await supabase.from('symptom_logs').upsert(
      {
        user_id: user.id, log_date: logData.date,
        mood: logData.mood ?? null, flow: logData.flow ?? null,
        cramps: logData.cramps ?? null, energy: logData.energy ?? null,
        extras: logData.extras ?? [], notes: logData.notes ?? null,
      },
      { onConflict: 'user_id,log_date' }
    )
    setSymptomLogs(await fetchSymptomLogs(user.id))
  }

  const refetchAll = useCallback(async () => {
    if (!user?.id) return
    await bootstrap(user.id)
  }, [user?.id, bootstrap])

  const refetchProfile = useCallback(async () => {
    if (!user?.id) return
    setProfile(await fetchProfile(user.id))
  }, [user?.id, fetchProfile])

  const value = useMemo(() => ({
    profile, consent, settings, periods, symptomLogs,
    bootstrapStatus, error, cycleLength, periodLength,
    refetchAll, refetchProfile, clearAppData: resetState,
    addPeriod, endPeriod, updatePeriod, deletePeriod, saveSymptomLog,
  }), [profile, consent, settings, periods, symptomLogs,
    bootstrapStatus, error, cycleLength, periodLength,
    refetchAll, refetchProfile, resetState])

  return (
    <AppDataContext.Provider value={value}>
      {children}
    </AppDataContext.Provider>
  )
}

/** Returns app data context. Must be used inside {@link AppDataProvider}. */
export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used inside AppDataProvider')
  return ctx
}
