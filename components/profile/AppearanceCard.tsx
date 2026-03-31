import React from 'react'
import { View, Text, Switch } from 'react-native'
import { makeProfileStyles } from '../../styles/screens/profile'

type Props = {
  s: ReturnType<typeof makeProfileStyles>
  colors: any
  isDark: boolean
  onToggle: (value: boolean) => void
}

export default function AppearanceCard({ s, colors, isDark, onToggle }: Props) {
  return (
    <>
      <Text style={s.sectionHeading}>Appearance</Text>

      <View style={s.card}>
        <View style={s.rowBetween}>
          <View style={s.appearanceTextWrap}>
            <Text style={s.cardTitle}>Dark mode</Text>
            <Text style={s.cardHint}>Switch between light and dark appearance</Text>
          </View>

          <Switch
            value={isDark}
            onValueChange={onToggle}
            trackColor={{
              false: colors.borderRose,
              true: 'rgba(217,155,155,0.4)',
            }}
            thumbColor={isDark ? colors.accentRose : colors.bgPrimary}
          />
        </View>
      </View>
    </>
  )
}