import { useState, useEffect, useMemo } from 'react'
import {
  Modal,
  View,
  Text,
  Pressable,
  ScrollView,
  ActivityIndicator,
  TextInput,
} from 'react-native'
import { X } from 'lucide-react-native'
import { supabase } from '../../lib/supabase'
import { makeCalendarSheetStyles } from '../../styles/components/calendarSheet'
import { useAppData } from '../../context/AppDataContext'
import type { ThemeColors } from '../../constants/theme'
import { format, subDays, parseISO } from 'date-fns'

type SheetMode = 'log' | 'symptoms' | 'predicted' | 'fertile' | 'ovulation' | 'extend'

type Props = {
  visible: boolean
  mode: SheetMode | null
  dateLabel: string
  dateStr: string
  colors: ThemeColors
  journeyMode?: string
  existingLog?: {
    mood: string | null
    flow: string | null
    cramps: string | null
    energy: string | null
    extras: string[]
    notes: string | null
  } | null
  onClose: () => void
  onSaved?: () => Promise<void> | void
}

const moodOptions = [
  { key: 'happy', label: 'Happy' },
  { key: 'calm', label: 'Calm' },
  { key: 'anxious', label: 'Anxious' },
  { key: 'irritable', label: 'Irritable' },
  { key: 'sad', label: 'Sad' },
]

const flowOptions = [
  { key: 'none', dots: 0, label: 'None' },
  { key: 'spotting', dots: 1, label: 'Spotting' },
  { key: 'light', dots: 2, label: 'Light' },
  { key: 'medium', dots: 3, label: 'Medium' },
  { key: 'heavy', dots: 4, label: 'Heavy' },
]

const crampOptions = [
  { key: 'none', label: 'None' },
  { key: 'mild', label: 'Mild' },
  { key: 'moderate', label: 'Moderate' },
  { key: 'severe', label: 'Severe' },
]

const energyOptions = [
  { key: 'high', bars: 3, label: 'High' },
  { key: 'medium', bars: 2, label: 'Medium' },
  { key: 'low', bars: 1, label: 'Low' },
]

const extraOptions = [
  { key: 'bloating', label: 'Bloating' },
  { key: 'headache', label: 'Headache' },
  { key: 'backPain', label: 'Back pain' },
  { key: 'breastTenderness', label: 'Breast Tenderness' },
  { key: 'nausea', label: 'Nausea' },
  { key: 'insomnia', label: 'Insomnia' },
]

const CONDITION_EXTRAS: Record<string, Array<{ key: string; label: string }>> = {
  fibroids: [
    { key: 'pelvicPressure',    label: 'Pelvic pressure'     },
    { key: 'urinaryFrequency',  label: 'Frequent urination'  },
    { key: 'painDuringSex',     label: 'Pain during sex'     },
  ],
  endo: [
    { key: 'pelvicPain',             label: 'Pelvic pain'               },
    { key: 'painDuringSex',          label: 'Pain during sex'           },
    { key: 'painBowelMovements',     label: 'Pain with bowel movements' },
    { key: 'fatigue',                label: 'Fatigue'                   },
  ],
  pcos: [
    { key: 'hairLoss',   label: 'Hair thinning' },
    { key: 'acne',       label: 'Acne'          },
    { key: 'spotting',   label: 'Spotting'      },
  ],
  thalassemia: [
    { key: 'fatigue',        label: 'Severe fatigue'  },
    { key: 'paleSkin',       label: 'Pale skin'       },
    { key: 'boneAche',       label: 'Bone ache'       },
    { key: 'breathlessness', label: 'Breathlessness'  },
  ],
  ttc: [
    { key: 'cervicalMucus',   label: 'Cervical mucus changes' },
    { key: 'ovulationPain',   label: 'Ovulation pain'         },
    { key: 'spotting',        label: 'Spotting'                },
  ],
}

// ── Sub-components — styles passed from parent, no useMemo inside ──

