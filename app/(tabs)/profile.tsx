import { useState, useEffect, useMemo } from 'react'
import {
  View, Text, TextInput, Pressable,
  ScrollView, ActivityIndicator, Switch,
} from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useColors } from '../../styles'
import { makeProfileStyles } from '../../styles/screens/profile'
import { useAppData } from '../../context/AppDataContext'
import { useAuth } from '../../context/AuthContext'
import { supabase } from '../../lib/supabase'
import { theme, type ThemeColors } from '../../constants/theme'
import { useThemeMode} from '../../context/ThemeModeContext'
import LegalNoticeCard from '../../components/common/LegalNoticeCard'

const CYCLE_OPTIONS = [21, 24, 28, 30, 35]
const PERIOD_OPTIONS = [3, 4, 5, 6, 7]

const LIMITS = {
  cycle:  { min: 15, max: 60 },
  period: { min: 1,  max: 14 },
  age:    { min: 18, max: 80 },
  height: { min: 100, max: 220 },
  weight: { min: 30,  max: 200 },
}

const MODES = [
  { key: 'cycle',        label: 'Tracking my cycle' },
  { key: 'ttc',          label: 'Trying to conceive' },
  { key: 'pregnant',     label: 'Pregnant' },
  { key: 'postpartum',   label: 'Postpartum' },
  { key: 'healing',      label: 'Loss or recovery' },
  { key: 'perimenopause', label: 'Perimenopause' },
]

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
  if (b < 25)   return { label: 'Normal',      color: '#9BA88D' }
  if (b < 30)   return { label: 'Overweight',  color: '#F3C98B' }
  return              { label: 'Obese',        color: '#D99B9B' }
}

function buildFormState(profile: any) {
  return {
    name:         profile?.name         || '',
    age:          profile?.age?.toString()          || '',
    weight:       profile?.weight?.toString()       || '',
    height:       profile?.height?.toString()       || '',
    mode:         profile?.mode         || 'cycle',
    conditions:   profile?.conditions   || [] as string[],
    cycleLength:  profile?.cycle_length?.toString() || '28',
    periodLength: profile?.period_length?.toString()|| '5',
  }
}

