import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode
} from 'react'
import { appDataRepository } from '../repositories/appDataRepository'
import type {
  BootstrapStatus,
  Period,
  SymptomLog,
  Profile,
  Consent,
  Settings
} from '../types/appData'
import { useAuth } from './AuthContext'
import { rescheduleAllReminders } from '../utils/notifications'
import { getNextPeriodDate, getFertileWindow } from '../utils/cycleHelper'
import { normalizeAppMode } from '../constants/appMode'
import { addDaysDateOnly, todayDateOnly } from '../lib/dates/dateOnly'
import { toAppError } from '../lib/errors/appError'

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

  const syncRemindersForPeriods = useCallback(
    async (
      userId: string,
      nextPeriods: Period[],
      nextProfile?: Profile | null,
      nextSettings?: Settings | null
    ) => {
      const activeProfile = nextProfile ?? profile
      const activeSettings = nextSettings ?? settings

      if (!activeSettings?.reminders_enabled) return

      const mode = normalizeAppMode(activeProfile?.mode)
      const nextPeriod = getNextPeriodDate(nextPeriods, activeProfile?.cycle_length ?? 28)
      const fertile = getFertileWindow(nextPeriods, activeProfile?.cycle_length ?? 28)

      await rescheduleAllReminders(
        userId,
        nextPeriod,
        fertile?.fertileStart ?? null,
        mode,
        activeSettings?.daily_reminders_enabled ?? false
      )
    },
    [profile, settings]
  )

  const bootstrap = useCallback(
    async (userId: string) => {
      setBootstrapStatus('loading')
      setError(null)

      try {
        const [consentData, profileData, settingsData, periodsData, logsData] = await Promise.all([
          appDataRepository.fetchConsent(userId),
          appDataRepository.fetchProfile(userId),
          appDataRepository.fetchSettings(userId),
          appDataRepository.fetchPeriods(userId),
          appDataRepository.fetchSymptomLogs(userId)
        ])

        setConsent(consentData)
        setProfile(profileData)
        setSettings(settingsData)
        setPeriods(periodsData)
        setSymptomLogs(logsData)
        setBootstrapStatus('ready')

        if (settingsData?.reminders_enabled) {
          syncRemindersForPeriods(userId, periodsData, profileData, settingsData).catch((err) => {
            console.warn('Reminder reschedule failed during bootstrap.', err)
          })
        }
      } catch (err) {
        const appError = toAppError(err, {
          code: 'DB_READ_FAILED',
          userMessage: 'We could not load your health data right now.',
          retryable: true
        })

        setError(appError.userMessage)
        setBootstrapStatus('error')
      }
    },
    [syncRemindersForPeriods]
  )

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

    try {
      const endDate = addDaysDateOnly(startDate, periodLength - 1)
      await appDataRepository.insertPeriod(user.id, startDate, endDate)

      const updatedPeriods = await appDataRepository.fetchPeriods(user.id)
      setPeriods(updatedPeriods)

      await syncRemindersForPeriods(user.id, updatedPeriods)
    } catch (err) {
      const appError = toAppError(err, {
        code: 'DB_WRITE_FAILED',
        userMessage: 'We could not save your period right now.',
        retryable: true
      })
      setError(appError.userMessage)
      throw appError
    }
  }

  const endPeriod = async (periodId: string) => {
    if (!user?.id) return

    try {
      await appDataRepository.endPeriod(user.id, periodId, todayDateOnly())

      const updatedPeriods = await appDataRepository.fetchPeriods(user.id)
      setPeriods(updatedPeriods)

      await syncRemindersForPeriods(user.id, updatedPeriods)
    } catch (err) {
      const appError = toAppError(err, {
        code: 'DB_WRITE_FAILED',
        userMessage: 'We could not update your period right now.',
        retryable: true
      })
      setError(appError.userMessage)
      throw appError
    }
  }

  const updatePeriod = async (id: string, startDate: string, endDate: string) => {
    if (!user?.id) return

    try {
      await appDataRepository.updatePeriod(user.id, id, startDate, endDate || null)

      const updatedPeriods = await appDataRepository.fetchPeriods(user.id)
      setPeriods(updatedPeriods)

      await syncRemindersForPeriods(user.id, updatedPeriods)
    } catch (err) {
      const appError = toAppError(err, {
        code: 'DB_WRITE_FAILED',
        userMessage: 'We could not save your period changes right now.',
        retryable: true
      })
      setError(appError.userMessage)
      throw appError
    }
  }

  const deletePeriod = async (periodId: string) => {
    if (!user?.id) return

    try {
      await appDataRepository.deletePeriod(user.id, periodId)

      const updatedPeriods = await appDataRepository.fetchPeriods(user.id)
      setPeriods(updatedPeriods)

      await syncRemindersForPeriods(user.id, updatedPeriods)
    } catch (err) {
      const appError = toAppError(err, {
        code: 'DB_WRITE_FAILED',
        userMessage: 'We could not delete that period right now.',
        retryable: true
      })
      setError(appError.userMessage)
      throw appError
    }
  }

  const saveSymptomLog = async (logData: Partial<SymptomLog> & { date: string }) => {
    if (!user?.id) return

    try {
      await appDataRepository.upsertSymptomLog(user.id, logData)
      setSymptomLogs(await appDataRepository.fetchSymptomLogs(user.id))
    } catch (err) {
      const appError = toAppError(err, {
        code: 'DB_WRITE_FAILED',
        userMessage: 'We could not save your symptom log right now.',
        retryable: true
      })
      setError(appError.userMessage)
      throw appError
    }
  }

  const refetchAll = useCallback(async () => {
    if (!user?.id) return
    await bootstrap(user.id)
  }, [user?.id, bootstrap])

  const refetchProfile = useCallback(async () => {
    if (!user?.id) return

    try {
      setProfile(await appDataRepository.fetchProfile(user.id))
    } catch (err) {
      const appError = toAppError(err, {
        code: 'DB_READ_FAILED',
        userMessage: 'We could not refresh your profile right now.',
        retryable: true
      })
      setError(appError.userMessage)
    }
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
      saveSymptomLog
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
      resetState
    ]
  )

  return <AppDataContext.Provider value={value}>{children}</AppDataContext.Provider>
}

export function useAppData() {
  const ctx = useContext(AppDataContext)
  if (!ctx) throw new Error('useAppData must be used inside AppDataProvider')
  return ctx
}
