import { useState, useEffect, useMemo } from 'react'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Switch,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColors } from '../../styles'
import { makeProfileStyles } from '../../styles/screens/profile'
import { useAppData } from '../../context/AppDataContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { useThemeMode } from '../../context/ThemeModeContext'
import LegalNoticeCard from '../../components/common/LegalNoticeCard'
import { type AppMode, normalizeAppMode } from '../../constants/appMode'
import { getNextPeriodDate, getFertileWindow } from '../../utils/cycleHelper'
import { enableNotificationsForUser, disableAllReminders } from '../../utils/notifications'
import {
  calculateDueDateFromLmp,
  calculateLmpFromDueDate,
} from '../../utils/pregnancyHelper'
import DateTimePicker from '@react-native-community/datetimepicker'

const CYCLE_OPTIONS = [21, 24, 28, 30, 35]
const PERIOD_OPTIONS = [3, 4, 5, 6, 7]

const LIMITS = {
  cycle: { min: 15, max: 60 },
  period: { min: 1, max: 14 },
  age: { min: 18, max: 80 },
  height: { min: 100, max: 220 },
  weight: { min: 30, max: 200 },
}

const MODES: Array<{ key: AppMode; label: string }> = [
  { key: 'cycle', label: 'Tracking my cycle' },
  { key: 'ttc', label: 'Trying to conceive' },
  { key: 'pregnant', label: 'Pregnant' },
  { key: 'postpartum', label: 'Postpartum' },
  { key: 'healing', label: 'Loss or recovery' },
  { key: 'perimenopause', label: 'Perimenopause' },
]

type PregnancyDatingMethod = 'lmp' | 'edd'

type ProfileFormState = {
  name: string
  age: string
  weight: string
  height: string
  mode: AppMode
  conditions: string[]
  cycleLength: string
  periodLength: string
  pregnancyDatingMethod: PregnancyDatingMethod
  pregnancyLmpDate: string
  pregnancyDueDate: string
}

function clampNumber(value: string, min: number, max: number) {
  const n = parseInt(value, 10)
  if (isNaN(n)) return ''
  return Math.min(Math.max(n, min), max).toString()
}

function calculateBMI(weight: string, height: string) {
  const w = parseFloat(weight)
  const h = parseFloat(height)
  if (!w || !h || h <= 0) return null
  return (w / ((h / 100) ** 2)).toFixed(1)
}

function getBMICategory(bmi: string | null) {
  const b = parseFloat(bmi ?? '')
  if (!b) return null
  if (b < 18.5) return { label: 'Underweight', color: '#6BB5D6' }
  if (b < 25) return { label: 'Normal', color: '#9BA88D' }
  if (b < 30) return { label: 'Overweight', color: '#F3C98B' }
  return { label: 'Obese', color: '#D99B9B' }
}

// Keep profile -> form mapping centralized.
function buildFormState(profile: any): ProfileFormState {
  return {
    name: profile?.name || '',
    age: profile?.age?.toString() || '',
    weight: profile?.weight?.toString() || '',
    height: profile?.height?.toString() || '',
    mode: normalizeAppMode(profile?.mode),
    conditions: profile?.conditions || [],
    cycleLength: profile?.cycle_length?.toString() || '28',
    periodLength: profile?.period_length?.toString() || '5',
    pregnancyDatingMethod: profile?.pregnancy_dating_method === 'edd' ? 'edd' : 'lmp',
    pregnancyLmpDate: profile?.pregnancy_lmp_date || '',
    pregnancyDueDate: profile?.pregnancy_due_date || '',
  }
}

function isValidDateOnly(value: string) {
  if (!/^\d{4}-\d{2}-\d{2}$/.test(value)) return false
  const date = new Date(`${value}T00:00:00`)
  return !Number.isNaN(date.getTime())
}

function isFutureDateOnly(value: string) {
  const today = new Date()
  const todayOnly = new Date(today.getFullYear(), today.getMonth(), today.getDate())
  const input = new Date(`${value}T00:00:00`)
  return input.getTime() > todayOnly.getTime()
}

