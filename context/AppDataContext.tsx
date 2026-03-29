import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from 'react'
import { appDataRepository } from '../repositories/appDataRepository'
import type {
  BootstrapStatus,
  Period,
  SymptomLog,
  Profile,
  Consent,
  Settings,
} from '../types/appData'
import { useAuth } from './AuthContext'
import { rescheduleAllReminders } from '../utils/notifications'
import { getNextPeriodDate, getFertileWindow } from '../utils/cycleHelper'
import { normalizeAppMode } from '../constants/appMode'

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

  const bootstrap = useCallback(async (userId: string) => {
    setBootstrapStatus('loading')
    setError(null)

    try {
      const [consentData, profileData, settingsData, periodsData, logsData] =
        await Promise.all([
          appDataRepository.fetchConsent(userId),
          appDataRepository.fetchProfile(userId),
          appDataRepository.fetchSettings(userId),
          appDataRepository.fetchPeriods(userId),
          appDataRepository.fetchSymptomLogs(userId),
        ])

      setConsent(consentData)
      setProfile(profileData)
      setSettings(settingsData)
      setPeriods(periodsData)
      setSymptomLogs(logsData)
      setBootstrapStatus('ready')

      const mode = normalizeAppMode(profileData?.mode)
      const nextPeriod = getNextPeriodDate(periodsData, profileData?.cycle_length ?? 28)
      const fertile = getFertileWindow(periodsData, profileData?.cycle_length ?? 28)

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
  }, [])

  useEffect(() => {
    if (authStatus === 'loading') return

    if (authStatus === 'signed_out' || !user?.id) {
      resetState()
      return
    }

    void bootstrap(user.id)
  }, [authStatus, user?.id, bootstrap, resetState])

  const cycleLength = profile?.cycle_length ?? 28
  const periodLength = profile?.period_length ?? 5

  const addPeriod = async (startDate: string) => {
    if (!user?.id) return

    const end = new Date(startDate)
    end.setDate(end.getDate() + (periodLength - 1))
    const endDate = end.toISOString().split('T')[0]

    await appDataRepository.insertPeriod(user.id, startDate, endDate)
    setPeriods(await appDataRepository.fetchPeriods(user.id))
  }

  const endPeriod = async (periodId: string) => {
    if (!user?.id) return

    await appDataRepository.endPeriod(
      user.id,
      periodId,
      new Date().toISOString().split('T')[0]
    )

    setPeriods(await appDataRepository.fetchPeriods(user.id))
  }

  const updatePeriod = async (id: string, startDate: string, endDate: string) => {
    if (!user?.id) return

    await appDataRepository.updatePeriod(user.id, id, startDate, endDate || null)
    setPeriods(await appDataRepository.fetchPeriods(user.id))
  }

  const deletePeriod = async (periodId: string) => {
    if (!user?.id) return

    await appDataRepository.deletePeriod(user.id, periodId)
    setPeriods(await appDataRepository.fetchPeriods(user.id))
  }

  const saveSymptomLog = async (logData: Partial<SymptomLog> & { date: string }) => {
    if (!user?.id) return

    await appDataRepository.upsertSymptomLog(user.id, logData)
    setSymptomLogs(await appDataRepository.fetchSymptomLogs(user.id))
  }

  const refetchAll = useCallback(async () => {
    if (!user?.id) return
    await bootstrap(user.id)
  }, [user?.id, bootstrap])

  const refetchProfile = useCallback(async () => {
    if (!user?.id) return
    setProfile(await appDataRepository.fetchProfile(user.id))
  }, [user?.id])

  const value = useMemo(
    () => ({
      profile,
      consent,
      settings,
      periods,
      symptomLogs,
      bootstrapStatus,
      error,
      cycleLength,
      periodLength,
      refetchAll,
      refetchProfile,
      clearAppData: resetState,
      addPeriod,
      endPeriod,
      updatePeriod,
      deletePeriod,
      saveSymptomLog,
    }),
    [
      profile,
      consent,
      settings,
      periods,
      symptomLogs,
      bootstrapStatus,
      error,
      cycleLength,
      periodLength,
      refetchAll,
      refetchProfile,
      resetState,
    ]
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

/** Returns app data context. Must be used inside {@link AppDataProvider}. */
export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used inside AppDataProvider')
  return ctx
}