export default function ProfileScreen() {
  const colors    = useColors()
  const s         = useMemo(() => makeProfileStyles(colors), [colors])
  const { themeMode, setThemeMode } = useThemeMode()
  const isDark = themeMode === 'dark'
  const { profile, refetchProfile, clearAppData } = useAppData()
  const { signOut } = useAuth()

  const [editingName, setEditingName] = useState(false)
  const [form, setForm] = useState(() => buildFormState(profile))
  const [saving, setSaving]                   = useState(false)
  const [saved, setSaved]                     = useState(false)
  const [errors, setErrors]                   = useState<Record<string, string>>({})
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false)
  const [showCustomCycle, setShowCustomCycle]     = useState(false)
  const [showCustomPeriod, setShowCustomPeriod]   = useState(false)

  useEffect(() => {
    const next = buildFormState(profile)
    setForm(next)
    setShowCustomCycle(!CYCLE_OPTIONS.includes(Number(next.cycleLength)) && next.cycleLength !== '')
    setShowCustomPeriod(!PERIOD_OPTIONS.includes(Number(next.periodLength)) && next.periodLength !== '')
  }, [profile?.id])

  const updateField = (field: string, value: string) =>
    setForm((prev) => ({ ...prev, [field]: value }))

  const bmi         = useMemo(() => calculateBMI(form.weight, form.height), [form.weight, form.height])
  const bmiCategory = useMemo(() => getBMICategory(bmi), [bmi])

  const validate = () => {
    const e: Record<string, string> = {}
    if (!form.name.trim()) e.name = 'Name is required'
    if (form.age && (parseInt(form.age) < LIMITS.age.min || parseInt(form.age) > LIMITS.age.max))
      e.age = `Age must be between ${LIMITS.age.min} and ${LIMITS.age.max}`
    if (form.height && (parseFloat(form.height) < LIMITS.height.min || parseFloat(form.height) > LIMITS.height.max))
      e.height = `Height must be between ${LIMITS.height.min} and ${LIMITS.height.max} cm`
    if (form.weight && (parseFloat(form.weight) < LIMITS.weight.min || parseFloat(form.weight) > LIMITS.weight.max))
      e.weight = `Weight must be between ${LIMITS.weight.min} and ${LIMITS.weight.max} kg`
    if (form.cycleLength && (parseInt(form.cycleLength) < LIMITS.cycle.min || parseInt(form.cycleLength) > LIMITS.cycle.max))
      e.cycleLength = `Cycle must be between ${LIMITS.cycle.min} and ${LIMITS.cycle.max} days`
    if (form.periodLength && (parseInt(form.periodLength) < LIMITS.period.min || parseInt(form.periodLength) > LIMITS.period.max))
      e.periodLength = `Period must be between ${LIMITS.period.min} and ${LIMITS.period.max} days`
    return e
  }

  const handleSave = async () => {
    const errs = validate()
    if (Object.keys(errs).length > 0) { setErrors(errs); return }
    setErrors({})
    setSaving(true)
    try {
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('Not authenticated')
      const { error } = await supabase.from('profiles').update({
        name:          form.name.trim(),
        mode:          form.mode,
        conditions:    form.conditions,
        age:           form.age    ? parseInt(form.age)    : null,
        weight:        form.weight ? parseFloat(form.weight) : null,
        height:        form.height ? parseFloat(form.height) : null,
        cycle_length:  parseInt(form.cycleLength),
        period_length: parseInt(form.periodLength),
      }).eq('id', user.id)
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

  const handleLogout = async () => {
    clearAppData()
    await signOut()
  }

  const handleDeleteData = async () => {
    if (!showDeleteConfirm) { setShowDeleteConfirm(true); return }
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
  const modeLabel   = MODES.find((m) => m.key === form.mode)?.label || 'Tracking my cycle'

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        {/* Avatar */}
        <View style={s.avatarSection}>
          <View style={s.avatar}>
            <Text style={s.avatarLetter}>{firstLetter}</Text>
          </View>
          <Text style={s.avatarName}>{form.name}</Text>
          <Text style={s.avatarMode}>{modeLabel}</Text>
        </View>

        {/* BMI stats */}
        {bmi && (
          <View style={s.statsRow}>
            {[
              { label: 'Age',    value: form.age    ? `${form.age} yrs`  : '—' },
              { label: 'Height', value: form.height ? `${form.height} cm` : '—' },
              { label: 'Weight', value: form.weight ? `${form.weight} kg` : '—' },
              { label: 'BMI',    value: bmi, color: bmiCategory?.color },
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
          {errors.name && <Text style={s.errorText}>{errors.name}</Text>}
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

        {/* Conditions */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Conditions</Text>
          <Text style={s.cardHint}>
            Select any conditions that are relevant to your journey. This helps Àràbìrìn tailor insights and support more thoughtfully.
          </Text>
          <View style={s.modeGrid}>
            {[
              { key: 'fibroids', label: 'Fibroids'      },
              { key: 'endo',     label: 'Endometriosis' },
              { key: 'pcos',     label: 'PCOS'          },
              { key: 'sickle_cell',     label: 'Sickle cell'          },
              { key: 'thalassemia', label: 'Thalassemia' },
            ].map((c) => {
              const active = (form.conditions ?? []).includes(c.key)
              return (
                <Pressable
                  key={c.key}
                  style={[s.modeBtn, active && s.modeBtnSelected]}
                  onPress={() => {
                    const current = form.conditions ?? []
                    const updated = current.includes(c.key)
                      ? current.filter((x:string) => x !== c.key)
                      : [...current, c.key]
                    updateField('conditions', updated)
                  }}
                >
                  <Text style={[s.modeBtnText, active && s.modeBtnTextSelected]}>
                    {c.label}
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
            onBlur={(e) => updateField('age', clampNumber(form.age, LIMITS.age.min, LIMITS.age.max))}
            placeholder="Enter your age"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
          />
          {errors.age && <Text style={s.errorText}>{errors.age}</Text>}
        </View>

        {/* Height */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Height (cm)</Text>
          <TextInput
            style={s.input}
            value={form.height}
            onChangeText={(v) => updateField('height', v.replace(/[^0-9]/g, ''))}
            onBlur={() => updateField('height', clampNumber(form.height, LIMITS.height.min, LIMITS.height.max))}
            placeholder="Enter your height in cm"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
          />
          {errors.height && <Text style={s.errorText}>{errors.height}</Text>}
        </View>

        {/* Weight */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Weight (kg)</Text>
          <TextInput
            style={s.input}
            value={form.weight}
            onChangeText={(v) => updateField('weight', v.replace(/[^0-9]/g, ''))}
            onBlur={() => updateField('weight', clampNumber(form.weight, LIMITS.weight.min, LIMITS.weight.max))}
            placeholder="Enter your weight in kg"
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
          />
          {errors.weight && <Text style={s.errorText}>{errors.weight}</Text>}
        </View>

        {/* Cycle length */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Cycle length</Text>
          <View style={s.optionRow}>
            {CYCLE_OPTIONS.map((n) => (
              <Pressable
                key={n}
                style={[s.optionBtn, Number(form.cycleLength) === n && !showCustomCycle && s.optionSelected]}
                onPress={() => { updateField('cycleLength', n.toString()); setShowCustomCycle(false) }}
              >
                <Text style={[s.optionBtnText, Number(form.cycleLength) === n && !showCustomCycle && s.optionSelectedText]}>
                  {n}d
                </Text>
              </Pressable>
            ))}
            <Pressable
              style={[s.optionBtn, showCustomCycle && s.optionSelected]}
              onPress={() => { setShowCustomCycle(true); if (CYCLE_OPTIONS.includes(Number(form.cycleLength))) updateField('cycleLength', '') }}
            >
              <Text style={[s.optionBtnText, showCustomCycle && s.optionSelectedText]}>Custom</Text>
            </Pressable>
          </View>
          {showCustomCycle && (
            <TextInput
              style={s.input}
              value={form.cycleLength}
              onChangeText={(v) => updateField('cycleLength', v.replace(/[^0-9]/g, ''))}
              onBlur={() => updateField('cycleLength', clampNumber(form.cycleLength, LIMITS.cycle.min, LIMITS.cycle.max))}
              placeholder={`${LIMITS.cycle.min}–${LIMITS.cycle.max} days`}
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
            />
          )}
          {errors.cycleLength && <Text style={s.errorText}>{errors.cycleLength}</Text>}
        </View>

        {/* Period length */}
        <View style={s.card}>
          <Text style={s.cardLabel}>Period length</Text>
          <View style={s.optionRow}>
            {PERIOD_OPTIONS.map((n) => (
              <Pressable
                key={n}
                style={[s.optionBtn, Number(form.periodLength) === n && !showCustomPeriod && s.optionSelected]}
                onPress={() => { updateField('periodLength', n.toString()); setShowCustomPeriod(false) }}
              >
                <Text style={[s.optionBtnText, Number(form.periodLength) === n && !showCustomPeriod && s.optionSelectedText]}>
                  {n}d
                </Text>
              </Pressable>
            ))}
            <Pressable
              style={[s.optionBtn, showCustomPeriod && s.optionSelected]}
              onPress={() => { setShowCustomPeriod(true); if (PERIOD_OPTIONS.includes(Number(form.periodLength))) updateField('periodLength', '') }}
            >
              <Text style={[s.optionBtnText, showCustomPeriod && s.optionSelectedText]}>Custom</Text>
            </Pressable>
          </View>
          {showCustomPeriod && (
            <TextInput
              style={s.input}
              value={form.periodLength}
              onChangeText={(v) => updateField('periodLength', v.replace(/[^0-9]/g, ''))}
              onBlur={() => updateField('periodLength', clampNumber(form.periodLength, LIMITS.period.min, LIMITS.period.max))}
              placeholder={`${LIMITS.period.min}–${LIMITS.period.max} days`}
              placeholderTextColor={colors.textMuted}
              keyboardType="number-pad"
            />
          )}
          {errors.periodLength && <Text style={s.errorText}>{errors.periodLength}</Text>}
        </View>

        {/* Save */}
        {errors.save && <Text style={s.saveError}>{errors.save}</Text>}
        <Pressable
          style={[s.saveBtn, saved && s.saveBtnSaved, saving && s.saveBtnDisabled]}
          onPress={handleSave}
          disabled={saving}
        >
          {saving
            ? <ActivityIndicator color={colors.bgPrimary} />
            : <Text style={s.saveBtnText}>{saved ? 'Saved ✓' : 'Save changes'}</Text>
          }
        </Pressable>

        <Text style={s.sectionHeading}>Appearance</Text>
        
        <View style={s.card}>
          <View style={s.rowBetween}>
            <View style={s.appearanceTextWrap}>
              <Text style={s.cardTitle}>Dark mode</Text>
              <Text style={s.cardHint}>
                Switch between light and dark appearance
              </Text>
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
              This permanently deletes your profile, cycle history, symptom logs, settings, and consent records, then signs you out.
            </Text>
            <Text style={s.deleteSupportText}>
              Need help with your account or data? Contact support at titayanks@gmail.com
            </Text>
          </Pressable>
        </View>

      </ScrollView>
    </SafeAreaView>
  )
}