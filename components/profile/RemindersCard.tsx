import React from 'react'
import { View, Text, Switch } from 'react-native'
import { makeProfileStyles } from '../../styles/screens/profile'

type Props = {
  s: ReturnType<typeof makeProfileStyles>
  colors: any
  remindersEnabled: boolean
  savingReminders: boolean
  onToggle: (value: boolean) => void
}

export default function RemindersCard({
  s,
  colors,
  remindersEnabled,
  savingReminders,
  onToggle,
}: Props) {
  return (
    <>
      <Text style={s.sectionHeading}>Reminders</Text>

      <View style={s.card}>
        <View style={s.rowBetween}>
          <View style={s.appearanceTextWrap}>
            <Text style={s.cardTitle}>Gentle reminders</Text>
            <Text style={s.cardHint}>
              Receive thoughtful reminders to check in and track your journey.
            </Text>
          </View>

          <Switch
            value={remindersEnabled}
            onValueChange={onToggle}
            disabled={savingReminders}
            trackColor={{
              false: colors.borderRose,
              true: 'rgba(217,155,155,0.4)',
            }}
            thumbColor={remindersEnabled ? colors.accentRose : colors.bgPrimary}
          />
        </View>
      </View>
    </>
  )
}