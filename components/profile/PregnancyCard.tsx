import React, { useState } from 'react'
import { View, Text, Pressable } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { makeProfileStyles } from '../../styles/screens/profile'
import {
  formatDisplayDate,
  isValidDateOnly,
} from '../../utils/profileValidation'
import {
  calculateDueDateFromLmp,
  calculateLmpFromDueDate,
} from '../../utils/pregnancyHelper'
import type { PregnancyDatingMethod } from '../../services/profile'

type Props = {
  s: ReturnType<typeof makeProfileStyles>
  colors: any
  pregnancyDatingMethod: PregnancyDatingMethod
  pregnancyLmpDate: string
  pregnancyDueDate: string
  setPregnancyDatingMethod: (value: PregnancyDatingMethod) => void
  setPregnancyLmpDate: (value: string) => void
  setPregnancyDueDate: (value: string) => void
  errors: Record<string, string>
}

export default function PregnancyCard({
  s,
  colors,
  pregnancyDatingMethod,
  pregnancyLmpDate,
  pregnancyDueDate,
  setPregnancyDatingMethod,
  setPregnancyLmpDate,
  setPregnancyDueDate,
  errors,
}: Props) {
  const [showLmpPicker, setShowLmpPicker] = useState(false)
  const [showDueDatePicker, setShowDueDatePicker] = useState(false)

  const handleLmpChange = (value: string) => {
    setPregnancyLmpDate(value)
    setPregnancyDueDate(value && isValidDateOnly(value) ? calculateDueDateFromLmp(value) : '')
  }

  const handleDueDateChange = (value: string) => {
    setPregnancyDueDate(value)
    setPregnancyLmpDate(value && isValidDateOnly(value) ? calculateLmpFromDueDate(value) : '')
  }

  return (
    <View style={s.card}>
      <Text style={s.cardLabel}>Pregnancy timeline</Text>
      <Text style={s.cardHint}>
        Use the first day of your last period or your estimated due date. This helps
        Àràbìrín adapt your experience more thoughtfully.
      </Text>

      <View style={s.optionRow}>
        <Pressable
          style={[s.optionBtn, pregnancyDatingMethod === 'lmp' && s.optionSelected]}
          onPress={() => setPregnancyDatingMethod('lmp')}
        >
          <Text
            style={[
              s.optionBtnText,
              pregnancyDatingMethod === 'lmp' && s.optionSelectedText,
            ]}
          >
            Use last period
          </Text>
        </Pressable>

        <Pressable
          style={[s.optionBtn, pregnancyDatingMethod === 'edd' && s.optionSelected]}
          onPress={() => setPregnancyDatingMethod('edd')}
        >
          <Text
            style={[
              s.optionBtnText,
              pregnancyDatingMethod === 'edd' && s.optionSelectedText,
            ]}
          >
            Use due date
          </Text>
        </Pressable>
      </View>

      {pregnancyDatingMethod === 'lmp' ? (
        <>
          <Text style={[s.cardHint, { marginTop: 10 }]}>First day of your last period</Text>

          <Pressable style={s.input} onPress={() => setShowLmpPicker(true)}>
            <Text
              style={
                pregnancyLmpDate ? s.cardValue : [s.cardValue, { color: colors.textMuted }]
              }
            >
              {pregnancyLmpDate ? formatDisplayDate(pregnancyLmpDate) : 'Select a date'}
            </Text>
          </Pressable>

          {errors.pregnancyLmpDate ? (
            <Text style={s.errorText}>{errors.pregnancyLmpDate}</Text>
          ) : null}

          <Text style={[s.cardHint, { marginTop: 10 }]}>Estimated due date</Text>
          <Text style={s.cardValue}>
            {pregnancyDueDate ? formatDisplayDate(pregnancyDueDate) : 'Will appear once a valid date is entered'}
          </Text>
        </>
      ) : (
        <>
          <Text style={[s.cardHint, { marginTop: 10 }]}>Estimated due date</Text>

          <Pressable style={s.input} onPress={() => setShowDueDatePicker(true)}>
            <Text
              style={
                pregnancyDueDate ? s.cardValue : [s.cardValue, { color: colors.textMuted }]
              }
            >
              {pregnancyDueDate ? formatDisplayDate(pregnancyDueDate) : 'Select a date'}
            </Text>
          </Pressable>

          {errors.pregnancyDueDate ? (
            <Text style={s.errorText}>{errors.pregnancyDueDate}</Text>
          ) : null}

          {pregnancyLmpDate ? (
            <Text style={[s.cardHint, { marginTop: 10 }]}>
              We’ll estimate your pregnancy timeline from around {formatDisplayDate(pregnancyLmpDate)}.
            </Text>
          ) : null}
        </>
      )}

      {showLmpPicker ? (
        <DateTimePicker
          value={
            pregnancyLmpDate && isValidDateOnly(pregnancyLmpDate)
              ? new Date(`${pregnancyLmpDate}T00:00:00`)
              : new Date()
          }
          mode="date"
          display="default"
          maximumDate={new Date()}
          onChange={(_, selectedDate) => {
            setShowLmpPicker(false)
            if (!selectedDate) return

            const yyyy = selectedDate.getFullYear()
            const mm = String(selectedDate.getMonth() + 1).padStart(2, '0')
            const dd = String(selectedDate.getDate()).padStart(2, '0')
            handleLmpChange(`${yyyy}-${mm}-${dd}`)
          }}
        />
      ) : null}

      {showDueDatePicker ? (
        <DateTimePicker
          value={
            pregnancyDueDate && isValidDateOnly(pregnancyDueDate)
              ? new Date(`${pregnancyDueDate}T00:00:00`)
              : new Date()
          }
          mode="date"
          display="default"
          onChange={(_, selectedDate) => {
            setShowDueDatePicker(false)
            if (!selectedDate) return

            const yyyy = selectedDate.getFullYear()
            const mm = String(selectedDate.getMonth() + 1).padStart(2, '0')
            const dd = String(selectedDate.getDate()).padStart(2, '0')
            handleDueDateChange(`${yyyy}-${mm}-${dd}`)
          }}
        />
      ) : null}
    </View>
  )
}