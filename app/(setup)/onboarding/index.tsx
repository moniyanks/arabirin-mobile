import { useMemo, useState } from 'react'
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

import { supportsCyclePredictions, type AppMode } from '../../../constants/appMode'
import { useColors } from '../../../styles'
import { makeOnboardingStyles } from '../../../styles/screens/onboarding'
import { useAppData } from '../../../context/AppDataContext'
import { setupFlowService } from '../../../services/setupFlowService'
import { toAppError } from '../../../lib/errors/appError'

type Step = 'name' | 'mode' | 'conditions' | 'final'

const STEPS: Step[] = ['name', 'mode', 'conditions', 'final']

const MODES: Array<{
  key: AppMode
  label: string
  desc: string
}> = [
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
  const [mode, setMode] = useState<AppMode>('cycle')
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
  const supportsPredictions = supportsCyclePredictions(mode)

  const selectedDateStr = format(lastPeriodDate, 'yyyy-MM-dd')
  const selectedDateDisplay = format(lastPeriodDate, 'd MMMM yyyy')

  const resolvedCycleLength = useMemo<number | null>(() => {
    if (isCycleLengthUnknown) return null
    if (useCustomCycleLength) return Number(customCycleLength)
    return cycleLength
  }, [customCycleLength, cycleLength, isCycleLengthUnknown, useCustomCycleLength])

  const isValidResolvedCycleLength = useMemo(() => {
    return (
      resolvedCycleLength === null ||
      (Number.isFinite(resolvedCycleLength) &&
        resolvedCycleLength >= 15 &&
        resolvedCycleLength <= 90)
    )
  }, [resolvedCycleLength])

  const canAdvance = (): boolean => {
    if (step === 'name') {
      return name.trim().length >= 2
    }

    return true
  }

  const canFinishFinalStep = (): boolean => {
    if (!supportsPredictions) return true

    return (
      periodLength > 0 &&
      isValidResolvedCycleLength &&
      (!useCustomCycleLength || customCycleLength.trim().length > 0)
    )
  }

  const handleFinish = async () => {
    if (loading) return

    setLoading(true)
    setError('')

    try {
      await setupFlowService.completeOnboarding({
        name,
        mode,
        conditions,
        cycleLength: supportsPredictions ? resolvedCycleLength : null,
        periodLength: supportsPredictions ? periodLength : null,
        lastPeriodStartDate: supportsPredictions ? selectedDateStr : null,
      })

      await refetchAll()
      router.replace('/(tabs)')
    } catch (err) {
      const appError = toAppError(err, {
        code: 'DB_WRITE_FAILED',
        userMessage: 'We could not complete your account setup right now.',
        retryable: true,
      })
      setError(appError.userMessage)
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
      await handleFinish()
    }
  }

  const back = () => {
    if (loading) return
    const prev = STEPS[stepIndex - 1]
    if (prev) setStep(prev)
  }

  const toggleCondition = (key: string) => {
    setConditions((prev) =>
      prev.includes(key) ? prev.filter((value) => value !== key) : [...prev, key]
    )
  }

  return (
    <SafeAreaView style={s.safe}>
      <View style={s.header}>
        <Text style={s.stepLabel}>
          Step {stepIndex + 1} of {totalSteps}
        </Text>

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
              onChangeText={(value) => {
                setName(value)
                if (error) setError('')
              }}
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
                    onPress={() => {
                      setMode(item.key)
                      if (error) setError('')
                    }}
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
                    onPress={() => {
                      toggleCondition(item.key)
                      if (error) setError('')
                    }}
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
              None of these apply or not sure? That&apos;s okay. You can update this anytime in your profile.
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

                <Pressable style={s.dateField} onPress={() => setShowDatePicker(true)}>
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
                  {[2, 3, 4, 5, 6, 7].map((value) => (
                    <Pressable
                      key={value}
                      style={[s.optionBtn, periodLength === value && s.optionSelected]}
                      onPress={() => {
                        setPeriodLength(value)
                        if (error) setError('')
                      }}
                    >
                      <Text
                        style={[
                          s.optionBtnText,
                          periodLength === value && s.optionSelectedText,
                        ]}
                      >
                        {value}
                      </Text>
                    </Pressable>
                  ))}

                  <Pressable
                    style={[s.optionBtn, periodLength === 8 && s.optionSelected]}
                    onPress={() => {
                      setPeriodLength(8)
                      if (error) setError('')
                    }}
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

                <Text style={s.questionSmall}>How long is your usual cycle?</Text>
                <Text style={s.hint}>
                  From the first day of one period to the next 🌙
                </Text>

                <View style={s.optionRow}>
                  {[21, 28, 30, 35].map((value) => (
                    <Pressable
                      key={value}
                      style={[
                        s.optionBtn,
                        !useCustomCycleLength &&
                          !isCycleLengthUnknown &&
                          cycleLength === value &&
                          s.optionSelected,
                      ]}
                      onPress={() => {
                        setUseCustomCycleLength(false)
                        setIsCycleLengthUnknown(false)
                        setCustomCycleLength('')
                        setCycleLength(value)
                        if (error) setError('')
                      }}
                    >
                      <Text
                        style={[
                          s.optionBtnText,
                          !useCustomCycleLength &&
                            !isCycleLengthUnknown &&
                            cycleLength === value &&
                            s.optionSelectedText,
                        ]}
                      >
                        {value}d
                      </Text>
                    </Pressable>
                  ))}

                  <Pressable
                    style={[s.optionBtn, useCustomCycleLength && s.optionSelected]}
                    onPress={() => {
                      setUseCustomCycleLength(true)
                      setIsCycleLengthUnknown(false)
                      if (error) setError('')
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
                      if (error) setError('')
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
                      if (error) setError('')
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
                <Text style={s.question}>Almost there, {name.trim()}</Text>
                <Text style={s.hint}>
                  Your Àràbìrín is ready. We’ll personalise everything based on your journey.
                </Text>
              </>
            )}
          </ScrollView>

          <View style={s.footer}>
            {!!error && <Text style={s.error}>{error}</Text>}

            <Pressable
              style={[s.btn, (loading || !canFinishFinalStep()) && s.btnDisabled]}
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