function MoodSection({
  styles,
  colors,
  value,
  onChange,
}: {
  styles: ReturnType<typeof makeCalendarSheetStyles>
  colors: ThemeColors
  value: string | null
  onChange: (value: string) => void
}) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={[styles.sectionEyebrow, { color: colors.accentGold }]}>MOOD</Text>
      <View style={styles.optionRow}>
        {moodOptions.map((option) => {
          const active = value === option.key
          return (
            <Pressable
              key={option.key}
              style={[
                styles.moodBtn,
                {
                  borderColor: active ? colors.accentRose : colors.borderRose,
                  backgroundColor: colors.bgSecondary,
                },
              ]}
              onPress={() => onChange(option.key)}
            >
              <Text style={[styles.moodLabel, { color: active ? colors.accentRose : colors.textPrimary }]}>
                {option.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

function FlowSection({
  styles,
  colors,
  value,
  onChange,
}: {
  styles: ReturnType<typeof makeCalendarSheetStyles>
  colors: ThemeColors
  value: string | null
  onChange: (value: string) => void
}) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={[styles.sectionEyebrow, { color: colors.accentGold }]}>FLOW</Text>
      <View style={styles.optionRow}>
        {flowOptions.map((option) => {
          const active = value === option.key
          return (
            <Pressable
              key={option.key}
              style={[
                styles.flowBtn,
                {
                  borderColor: active ? colors.accentRose : colors.borderRose,
                  backgroundColor: colors.bgSecondary,
                },
              ]}
              onPress={() => onChange(option.key)}
            >
              <View style={styles.flowDots}>
                {option.dots === 0 ? (
                  <Text style={[styles.flowNone, { color: active ? colors.accentRose : colors.textMuted }]}>—</Text>
                ) : (
                  Array.from({ length: option.dots }).map((_, i) => (
                    <View
                      key={i}
                      style={[styles.flowDot, { backgroundColor: active ? colors.accentRose : colors.textMuted }]}
                    />
                  ))
                )}
              </View>
              <Text style={[styles.flowLabel, { color: active ? colors.accentRose : colors.textPrimary }]}>
                {option.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

function ChipSection({
  title,
  styles,
  colors,
  options,
  value,
  onChange,
}: {
  title: string
  styles: ReturnType<typeof makeCalendarSheetStyles>
  colors: ThemeColors
  options: Array<{ key: string; label: string }>
  value: string | null
  onChange: (value: string) => void
}) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={[styles.sectionEyebrow, { color: colors.accentGold }]}>{title.toUpperCase()}</Text>
      <View style={styles.optionRow}>
        {options.map((option) => {
          const active = value === option.key
          return (
            <Pressable
              key={option.key}
              style={[
                styles.optionBtn,
                {
                  borderColor: active ? colors.accentRose : colors.borderRose,
                  backgroundColor: colors.bgSecondary,
                },
              ]}
              onPress={() => onChange(option.key)}
            >
              <Text style={[styles.optionText, { color: active ? colors.accentRose : colors.textPrimary }]}>
                {option.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

function EnergySection({
  styles,
  colors,
  value,
  onChange,
}: {
  styles: ReturnType<typeof makeCalendarSheetStyles>
  colors: ThemeColors
  value: string | null
  onChange: (value: string) => void
}) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={[styles.sectionEyebrow, { color: colors.accentGold }]}>ENERGY</Text>
      <View style={styles.optionRow}>
        {energyOptions.map((option) => {
          const active = value === option.key
          return (
            <Pressable
              key={option.key}
              style={[
                styles.energyBtn,
                {
                  borderColor: active ? colors.accentRose : colors.borderRose,
                  backgroundColor: colors.bgSecondary,
                },
              ]}
              onPress={() => onChange(option.key)}
            >
              <View style={styles.energyBars}>
                {Array.from({ length: option.bars }).map((_, i) => (
                  <View
                    key={i}
                    style={[
                      styles.energyBar,
                      { height: 4 + i * 3, backgroundColor: active ? colors.accentRose : colors.textMuted },
                    ]}
                  />
                ))}
              </View>
              <Text style={[styles.energyLabel, { color: active ? colors.accentRose : colors.textPrimary }]}>
                {option.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

function ExtrasSection({
  styles,
  colors,
  values,
  onToggle,
}: {
  styles: ReturnType<typeof makeCalendarSheetStyles>
  colors: ThemeColors
  values: string[]
  onToggle: (value: string) => void
}) {
  return (
    <View style={styles.sectionWrap}>
      <Text style={[styles.sectionEyebrow, { color: colors.accentGold }]}>OTHER SYMPTOMS</Text>
      <View style={styles.optionRow}>
        {extraOptions.map((option) => {
          const active = values.includes(option.key)
          return (
            <Pressable
              key={option.key}
              style={[
                styles.optionBtn,
                {
                  borderColor: active ? colors.accentRose : colors.borderRose,
                  backgroundColor: colors.bgSecondary,
                },
              ]}
              onPress={() => onToggle(option.key)}
            >
              <Text style={[styles.optionText, { color: active ? colors.accentRose : colors.textPrimary }]}>
                {active ? '✓ ' : ''}{option.label}
              </Text>
            </Pressable>
          )
        })}
      </View>
    </View>
  )
}

// ── Main component ──

export function CalendarSheet({
  visible,
  mode,
  dateLabel,
  dateStr,
  colors,
  existingLog,
  journeyMode,
  onClose,
  onSaved,
}: Props) {
  const s = useMemo(() => makeCalendarSheetStyles(colors), [colors])
  const { periodLength, addPeriod} = useAppData()

  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false)
  const [error, setError] = useState('')
  const [isPeriodStart, setIsPeriodStart] = useState(false)
  const [mood, setMood] = useState<string | null>(existingLog?.mood ?? null)
  const [flow, setFlow] = useState<string | null>(existingLog?.flow ?? null)
  const [cramps, setCramps] = useState<string | null>(existingLog?.cramps ?? null)
  const [energy, setEnergy] = useState<string | null>(existingLog?.energy ?? null)
  const [extras, setExtras] = useState<string[]>(existingLog?.extras ?? [])
  const [notes, setNotes] = useState(existingLog?.notes ?? '')

  // ── Reset state whenever sheet opens with fresh data ──
  useEffect(() => {
    if (visible) {
      setMood(existingLog?.mood ?? null)
      setFlow(existingLog?.flow ?? null)
      setCramps(existingLog?.cramps ?? null)
      setEnergy(existingLog?.energy ?? null)
      setExtras(existingLog?.extras ?? [])
      setNotes(existingLog?.notes ?? '')
      setSaved(false)
      setError('')
      setLoading(false)
      setIsPeriodStart(false)
    }
  }, [visible])

  const handleClose = () => {
    onClose()
  }

  const toggleExtra = (key: string) => {
    setExtras((prev) =>
      prev.includes(key) ? prev.filter((item) => item !== key) : [...prev, key]
    )
  }

  const saveSymptomLog = async () => {
    try {
      setLoading(true)
      setError('')
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      const { error: upsertError } = await supabase
        .from('symptom_logs')
        .upsert(
          { user_id: user.id, log_date: dateStr, mood, flow, cramps, energy, extras, notes: notes.trim() || null },
          { onConflict: 'user_id,log_date' }
        )
      if (upsertError) throw upsertError
      if (isPeriodStart) await addPeriod(dateStr)
      if (onSaved) await onSaved()
      setSaved(true)
      setTimeout(() => handleClose(), 1000)
    } catch (err: any) {
      setError(err.message || 'Unable to save your log right now.')
      setLoading(false)
    }
  }

  const confirmPredictedPeriod = async () => {
    try {
      setLoading(true)
      setError('')
      const { data: { user } } = await supabase.auth.getUser()
      if (!user) throw new Error('No authenticated user')

      // ── Use periodLength to calculate correct end date ──
      const start = new Date(dateStr)
      const end = new Date(start)
      end.setDate(end.getDate() + (periodLength - 1))
      const endDate = end.toISOString().split('T')[0]

      const { error } = await supabase.from('periods').insert({
        user_id: user.id,
        start_date: dateStr,
        end_date: endDate,
      })
      if (error) throw error
      if (onSaved) await onSaved()
      handleClose()
    } catch (err: any) {
      setError(err.message || 'Unable to confirm this period day right now.')
      setLoading(false)
    }
  }

  const extendPeriod = async () => {
  try {
    setLoading(true)
    setError('')
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('No authenticated user')

    const yesterday = format(subDays(parseISO(dateStr), 1), 'yyyy-MM-dd')

    const { error,data } = await supabase
      .from('periods')
      .update({ end_date: dateStr })
      .eq('user_id', user.id)
      .eq('end_date', yesterday)
      


    if (error) throw error
    if (onSaved) await onSaved()
    handleClose()
  } catch (err: any) {
    setError(err.message || 'Unable to extend period.')
    setLoading(false)
  }
}

  const title =
    mode === 'symptoms' ? 'Log symptoms'
    : mode === 'predicted' ? 'Predicted period'
    : mode === 'fertile' ? 'Fertile window'
    : mode === 'ovulation' ? 'Ovulation'
    : mode === 'extend'    ? 'Still bleeding?'
    : 'Log for this day'

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={handleClose}>
      <View style={s.overlay}>
        <Pressable style={s.backdrop} onPress={handleClose} />
        <View style={[s.sheet, { backgroundColor: colors.bgPrimary, borderTopColor: colors.borderRose }]}>
          <View style={s.handleWrap}>
            <View style={[s.handle, { backgroundColor: colors.borderRose }]} />
          </View>

          <View style={s.header}>
            <View style={{ flex: 1 }}>
              <Text style={[s.title, { color: colors.accentGold }]}>{title}</Text>
              <Text style={[s.dateLabel, { color: colors.textMuted }]}>{dateLabel}</Text>
            </View>
            <Pressable style={s.closeBtn} onPress={handleClose}>
              <X color={colors.textMuted} size={20} strokeWidth={1.8} />
            </Pressable>
          </View>

          <ScrollView contentContainerStyle={s.content} showsVerticalScrollIndicator={false}>
            {(mode === 'log' || mode === 'symptoms') && (
              <>
                {mode === 'log' && (
                  <Pressable
                    style={[s.periodStartBtn, isPeriodStart && s.periodStartBtnActive]}
                    onPress={() => setIsPeriodStart(!isPeriodStart)}
                  >
                    <Text style={[s.periodStartBtnText, isPeriodStart && s.periodStartBtnTextActive]}>
                      {isPeriodStart ? '◉ Period started this day ✓' : '◉ My period started this day'}
                    </Text>
                  </Pressable>
                )}
                <MoodSection styles={s} colors={colors} value={mood} onChange={setMood} />
                <FlowSection styles={s} colors={colors} value={flow} onChange={setFlow} />
                <ChipSection title="Cramps" styles={s} colors={colors} options={crampOptions} value={cramps} onChange={setCramps} />
                <EnergySection styles={s} colors={colors} value={energy} onChange={setEnergy} />
                <ExtrasSection styles={s} colors={colors} values={extras} onToggle={toggleExtra} />
                {journeyMode && CONDITION_EXTRAS[journeyMode] && (
                  <View style={s.sectionWrap}>
                    <Text style={[s.sectionEyebrow, { color: colors.accentRose }]}>
                      {journeyMode.toUpperCase()} SYMPTOMS
                    </Text>
                    <View style={s.optionRow}>
                      {CONDITION_EXTRAS[journeyMode].map((option) => {
                        const active = extras.includes(option.key)
                        return (
                          <Pressable
                            key={option.key}
                            style={[
                              s.optionBtn,
                              {
                                borderColor: active ? colors.accentRose : colors.borderRose,
                                backgroundColor: colors.bgSecondary,
                              },
                            ]}
                            onPress={() => toggleExtra(option.key)}
                          >
                            <Text style={[s.optionText, {
                              color: active ? colors.accentRose : colors.textPrimary,
                            }]}>
                              {active ? '✓ ' : ''}{option.label}
                            </Text>
                          </Pressable>
                        )
                      })}
                    </View>
                  </View>
                )}

                <View style={s.sectionWrap}>
                  <Text style={[s.sectionEyebrow, { color: colors.textMuted }]}>NOTES (OPTIONAL)</Text>
                  <TextInput
                    style={[s.notesInput, { backgroundColor: colors.bgSecondary, borderColor: colors.borderRose, color: colors.textPrimary }]}
                    placeholder="Anything else you want to remember?"
                    placeholderTextColor={colors.textMuted}
                    value={notes}
                    onChangeText={setNotes}
                    multiline
                    textAlignVertical="top"
                  />
                </View>

                {!!error && <Text style={[s.error, { color: colors.accentRose }]}>{error}</Text>}
                <Pressable
                  style={[s.primaryBtn, { backgroundColor: colors.accentRose, opacity: loading ? 0.6 : 1 }]}
                  onPress={saveSymptomLog}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color={colors.bgPrimary} />
                    : <Text style={[s.primaryBtnText, { color: colors.bgPrimary }]}>{saved ? 'Saved ✓' : 'Save'}</Text>
                  }
                </Pressable>
              </>
            )}

            {mode === 'predicted' && (
              <>
                <Text style={[s.description, { color: colors.textMuted }]}>
                  Your period may start around this day based on your recent cycle history.
                </Text>
                <Text style={[s.description, { color: colors.textMuted }]}>
                  Did your period start today?
                </Text>
                {!!error && <Text style={[s.error, { color: colors.accentRose }]}>{error}</Text>}
                <Pressable
                  style={[s.primaryBtn, { backgroundColor: colors.accentRose, opacity: loading ? 0.6 : 1 }]}
                  onPress={confirmPredictedPeriod}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color={colors.bgPrimary} />
                    : <Text style={[s.primaryBtnText, { color: colors.bgPrimary }]}>Yes, it started</Text>
                  }
                </Pressable>
                <Pressable
                  style={[s.secondaryBtn, { borderColor: colors.borderRose, backgroundColor: colors.bgSecondary }]}
                  onPress={handleClose}
                  disabled={loading}
                >
                  <Text style={[s.secondaryBtnText, { color: colors.textPrimary }]}>Not yet</Text>
                </Pressable>
              </>
            )}

            {mode === 'fertile' && (
              <>
                <Text style={[s.description, { color: colors.textMuted }]}>
                  You are in your fertile window, the days leading up to ovulation when pregnancy is most likely.
                </Text>
                <Text style={[s.description, { color: colors.textMuted }]}>
                  This is an estimate based on your cycle history and may shift over time as Àràbìrín learns your pattern.
                </Text>
              </>
            )}

            {mode === 'ovulation' && (
              <>
                <Text style={[s.description, { color: colors.textMuted }]}>
                  This is your estimated ovulation day, when your ovary is most likely to release an egg.
                </Text>
                <Text style={[s.description, { color: colors.textMuted }]}>
                  Ovulation timing can vary from cycle to cycle, so treat this as a guide rather than a guarantee.
                </Text>
              </>
            )}

            {mode === 'extend' && (
              <>
                <Text style={[s.description, { color: colors.textMuted }]}>
                  Your period was logged as ending yesterday. Is it still going?
                </Text>
                <Text style={[s.description, { color: colors.textMuted }]}>
                  Tap below to extend it by one day.
                </Text>
                {!!error && (
                  <Text style={[s.error, { color: colors.accentRose }]}>{error}</Text>
                )}
                <Pressable
                  style={[s.primaryBtn, { backgroundColor: colors.accentRose, opacity: loading ? 0.6 : 1 }]}
                  onPress={extendPeriod}
                  disabled={loading}
                >
                  {loading
                    ? <ActivityIndicator color={colors.bgPrimary} />
                    : <Text style={[s.primaryBtnText, { color: colors.bgPrimary }]}>
                        Yes, extend by one day
                      </Text>
                  }
                </Pressable>
                <Pressable
                  style={[s.secondaryBtn, { borderColor: colors.borderRose, backgroundColor: colors.bgSecondary }]}
                  onPress={handleClose}
                  disabled={loading}
                >
                  <Text style={[s.secondaryBtnText, { color: colors.textPrimary }]}>
                    No, it ended
                  </Text>
                </Pressable>
              </>
            )}
          </ScrollView>
        </View>
      </View>
    </Modal>
  )
}