function formatDisplayDate(value: string) {
  if (!value || !isValidDateOnly(value)) return ''
  const date = new Date(`${value}T00:00:00`)
  return date.toLocaleDateString(undefined, {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })
}

export default function ProfileScreen() {
  const colors = useColors()
  const s = useMemo(() => makeProfileStyles(colors), [colors])
  const { themeMode, setThemeMode } = useThemeMode()
  const isDark = themeMode === 'dark'
  const { profile, settings, periods, refetchProfile, refetchAll, clearAppData } = useAppData()
  const { signOut } = useAuth()

  const [editingName, setEditingName] = useState(false)
  const [form, setForm] = useState<ProfileFormState>(() => buildFormState(profile))
  const [saving, setSaving] = useState(false)
  const [saved, setSaved] = useState(false)
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showCustomCycle, setShowCustomCycle] = useState(false)
  const [showCustomPeriod, setShowCustomPeriod] = useState(false)
  const [showPregnancyLmpPicker, setShowPregnancyLmpPicker] = useState(false)
  const [showPregnancyDueDatePicker, setShowPregnancyDueDatePicker] = useState(false)
  const [remindersEnabled, setRemindersEnabled] = useState(settings?.reminders_enabled ?? false)
  const [savingReminders, setSavingReminders] = useState(false)

  useEffect(() => {
    const next = buildFormState(profile)
    setForm(next)
    setShowCustomCycle(
      !CYCLE_OPTIONS.includes(Number(next.cycleLength)) && next.cycleLength !== ''
    )
    setShowCustomPeriod(
      !PERIOD_OPTIONS.includes(Number(next.periodLength)) && next.periodLength !== ''
    )
  }, [profile?.id])

  useEffect(() => {
    setRemindersEnabled(settings?.reminders_enabled ?? false)
  }, [settings?.reminders_enabled])

  // Typed field updater keeps the form scalable.
  const updateField = <K extends keyof ProfileFormState>(
    field: K,
    value: ProfileFormState[K]
  ) => {
    setForm((prev) => ({ ...prev, [field]: value }))
  }

  const bmi = useMemo(() => calculateBMI(form.weight, form.height), [form.weight, form.height])
  const bmiCategory = useMemo(() => getBMICategory(bmi), [bmi])

  const validate = () => {
    const e: Record<string, string> = {}

    if (!form.name.trim()) {
      e.name = 'Name is required'
    }

    if (
      form.age &&
      (parseInt(form.age, 10) < LIMITS.age.min || parseInt(form.age, 10) > LIMITS.age.max)
    ) {
      e.age = `Age must be between ${LIMITS.age.min} and ${LIMITS.age.max}`
    }

    if (
      form.height &&
      (parseFloat(form.height) < LIMITS.height.min ||
        parseFloat(form.height) > LIMITS.height.max)
    ) {
      e.height = `Height must be between ${LIMITS.height.min} and ${LIMITS.height.max} cm`
    }

    if (
      form.weight &&
      (parseFloat(form.weight) < LIMITS.weight.min ||
        parseFloat(form.weight) > LIMITS.weight.max)
    ) {
      e.weight = `Weight must be between ${LIMITS.weight.min} and ${LIMITS.weight.max} kg`
    }

    if (
      form.cycleLength &&
      (parseInt(form.cycleLength, 10) < LIMITS.cycle.min ||
        parseInt(form.cycleLength, 10) > LIMITS.cycle.max)
    ) {
      e.cycleLength = `Cycle must be between ${LIMITS.cycle.min} and ${LIMITS.cycle.max} days`
    }

    if (
      form.periodLength &&
      (parseInt(form.periodLength, 10) < LIMITS.period.min ||
        parseInt(form.periodLength, 10) > LIMITS.period.max)
    ) {
      e.periodLength = `Period must be between ${LIMITS.period.min} and ${LIMITS.period.max} days`
    }

    // Pregnancy setup is required only when the user explicitly enters that journey.
    if (form.mode === 'pregnant') {
      if (form.pregnancyDatingMethod === 'lmp') {
        if (!form.pregnancyLmpDate) {
          e.pregnancyLmpDate = 'Please enter the first day of your last period'
        } else if (!isValidDateOnly(form.pregnancyLmpDate)) {
          e.pregnancyLmpDate = 'Please use the format YYYY-MM-DD'
        } else if (isFutureDateOnly(form.pregnancyLmpDate)) {
          e.pregnancyLmpDate = 'Last period date cannot be in the future'
        }
      }

      if (form.pregnancyDatingMethod === 'edd') {
        if (!form.pregnancyDueDate) {
          e.pregnancyDueDate = 'Please enter your estimated due date'
        } else if (!isValidDateOnly(form.pregnancyDueDate)) {
          e.pregnancyDueDate = 'Please use the format YYYY-MM-DD'
        }
      }
    }

    return e
  }

  const handlePregnancyDatingMethodChange = (value: PregnancyDatingMethod) => {
    updateField('pregnancyDatingMethod', value)
  }

  const handlePregnancyLmpDateChange = (value: string) => {
    const cleaned = value.trim()

    setForm((prev) => ({
      ...prev,
      pregnancyLmpDate: cleaned,
      pregnancyDueDate:
        cleaned && isValidDateOnly(cleaned) ? calculateDueDateFromLmp(cleaned) : '',
    }))
  }

  const handlePregnancyDueDateChange = (value: string) => {
    const cleaned = value.trim()

    setForm((prev) => ({
      ...prev,
      pregnancyDueDate: cleaned,
      pregnancyLmpDate:
        cleaned && isValidDateOnly(cleaned) ? calculateLmpFromDueDate(cleaned) : '',
    }))
  }

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) {
      setErrors(errs)
      return
    }

    setErrors({})
    setSaving(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const { error } = await supabase
        .from('profiles')
        .update({
          name: form.name.trim(),
          mode: form.mode,
          conditions: form.conditions,
          age: form.age ? parseInt(form.age, 10) : null,
          weight: form.weight ? parseFloat(form.weight) : null,
          height: form.height ? parseFloat(form.height) : null,
          cycle_length: parseInt(form.cycleLength, 10),
          period_length: parseInt(form.periodLength, 10),

          // Persist pregnancy data only when the user is in pregnancy mode.
          pregnancy_lmp_date:
            form.mode === 'pregnant' ? form.pregnancyLmpDate || null : null,
          pregnancy_due_date:
            form.mode === 'pregnant' ? form.pregnancyDueDate || null : null,
          pregnancy_dating_method:
            form.mode === 'pregnant' ? form.pregnancyDatingMethod : null,
        })
        .eq('id', user.id)

      if (error) throw error

      await refetchProfile()
      setSaved(true)
      setTimeout(() => setSaved(false), 2000)
    } catch (err: any) {
      setErrors({ save: err.message || 'Failed to save profile' })
    } finally {
      setSaving(false)
    }
  }

  const handleToggleReminders = async (value: boolean) => {
    setSavingReminders(true)

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('Not authenticated')

      const mode = normalizeAppMode(form.mode)
      const cycleLength = Number(form.cycleLength) || 28
      const nextPeriod = getNextPeriodDate(periods, cycleLength)
      const fertile = getFertileWindow(periods, cycleLength)

      if (value) {
        const enabled = await enableNotificationsForUser({
          nextPeriodDate: nextPeriod,
          fertileStart: fertile?.fertileStart ?? null,
          mode,
        })

        if (!enabled) {
          setErrors({
            save: 'Notifications were not enabled. Please allow permission on your device and try again.',
          })
          return
        }
      } else {
        await disableAllReminders()
      }

      const { error } = await supabase
        .from('user_settings')
        .upsert(
          {
            user_id: user.id,
            reminders_enabled: value,
          },
          { onConflict: 'user_id' }
        )

      if (error) throw error

      setRemindersEnabled(value)
      await refetchAll()
    } catch (err: any) {
      setErrors({ save: err.message || 'Failed to update reminders' })
    } finally {
      setSavingReminders(false)
    }
  }

  const handleLogout = async () => {
    clearAppData()
    await signOut()
  }

  const handleDeleteData = async () => {
    if (!showDeleteConfirm) {
      setShowDeleteConfirm(true)
      return
    }

    setSaving(true)

    try {
      const { error: deleteError } = await supabase.rpc('delete_user_data')
      if (deleteError) throw deleteError

      clearAppData()
      await signOut()
    } catch (err: any) {
      setErrors({ save: "Couldn't fully delete your data. Please contact support." })
    } finally {
      setSaving(false)
      setShowDeleteConfirm(false)
    }
  }

  const firstLetter = form.name.charAt(0).toUpperCase() || 'A'
  const modeLabel = MODES.find((m) => m.key === form.mode)?.label || 'Tracking my cycle'

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar summary */}
        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarLetter}>{firstLetter}</Text>
          </View>
          <Text style={s.avatarName}>{form.name}</Text>
          <Text style={s.avatarMode}>{modeLabel}</Text>
        </View>

        {/* BMI summary */}
        {bmi && (
          <View style={s.statsRow}>
            {[
              { label: 'Age', value: form.age ? `${form.age} yrs` : '—' },
              { label: 'Height', value: form.height ? `${form.height} cm` : '—' },
              { label: 'Weight', value: form.weight ? `${form.weight} kg` : '—' },
              { label: 'BMI', value: bmi, color: bmiCategory?.color },
            ].map((item) => (
              <View key={item.label} style={s.statCard}>
                <Text style={s.statLabel}>{item.label}</Text>
                <Text style={[s.statValue, item.color ? { color: item.color } : null]}>
                  {item.value}
                </Text>
              </View>
            ))}
          </View>
        )}

        {/* Name */}
        <View style={s.card}>
          <View style={s.cardRow}>
            <Text style={s.cardLabel}>Name</Text>
            <Pressable onPress={() => setEditingName(!editingName)}>
              <Text style={s.editBtn}>{editingName ? 'Cancel' : 'Edit'}</Text>
            </Pressable>
          </View>

          {editingName ? (
            <TextInput
              style={s.input}
              value={form.name}
              onChangeText={(v) => updateField('name', v)}
              placeholder="Your name"
              placeholderTextColor={colors.textMuted}
              maxLength={50}
              autoFocus
            />
          ) : (
            <Text style={s.cardValue}>{form.name}</Text>
          )}

          {errors.name ? <Text style={s.errorText}>{errors.name}</Text> : null}
        </View>

        {/* Journey mode */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Your journey</Text>
          <View style={s.modeGrid}>
            {MODES.map((m) => (
              <Pressable
                key={m.key}
                style={[s.modeBtn, form.mode === m.key && s.modeBtnSelected]}
                onPress={() => updateField('mode', m.key)}
              >
                <Text style={[s.modeBtnText, form.mode === m.key && s.modeBtnTextSelected]}>
                  {m.label}
                </Text>
              </Pressable>
            ))}
          </View>
        </View>

        {/* Pregnancy timeline setup */}
        {form.mode === 'pregnant' ? (
          <View style={s.card}>
            <Text style={s.cardLabel}>Pregnancy timeline</Text>
            <Text style={s.cardHint}>
              Use the first day of your last period or your estimated due date. This helps
              Àràbìrìn adapt your experience more thoughtfully. You can update it later.
            </Text>

            <View style={s.optionRow}>
              <Pressable
                style={[
                  s.optionBtn,
                  form.pregnancyDatingMethod === 'lmp' && s.optionSelected,
                ]}
                onPress={() => handlePregnancyDatingMethodChange('lmp')}
              >
                <Text
                  style={[
                    s.optionBtnText,
                    form.pregnancyDatingMethod === 'lmp' && s.optionSelectedText,
                  ]}
                >
                  Use last period
                </Text>
              </Pressable>

              <Pressable
                style={[
                  s.optionBtn,
                  form.pregnancyDatingMethod === 'edd' && s.optionSelected,
                ]}
                onPress={() => handlePregnancyDatingMethodChange('edd')}
              >
                <Text
                  style={[
                    s.optionBtnText,
                    form.pregnancyDatingMethod === 'edd' && s.optionSelectedText,
                  ]}
                >
                  Use due date
                </Text>
              </Pressable>
            </View>

            {form.pregnancyDatingMethod === 'lmp' ? (
              <>
                <Text style={[s.cardHint, { marginTop: 10 }]}>
                  First day of your last period
                </Text>

                <Pressable
                  style={s.input}
                  onPress={() => setShowPregnancyLmpPicker(true)}
                >
                  <Text
                    style={
                      form.pregnancyLmpDate
                        ? s.cardValue
                        : [s.cardValue, { color: colors.textMuted }]
                    }
                  >
                    {form.pregnancyLmpDate
                      ? formatDisplayDate(form.pregnancyLmpDate)
                      : 'Select a date'}
                  </Text>
                </Pressable> 
                {errors.pregnancyLmpDate ? (
                  <Text style={s.errorText}>{errors.pregnancyLmpDate}</Text>
                ) : null}

                <Text style={[s.cardHint, { marginTop: 10 }]}>Estimated due date</Text>
                <Text style={s.cardValue}>
                  {form.pregnancyDueDate || 'Will appear once a valid date is entered'}
                </Text>
              </>
            ) : (
              <>
                <Text style={[s.cardHint, { marginTop: 10 }]}>Estimated due date</Text>

                <Pressable
                  style={s.input}
                  onPress={() => setShowPregnancyDueDatePicker(true)}
                >
                  <Text
                    style={
                      form.pregnancyDueDate
                        ? s.cardValue
                        : [s.cardValue, { color: colors.textMuted }]
                    }
                  >
                    {form.pregnancyDueDate
                      ? formatDisplayDate(form.pregnancyDueDate)
                      : 'Select a date'}
                  </Text>
                </Pressable>    
                {errors.pregnancyDueDate ? (
                  <Text style={s.errorText}>{errors.pregnancyDueDate}</Text>
                ) : null}

                {form.pregnancyLmpDate ? (
                  <Text style={[s.cardHint, { marginTop: 10 }]}>
                    We’ll estimate your pregnancy timeline from around {formatDisplayDate(form.pregnancyLmpDate)}.
                  </Text>
                ) : null}
              </>
            )}
          </View>
        ) : null}

        {/* Conditions */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Conditions</Text>
          <Text style={s.cardHint}>
            Select any conditions that are relevant to your journey. This helps Àràbìrìn tailor
            insights and support more thoughtfully.
          </Text>

          <View style={s.modeGrid}>
            {[
              { key: 'fibroids', label: 'Fibroids' },
              { key: 'endo', label: 'Endometriosis' },
              { key: 'pcos', label: 'PCOS' },
              { key: 'sickle_cell', label: 'Sickle cell' },
              { key: 'thalassemia', label: 'Thalassemia' },
            ].map((condition) => {
              const active = (form.conditions ?? []).includes(condition.key)

              return (
                <Pressable
                  key={condition.key}
                  style={[s.modeBtn, active && s.modeBtnSelected]}
                  onPress={() => {
                    const current = form.conditions ?? []
                    const updated = current.includes(condition.key)
                      ? current.filter((x) => x !== condition.key)
                      : [...current, condition.key]

                    updateField('conditions', updated)
                  }}
                >
                  <Text style={[s.modeBtnText, active && s.modeBtnTextSelected]}>
                    {condition.label}
                  </Text>
                </Pressable>
              )
            })}
          </View>
        </View>

        {/* Age */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Age</Text>
          <TextInput
            style={s.input}
            value={form.age}
            onChangeText={(v) => updateField('age', v.replace(/[^0-9]/g, ''))}
            onBlur={() =>
              updateField('age', clampNumber(form.age, LIMITS.age.min, LIMITS.age.max))
            }
            placeholder="Enter your age"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
          />
          {errors.age ? <Text style={s.errorText}>{errors.age}</Text> : null}
        </View>

        {/* Height */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Height (cm)</Text>
          <TextInput
            style={s.input}
            value={form.height}
            onChangeText={(v) => updateField('height', v.replace(/[^0-9]/g, ''))}
            onBlur={() =>
              updateField(
                'height',
                clampNumber(form.height, LIMITS.height.min, LIMITS.height.max)
              )
            }
            placeholder="Enter your height in cm"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
          />
          {errors.height ? <Text style={s.errorText}>{errors.height}</Text> : null}
        </View>

        {/* Weight */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Weight (kg)</Text>
          <TextInput
            style={s.input}
            value={form.weight}
            onChangeText={(v) => updateField('weight', v.replace(/[^0-9]/g, ''))}
            onBlur={() =>
              updateField(
                'weight',
                clampNumber(form.weight, LIMITS.weight.min, LIMITS.weight.max)
              )
            }
            placeholder="Enter your weight in kg"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
          />
          {errors.weight ? <Text style={s.errorText}>{errors.weight}</Text> : null}
        </View>

        {/* Cycle length */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Cycle length</Text>
          <View style={s.optionRow}>
            {CYCLE_OPTIONS.map((n) => (
              <Pressable
                key={n}
                style={[
                  s.optionBtn,
                  Number(form.cycleLength) === n && !showCustomCycle && s.optionSelected,
                ]}
                onPress={() => {
                  updateField('cycleLength', n.toString())
                  setShowCustomCycle(false)
                }}
              >
                <Text
                  style={[
                    s.optionBtnText,
                    Number(form.cycleLength) === n &&
                      !showCustomCycle &&
                      s.optionSelectedText,
                  ]}
                >
                  {n}d
                </Text>
              </Pressable>
            ))}

            <Pressable
              style={[s.optionBtn, showCustomCycle && s.optionSelected]}
              onPress={() => {
                setShowCustomCycle(true)
                if (CYCLE_OPTIONS.includes(Number(form.cycleLength))) {
                  updateField('cycleLength', '')
                }
              }}
            >
              <Text style={[s.optionBtnText, showCustomCycle && s.optionSelectedText]}>
                Custom
              </Text>
            </Pressable>
          </View>

          {showCustomCycle ? (
            <TextInput
              style={s.input}
              value={form.cycleLength}
              onChangeText={(v) => updateField('cycleLength', v.replace(/[^0-9]/g, ''))}
              onBlur={() =>
                updateField(
                  'cycleLength',
                  clampNumber(form.cycleLength, LIMITS.cycle.min, LIMITS.cycle.max)
                )
              }
              placeholder={`${LIMITS.cycle.min}–${LIMITS.cycle.max} days`}
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
            />
          ) : null}

          {errors.cycleLength ? <Text style={s.errorText}>{errors.cycleLength}</Text> : null}
        </View>

        {/* Period length */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Period length</Text>
          <View style={s.optionRow}>
            {PERIOD_OPTIONS.map((n) => (
              <Pressable
                key={n}
                style={[
                  s.optionBtn,
                  Number(form.periodLength) === n && !showCustomPeriod && s.optionSelected,
                ]}
                onPress={() => {
                  updateField('periodLength', n.toString())
                  setShowCustomPeriod(false)
                }}
              >
                <Text
                  style={[
                    s.optionBtnText,
                    Number(form.periodLength) === n &&
                      !showCustomPeriod &&
                      s.optionSelectedText,
                  ]}
                >
                  {n}d
                </Text>
              </Pressable>
            ))}

            <Pressable
              style={[s.optionBtn, showCustomPeriod && s.optionSelected]}
              onPress={() => {
                setShowCustomPeriod(true)
                if (PERIOD_OPTIONS.includes(Number(form.periodLength))) {
                  updateField('periodLength', '')
                }
              }}
            >
              <Text style={[s.optionBtnText, showCustomPeriod && s.optionSelectedText]}>
                Custom
              </Text>
            </Pressable>
          </View>

          {showCustomPeriod ? (
            <TextInput
              style={s.input}
              value={form.periodLength}
              onChangeText={(v) => updateField('periodLength', v.replace(/[^0-9]/g, ''))}
              onBlur={() =>
                updateField(
                  'periodLength',
                  clampNumber(form.periodLength, LIMITS.period.min, LIMITS.period.max)
                )
              }
              placeholder={`${LIMITS.period.min}–${LIMITS.period.max} days`}
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
            />
          ) : null}

          {errors.periodLength ? (
            <Text style={s.errorText}>{errors.periodLength}</Text>
          ) : null}
        </View>

        {/* Save */}
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

        <Text style={s.sectionHeading}>Reminders</Text>

        <View style={s.card}>
          <View style={s.rowBetween}>
            <View style={s.appearanceTextWrap}>
              <Text style={s.cardTitle}>Gentle reminders</Text>
              <Text style={s.cardHint}>
                Receive thoughtful reminders to check in, prepare for your period, and track
                your fertile window when relevant.
              </Text>
            </View>

            <Switch
              value={remindersEnabled}
              onValueChange={handleToggleReminders}
              disabled={savingReminders}
              trackColor={{
                false: colors.borderRose,
                true: 'rgba(217,155,155,0.4)',
              }}
              thumbColor={remindersEnabled ? colors.accentRose : colors.bgPrimary}
            />
          </View>
        </View>

        <Text style={s.sectionHeading}>Appearance</Text>

        <View style={s.card}>
          <View style={s.rowBetween}>
            <View style={s.appearanceTextWrap}>
              <Text style={s.cardTitle}>Dark mode</Text>
              <Text style={s.cardHint}>Switch between light and dark appearance</Text>
            </View>

            <Switch
              value={isDark}
              onValueChange={(value) => setThemeMode(value ? 'dark' : 'light')}
              trackColor={{
                false: colors.borderRose,
                true: 'rgba(217,155,155,0.4)',
              }}
              thumbColor={isDark ? colors.accentRose : colors.bgPrimary}
            />
          </View>
        </View>

        <Text style={s.sectionHeading}>Account & data</Text>

        {/* App info */}
        <View style={s.card}>
          <Text style={s.version}>Version 1.0.0</Text>
        </View>

        <LegalNoticeCard />

        <View style={s.card}>
          <Pressable style={s.logoutBtn} onPress={handleLogout}>
            <Text style={s.logoutBtnText}>Log out</Text>
          </Pressable>

          <Pressable style={s.deleteBtn} onPress={handleDeleteData} disabled={saving}>
            <Text style={s.deleteBtnText}>
              {showDeleteConfirm ? 'Tap again to confirm' : 'Delete my data'}
            </Text>
            <Text style={s.deleteWarning}>
              This permanently deletes your profile, cycle history, symptom logs, settings,
              and consent records, then signs you out.
            </Text>
            <Text style={s.deleteSupportText}>
              Need help with your account or data? Contact support at titayanks@gmail.com
            </Text>
          </Pressable>
        </View>
              {showPregnancyLmpPicker ? (
          <DateTimePicker
            value={
              form.pregnancyLmpDate && isValidDateOnly(form.pregnancyLmpDate)
                ? new Date(`${form.pregnancyLmpDate}T00:00:00`)
                : new Date()
            }
            mode="date"
            display="default"
            maximumDate={new Date()}
            onChange={(_, selectedDate) => {
              setShowPregnancyLmpPicker(false)
              if (!selectedDate) return

              const yyyy = selectedDate.getFullYear()
              const mm = String(selectedDate.getMonth() + 1).padStart(2, '0')
              const dd = String(selectedDate.getDate()).padStart(2, '0')
              handlePregnancyLmpDateChange(`${yyyy}-${mm}-${dd}`)
            }}
          />
        ) : null}

        {showPregnancyDueDatePicker ? (
          <DateTimePicker
            value={
              form.pregnancyDueDate && isValidDateOnly(form.pregnancyDueDate)
                ? new Date(`${form.pregnancyDueDate}T00:00:00`)
                : new Date()
            }
            mode="date"
            display="default"
            onChange={(_, selectedDate) => {
              setShowPregnancyDueDatePicker(false)
              if (!selectedDate) return

              const yyyy = selectedDate.getFullYear()
              const mm = String(selectedDate.getMonth() + 1).padStart(2, '0')
              const dd = String(selectedDate.getDate()).padStart(2, '0')
              handlePregnancyDueDateChange(`${yyyy}-${mm}-${dd}`)
            }}
          />
        ) : null}  
      </ScrollView>
    </SafeAreaView>
  )
}