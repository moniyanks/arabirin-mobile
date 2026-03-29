import { useState } from 'react'
import { useRouter } from 'expo-router'
import {
  View,
  Text,
  TextInput,
  Pressable,
  ScrollView,
  ActivityIndicator,
} from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { SafeAreaView } from 'react-native-safe-area-context'
import { format } from 'date-fns'
import { supportsCyclePredictions } from '../../../constants/appMode'
import { supabase } from '../../../lib/supabase'
import { useColors } from '../../../styles'
import { makeOnboardingStyles } from '../../../styles/screens/onboarding'
import { useAppData } from '../../../context/AppDataContext'

type Step = 'name' | 'mode' | 'conditions' | 'final'
const STEPS: Step[] = ['name', 'mode', 'conditions', 'final']

const MODES = [
  {
    key: 'cycle',
    label: 'Tracking my cycle',
    desc: 'Understanding my phases, symptoms and patterns',
  },
  {
    key: 'ttc',
    label: 'Trying to conceive',
    desc: 'Fertile window, ovulation tracking and cycle quality',
  },
  {
    key: 'pregnant',
    label: 'Pregnant',
    desc: 'Weekly milestones, symptoms and care prompts',
  },
  {
    key: 'postpartum',
    label: 'Postpartum',
    desc: 'Recovery, return to cycle and emotional support',
  },
  {
    key: 'healing',
    label: 'Loss or recovery',
    desc: 'Healing tracking, symptom monitoring and support',
  },
  {
    key: 'perimenopause',
    label: 'Perimenopause',
    desc: 'Cycle changes, symptoms and transition support',
  },
]

const CONDITIONS = [
  { key: 'fibroids', label: 'Fibroids', desc: 'Uterine fibroids or suspected fibroids' },
  { key: 'endo', label: 'Endometriosis', desc: 'Diagnosed or suspected endometriosis' },
  { key: 'pcos', label: 'PCOS', desc: 'Polycystic ovary syndrome' },
  { key: 'thalassemia', label: 'Thalassemia', desc: 'Thalassemia trait or thalassemia major' },
]

