import { useEffect, useMemo, useRef, useState } from 'react'
import { ScrollView, Text, Pressable, ActivityIndicator } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'

import { useColors } from '../../styles'
import { makeProfileStyles } from '../../styles/screens/profile'
import { useAppData } from '../../context/AppDataContext'
import { useAuth } from '../../context/AuthContext'
import { useThemeMode } from '../../context/ThemeModeContext'
import { type AppMode } from '../../constants/appMode'

import Header from '../../components/profile/Header'
import IdentityCard from '../../components/profile/IdentityCard'
import JourneyCard from '../../components/profile/JourneyCard'
import PregnancyCard from '../../components/profile/PregnancyCard'
import ConditionsCard from '../../components/profile/ConditionsCard'
import MetricsCard from '../../components/profile/MetricsCard'
import CycleCard from '../../components/profile/CycleCard'
import RemindersCard from '../../components/profile/RemindersCard'
import AppearanceCard from '../../components/profile/AppearanceCard'
import AccountCard from '../../components/profile/AccountCard'

import {
  buildFormState,
  saveProfile,
  deleteUserData,
  type ProfileFormState,
  type PregnancyDatingMethod,
} from '../../services/profile'
import {
  calculateBMI,
  getBMICategory,
  validateProfileForm,
} from '../../utils/profileValidation'
import { notificationPreferencesService } from '../../services/notificationPreferencesService'

const MODES: Array<{ key: AppMode; label: string }> = [
  { key: 'cycle', label: 'Tracking my cycle' },
  { key: 'ttc', label: 'Trying to conceive' },
  { key: 'pregnant', label: 'Pregnant' },
  { key: 'postpartum', label: 'Postpartum' },
  { key: 'healing', label: 'Loss or recovery' },
  { key: 'perimenopause', label: 'Perimenopause' },
]

function normalizeNotificationIds(value: unknown): string[] {
  if (!Array.isArray(value)) {
    return []
  }

  return value.filter(
    (item): item is string => typeof item === 'string' && item.trim().length > 0
  )
}

function getProfileSyncKey(profile: {
  id?: string | null
  updated_at?: string | null
  mode?: string | null
  name?: string | null
} | null): string {
  if (!profile) return 'profile:null'

  return [
    profile.id ?? 'no-id',
    profile.updated_at ?? 'no-updated-at',
    profile.mode ?? 'no-mode',
    profile.name ?? 'no-name',
  ].join('|')
}

