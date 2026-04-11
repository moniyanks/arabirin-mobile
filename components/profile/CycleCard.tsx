import React, { useEffect, useState } from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { makeProfileStyles } from '../../styles/screens/profile'
import { CYCLE_OPTIONS, PERIOD_OPTIONS, LIMITS, clampNumber } from '../../utils/profileValidation'

type Props = {
  s: ReturnType<typeof makeProfileStyles>
  colors: any
  cycleLength: string
  periodLength: string
  setCycleLength: (value: string) => void
  setPeriodLength: (value: string) => void
  errors: Record<string, string>
}

export default function CycleCard({
  s,
  colors,
  cycleLength,
  periodLength,
  setCycleLength,
  setPeriodLength,
  errors
}: Props) {
  const [showCustomCycle, setShowCustomCycle] = useState(false)
  const [showCustomPeriod, setShowCustomPeriod] = useState(false)

  useEffect(() => {
    setShowCustomCycle(!CYCLE_OPTIONS.includes(Number(cycleLength)) && cycleLength !== '')
  }, [cycleLength])

  useEffect(() => {
    setShowCustomPeriod(!PERIOD_OPTIONS.includes(Number(periodLength)) && periodLength !== '')
  }, [periodLength])

  return (
    <>
      <View style={s.card}>
        <Text style={s.cardLabel}>Cycle length</Text>

        <View style={s.optionRow}>
          {CYCLE_OPTIONS.map((n) => (
            <Pressable
              key={n}
              style={[
                s.optionBtn,
                Number(cycleLength) === n && !showCustomCycle && s.optionSelected
              ]}
              onPress={() => {
                setCycleLength(n.toString())
                setShowCustomCycle(false)
              }}
            >
              <Text
                style={[
                  s.optionBtnText,
                  Number(cycleLength) === n && !showCustomCycle && s.optionSelectedText
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
              if (CYCLE_OPTIONS.includes(Number(cycleLength))) {
                setCycleLength('')
              }
            }}
          >
            <Text style={[s.optionBtnText, showCustomCycle && s.optionSelectedText]}>Custom</Text>
          </Pressable>
        </View>

        {showCustomCycle ? (
          <TextInput
            style={s.input}
            value={cycleLength}
            onChangeText={(v) => setCycleLength(v.replace(/[^0-9]/g, ''))}
            onBlur={() =>
              setCycleLength(clampNumber(cycleLength, LIMITS.cycle.min, LIMITS.cycle.max))
            }
            placeholder={`${LIMITS.cycle.min}–${LIMITS.cycle.max} days`}
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
          />
        ) : null}

        {errors.cycleLength ? <Text style={s.errorText}>{errors.cycleLength}</Text> : null}
      </View>

      <View style={s.card}>
        <Text style={s.cardLabel}>Period length</Text>

        <View style={s.optionRow}>
          {PERIOD_OPTIONS.map((n) => (
            <Pressable
              key={n}
              style={[
                s.optionBtn,
                Number(periodLength) === n && !showCustomPeriod && s.optionSelected
              ]}
              onPress={() => {
                setPeriodLength(n.toString())
                setShowCustomPeriod(false)
              }}
            >
              <Text
                style={[
                  s.optionBtnText,
                  Number(periodLength) === n && !showCustomPeriod && s.optionSelectedText
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
              if (PERIOD_OPTIONS.includes(Number(periodLength))) {
                setPeriodLength('')
              }
            }}
          >
            <Text style={[s.optionBtnText, showCustomPeriod && s.optionSelectedText]}>Custom</Text>
          </Pressable>
        </View>

        {showCustomPeriod ? (
          <TextInput
            style={s.input}
            value={periodLength}
            onChangeText={(v) => setPeriodLength(v.replace(/[^0-9]/g, ''))}
            onBlur={() =>
              setPeriodLength(clampNumber(periodLength, LIMITS.period.min, LIMITS.period.max))
            }
            placeholder={`${LIMITS.period.min}–${LIMITS.period.max} days`}
            placeholderTextColor={colors.textMuted}
            keyboardType="number-pad"
          />
        ) : null}

        {errors.periodLength ? <Text style={s.errorText}>{errors.periodLength}</Text> : null}
      </View>
    </>
  )
}