export default function OnboardingScreen() {
  const colors = useColors()
  const s = makeOnboardingStyles(colors)
  const { refetchAll } = useAppData()
  const router = useRouter()

  const [step, setStep] = useState<Step>('name')
  const [name, setName] = useState('')
  const [mode, setMode] = useState('cycle')
  const [conditions, setConditions] = useState<string[]>([])

  const [periodLength, setPeriodLength] = useState(5)
  const [cycleLength, setCycleLength] = useState(28)

  const [useCustomCycleLength, setUseCustomCycleLength] = useState(false)
  const [customCycleLength, setCustomCycleLength] = useState('')
  const [isCycleLengthUnknown, setIsCycleLengthUnknown] = useState(false)

  const [showDatePicker, setShowDatePicker] = useState(false)
  const [lastPeriodDate, setLastPeriodDate] = useState(new Date())

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')

  const stepIndex = STEPS.indexOf(step)
  const totalSteps = STEPS.length

  const selectedDateStr = format(lastPeriodDate, 'yyyy-MM-dd')
  const selectedDateDisplay = format(lastPeriodDate, 'd MMMM yyyy')
  const supportsPredictions = supportsCyclePredictions(mode as any)

  const resolvedCycleLength =
    isCycleLengthUnknown
      ? null
      : useCustomCycleLength
        ? Number(customCycleLength)
        : cycleLength

  const isValidResolvedCycleLength =
    resolvedCycleLength === null ||
    (Number.isFinite(resolvedCycleLength) &&
      resolvedCycleLength >= 15 &&
      resolvedCycleLength <= 90)

  const canAdvance = () => {
    switch (step) {
      case 'name':
        return name.trim().length >= 2
      default:
        return true
    }
  }

  const canFinishFinalStep = () => {
    if (!supportsPredictions) return true

    return (
      !!lastPeriodDate &&
      periodLength > 0 &&
      isValidResolvedCycleLength &&
      (!useCustomCycleLength || customCycleLength.trim().length > 0)
    )
  }

  const handleFinish = async (shouldCreatePeriod: boolean) => {
    setLoading(true)
    setError('')

    try {
      const {
        data: { user },
      } = await supabase.auth.getUser()

      if (!user) throw new Error('No authenticated user')

      const finalCycleLength = supportsPredictions ? resolvedCycleLength : null

      if (
        supportsPredictions &&
        finalCycleLength !== null &&
        (!Number.isFinite(finalCycleLength) ||
          finalCycleLength < 15 ||
          finalCycleLength > 90)
      ) {
        throw new Error('Please enter a valid cycle length between 15 and 90 days')
      }

      const { error: profileErr } = await supabase
        .from('profiles')
        .upsert(
          {
            id: user.id,
            name: name.trim(),
            mode,
            conditions,
            cycle_length: finalCycleLength,
            period_length: supportsPredictions ? periodLength : null,
            updated_at: new Date().toISOString(),
          },
          { onConflict: 'id' }
        )

      if (profileErr) throw profileErr

      if (shouldCreatePeriod) {
        const endDate = new Date(lastPeriodDate)
        endDate.setDate(endDate.getDate() + (periodLength - 1))
        const endDateStr = format(endDate, 'yyyy-MM-dd')

        const { error: periodErr } = await supabase.from('periods').insert({
          user_id: user.id,
          start_date: selectedDateStr,
          end_date: endDateStr,
        })

        if (periodErr) throw periodErr
      }

      await refetchAll()
      router.replace('/(tabs)')
    } catch (err: any) {
      setError(err.message || 'Something went wrong')
    } finally {
      setLoading(false)
    }
  }

  const advance = async () => {
    if (step === 'name') {
      if (!canAdvance()) return
      setStep('mode')
      return
    }

    if (step === 'mode') {
      setStep('conditions')
      return
    }

    if (step === 'conditions') {
      setStep('final')
      return
    }

    if (step === 'final') {
      if (!canFinishFinalStep()) return
      await handleFinish(supportsPredictions)
    }
  }

  const back = () => {
    const prev = STEPS[stepIndex - 1]
    if (prev) setStep(prev)
  }

  const toggleCondition = (key: string) => {
    setConditions((prev) =>
      prev.includes(key) ? prev.filter((c) => c !== key) : [...prev, key]
    )
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.stepLabel}>Step {stepIndex + 1} of {totalSteps}</Text>
        <View style={s.progressRow}>
          {STEPS.map((st, i) => (
            <View
              key={st}
              style={[
                s.progressDot,
                i < stepIndex && s.progressDotDone,
                i === stepIndex && s.progressDotActive,
              ]}
            />
          ))}
        </View>
      </View>

      {step === 'name' && (
        <>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={s.content}>
            <Text style={s.stepCount}>1 of 4</Text>
            <Text style={s.question}>What shall we call you?</Text>
            <Text style={s.hint}>Just your first name is fine 🌸</Text>

            <TextInput
              value={name}
              onChangeText={setName}
              placeholder="Your first name"
              placeholderTextColor={colors.textMuted}
              style={s.textInput}
              autoCapitalize="words"
              autoCorrect={false}
            />
          </ScrollView>

          <View style={s.footer}>
            {!!error && <Text style={s.error}>{error}</Text>}
            <Pressable
              style={[s.btn, (!canAdvance() || loading) && s.btnDisabled]}
              onPress={advance}
              disabled={!canAdvance() || loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.bgPrimary} />
              ) : (
                <Text style={s.btnText}>Continue →</Text>
              )}
            </Pressable>
          </View>
        </>
      )}

      {step === 'mode' && (
        <>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={s.content}>
            <Text style={s.stepCount}>2 of 4</Text>
            <Text style={s.question}>Where are you in your journey?</Text>
            <Text style={s.hint}>This shapes everything you see in Àràbìrín</Text>

            <View style={s.modeList}>
              {MODES.map((item) => {
                const active = mode === item.key
                return (
                  <Pressable
                    key={item.key}
                    style={[s.modeCard, active && s.modeCardActive]}
                    onPress={() => setMode(item.key)}
                  >
                    <Text style={[s.modeTitle, active && s.modeTitleActive]}>
                      {item.label}
                    </Text>
                    <Text style={[s.modeDesc, active && s.modeDescActive]}>
                      {item.desc}
                    </Text>
                  </Pressable>
                )
              })}
            </View>
          </ScrollView>

          <View style={s.footer}>
            {!!error && <Text style={s.error}>{error}</Text>}
            <Pressable
              style={[s.btn, loading && s.btnDisabled]}
              onPress={advance}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.bgPrimary} />
              ) : (
                <Text style={s.btnText}>Continue →</Text>
              )}
            </Pressable>

            <Pressable style={s.ghostBtn} onPress={back}>
              <Text style={s.ghostBtnText}>← Back</Text>
            </Pressable>
          </View>
        </>
      )}

      {step === 'conditions' && (
        <>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={s.content}>
            <Text style={s.stepCount}>3 of 4</Text>
            <Text style={s.question}>Do you have any of these conditions?</Text>
            <Text style={s.hint}>
              Select all that apply. This helps us personalise your health insights.
            </Text>

            <View style={s.modeList}>
              {CONDITIONS.map((item) => {
                const active = conditions.includes(item.key)
                return (
                  <Pressable
                    key={item.key}
                    style={[s.modeCard, active && s.modeCardActive]}
                    onPress={() => toggleCondition(item.key)}
                  >
                    <Text style={[s.modeTitle, active && s.modeTitleActive]}>
                      {item.label}
                    </Text>
                    <Text style={[s.modeDesc, active && s.modeDescActive]}>
                      {item.desc}
                    </Text>
                  </Pressable>
                )
              })}
            </View>

            <Text style={s.hint}>
              None of these apply or not sure? That's okay. You can update this anytime in your profile.
            </Text>
          </ScrollView>

          <View style={s.footer}>
            {!!error && <Text style={s.error}>{error}</Text>}
            <Pressable
              style={[s.btn, loading && s.btnDisabled]}
              onPress={advance}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color={colors.bgPrimary} />
              ) : (
                <Text style={s.btnText}>Continue →</Text>
              )}
            </Pressable>
            <Pressable style={s.ghostBtn} onPress={back}>
              <Text style={s.ghostBtnText}>← Back</Text>
            </Pressable>
          </View>
        </>
      )}

      {step === 'final' && (
        <>
          <ScrollView style={{ flex: 1 }} contentContainerStyle={s.content}>
            <Text style={s.stepCount}>4 of 4</Text>

            {supportsPredictions ? (
              <>
                <Text style={s.question}>When did your last period start?</Text>
                <Text style={s.hint}>Your best guess is fine too 🌿</Text>

                <Pressable
                  style={s.dateField}
                  onPress={() => setShowDatePicker(true)}
                >
                  <Text style={s.dateFieldText}>{selectedDateDisplay}</Text>
                </Pressable>

                {showDatePicker && (
                  <DateTimePicker
                    value={lastPeriodDate}
                    mode="date"
                    display="default"
                    maximumDate={new Date()}
                    onChange={(_, date) => {
                      setShowDatePicker(false)
                      if (date) setLastPeriodDate(date)
                    }}
                  />
                )}

                <Text style={s.questionSmall}>
                  How many days does your period usually last?
                </Text>

                <View style={s.optionRow}>
                  {[2, 3, 4, 5, 6, 7].map((n) => (
                    <Pressable
                      key={n}
                      style={[s.optionBtn, periodLength === n && s.optionSelected]}
                      onPress={() => setPeriodLength(n)}
                    >
                      <Text
                        style={[
                          s.optionBtnText,
                          periodLength === n && s.optionSelectedText,
                        ]}
                      >
                        {n}
                      </Text>
                    </Pressable>
                  ))}

                  <Pressable
                    style={[s.optionBtn, periodLength === 8 && s.optionSelected]}
                    onPress={() => setPeriodLength(8)}
                  >
                    <Text
                      style={[
                        s.optionBtnText,
                        periodLength === 8 && s.optionSelectedText,
                      ]}
                    >
                      7+
                    </Text>
                  </Pressable>
                </View>

                <Text style={s.questionSmall}>
                  How long is your usual cycle?
                </Text>
                <Text style={s.hint}>
                  From the first day of one period to the next 🌙
                </Text>

                <View style={s.optionRow}>
                  {[21, 28, 30, 35].map((n) => (
                    <Pressable
                      key={n}
                      style={[
                        s.optionBtn,
                        !useCustomCycleLength &&
                          !isCycleLengthUnknown &&
                          cycleLength === n &&
                          s.optionSelected,
                      ]}
                      onPress={() => {
                        setUseCustomCycleLength(false)
                        setIsCycleLengthUnknown(false)
                        setCustomCycleLength('')
                        setCycleLength(n)
                      }}
                    >
                      <Text
                        style={[
                          s.optionBtnText,
                          !useCustomCycleLength &&
                            !isCycleLengthUnknown &&
                            cycleLength === n &&
                            s.optionSelectedText,
                        ]}
                      >
                        {n}d
                      </Text>
                    </Pressable>
                  ))}

                  <Pressable
                    style={[s.optionBtn, useCustomCycleLength && s.optionSelected]}
                    onPress={() => {
                      setUseCustomCycleLength(true)
                      setIsCycleLengthUnknown(false)
                    }}
                  >
                    <Text
                      style={[
                        s.optionBtnText,
                        useCustomCycleLength && s.optionSelectedText,
                      ]}
                    >
                      Custom
                    </Text>
                  </Pressable>

                  <Pressable
                    style={[s.optionBtn, isCycleLengthUnknown && s.optionSelected]}
                    onPress={() => {
                      setUseCustomCycleLength(false)
                      setIsCycleLengthUnknown(true)
                      setCustomCycleLength('')
                    }}
                  >
                    <Text
                      style={[
                        s.optionBtnText,
                        isCycleLengthUnknown && s.optionSelectedText,
                      ]}
                    >
                      I’m not sure
                    </Text>
                  </Pressable>
                </View>

                {useCustomCycleLength && (
                  <TextInput
                    value={customCycleLength}
                    onChangeText={(value) => {
                      const cleaned = value.replace(/[^0-9]/g, '')
                      setCustomCycleLength(cleaned)
                    }}
                    keyboardType="number-pad"
                    placeholder="Enter cycle length in days"
                    placeholderTextColor={colors.textMuted}
                    style={s.textInput}
                  />
                )}

                {useCustomCycleLength &&
                  customCycleLength.trim().length > 0 &&
                  !isValidResolvedCycleLength && (
                    <Text style={s.error}>
                      Enter a valid cycle length between 15 and 90 days.
                    </Text>
                  )}
              </>
            ) : (
              <>
                <Text style={s.question}>Almost there, {name}</Text>
                <Text style={s.hint}>
                  Your Àràbìrín is ready. We’ll personalise everything based on your journey.
                </Text>
              </>
            )}
          </ScrollView>

          <View style={s.footer}>
            {!!error && <Text style={s.error}>{error}</Text>}
            <Pressable
              style={[
                s.btn,
                (loading || !canFinishFinalStep()) && s.btnDisabled,
              ]}
              onPress={advance}
              disabled={loading || !canFinishFinalStep()}
            >
              {loading ? (
                <ActivityIndicator color={colors.bgPrimary} />
              ) : (
                <Text style={s.btnText}>Finish →</Text>
              )}
            </Pressable>

            <Pressable style={s.ghostBtn} onPress={back}>
              <Text style={s.ghostBtnText}>← Back</Text>
            </Pressable>
          </View>
        </>
      )}
    </SafeAreaView>
  )
}