export default function ProfileScreen() {
  const colors = useColors()
  const s = useMemo(() => makeProfileStyles(colors), [colors])
  const { themeMode, setThemeMode } = useThemeMode()
  const isDark = themeMode === 'dark'
  const router = useRouter()

  const { profile, settings, refetchProfile, refetchAll, clearAppData } = useAppData()
  const { signOut } = useAuth()

  const [editingName, setEditingName] = useState(false)
  const [form, setForm] = useState<ProfileFormState>(() => buildFormState(profile))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [remindersEnabled, setRemindersEnabled] = useState(settings?.reminders_enabled ?? false)
  const [savingReminders, setSavingReminders] = useState(false)

  const lastProfileSyncKeyRef = useRef<string>('')

  useEffect(() => {
    const nextKey = getProfileSyncKey(profile)

    if (nextKey === lastProfileSyncKeyRef.current) {
      return
    }

    setForm(buildFormState(profile))
    lastProfileSyncKeyRef.current = nextKey
  }, [profile])

  useEffect(() => {
    setRemindersEnabled(settings?.reminders_enabled ?? false)
  }, [settings?.reminders_enabled])

  const updateField = <K extends keyof ProfileFormState>(
    field: K,
    value: ProfileFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const bmi = useMemo(() => calculateBMI(form.weight, form.height), [form.weight, form.height])
  const bmiCategory = useMemo(() => getBMICategory(bmi), [bmi])

  const modeLabel =
    MODES.find((m) => m.key === form.mode)?.label || 'Tracking my cycle'

  const existingNotificationIds = useMemo(
    () => normalizeNotificationIds(settings?.notification_ids),
    [settings?.notification_ids]
  )

  const handleSave = async () => {
    const nextErrors = validateProfileForm(form)

    if (Object.keys(nextErrors).length > 0) {
      setErrors(nextErrors)
      return
    }

    setErrors({})
    setSaving(true)

    try {
      await saveProfile(form)
      await refetchProfile()

      lastProfileSyncKeyRef.current = ''

      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err: any) {
      setErrors({ save: err?.message || 'Failed to save profile' })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleReminders = async (value: boolean) => {
    try {
      setSavingReminders(true)
      setErrors({})
      setRemindersEnabled(value)

      await notificationPreferencesService.updateReminderPreferences({
        remindersEnabled: value,
        reminderTime: value ? '08:00' : null,
        reminderPhaseTypes: [],
        existingNotificationIds,
      })

      await refetchAll()
    } catch (err: any) {
      setRemindersEnabled(!value)
      setErrors({
        save: err?.message || 'Failed to update reminders',
      })
    } finally {
      setSavingReminders(false)
    }
  }

  const handleLogout = async () => {
    try {
      setErrors({})
      clearAppData()
      await signOut()
      router.replace('/(public)/auth')
    } catch (err: any) {
      setErrors({
        save: err?.message || 'We could not log you out right now.',
      })
    }
  }

  const handleDeleteData = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    setSaving(true)

    try {
      await deleteUserData()
      clearAppData()
      await signOut()
      router.replace('/(public)/auth')
    } catch {
      setErrors({ save: "Couldn't fully delete your data. Please contact support." })
    } finally {
      setSaving(false)
      setShowDeleteConfirm(false)
    }
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <Header
          s={s}
          name={form.name}
          modeLabel={modeLabel}
          age={form.age}
          height={form.height}
          weight={form.weight}
          bmi={bmi}
          bmiColor={bmiCategory?.color}
        />

        <IdentityCard
          s={s}
          colors={colors}
          editingName={editingName}
          setEditingName={setEditingName}
          name={form.name}
          setName={(value: string) => updateField('name', value)}
          error={errors.name}
        />

        <JourneyCard
          s={s}
          mode={form.mode}
          setMode={(value: AppMode) => updateField('mode', value)}
        />

        {form.mode === 'pregnant' ? (
          <PregnancyCard
            s={s}
            colors={colors}
            pregnancyDatingMethod={form.pregnancyDatingMethod as PregnancyDatingMethod}
            pregnancyLmpDate={form.pregnancyLmpDate}
            pregnancyDueDate={form.pregnancyDueDate}
            setPregnancyDatingMethod={(value: PregnancyDatingMethod) =>
              updateField('pregnancyDatingMethod', value)
            }
            setPregnancyLmpDate={(value: string) => updateField('pregnancyLmpDate', value)}
            setPregnancyDueDate={(value: string) => updateField('pregnancyDueDate', value)}
            errors={errors}
          />
        ) : null}

        <ConditionsCard
          s={s}
          conditions={form.conditions}
          setConditions={(value: string[]) => updateField('conditions', value)}
        />

        <MetricsCard
          s={s}
          colors={colors}
          age={form.age}
          height={form.height}
          weight={form.weight}
          setAge={(value: string) => updateField('age', value)}
          setHeight={(value: string) => updateField('height', value)}
          setWeight={(value: string) => updateField('weight', value)}
          errors={errors}
        />

        <CycleCard
          s={s}
          colors={colors}
          cycleLength={form.cycleLength}
          periodLength={form.periodLength}
          setCycleLength={(value: string) => updateField('cycleLength', value)}
          setPeriodLength={(value: string) => updateField('periodLength', value)}
          errors={errors}
        />

        {errors.save ? <Text style={s.saveError}>{errors.save}</Text> : null}

        <Pressable
          style={[s.saveBtn, saved && s.saveBtnSaved, saving && s.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving ? (
            <ActivityIndicator color={colors.bgPrimary} />
          ) : (
            <Text style={s.saveBtnText}>{saved ? 'Saved ✓' : 'Save changes'}</Text>
          )}
        </Pressable>

        <RemindersCard
          s={s}
          colors={colors}
          remindersEnabled={remindersEnabled}
          savingReminders={savingReminders}
          onToggle={handleToggleReminders}
        />

        <AppearanceCard
          s={s}
          colors={colors}
          isDark={isDark}
          onToggle={(value: boolean) => setThemeMode(value ? 'dark' : 'light')}
        />

        <AccountCard
          s={s}
          saving={saving}
          showDeleteConfirm={showDeleteConfirm}
          onLogout={handleLogout}
          onDeleteData={handleDeleteData}
        />
      </ScrollView>
    </SafeAreaView>
  )
}