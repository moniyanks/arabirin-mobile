import React from 'react'
import { View, Text } from 'react-native'
import { makeProfileStyles } from '../../styles/screens/profile'

type Props = {
  s: ReturnType<typeof makeProfileStyles>
  name: string
  modeLabel: string
  age: string
  height: string
  weight: string
  bmi: string | null
  bmiColor?: string
}

export default function Header({
  s,
  name,
  modeLabel,
  age,
  height,
  weight,
  bmi,
  bmiColor,
}: Props) {
  const firstLetter = name.charAt(0).toUpperCase() || 'A'

  return (
    <>
      <View style={s.avatarSection}>
        <View style={s.avatar}>
          <Text style={s.avatarLetter}>{firstLetter}</Text>
        </View>
        <Text style={s.avatarName}>{name}</Text>
        <Text style={s.avatarMode}>{modeLabel}</Text>
      </View>

      {bmi && (
        <View style={s.statsRow}>
          {[
            { label: 'Age', value: age ? `${age} yrs` : '—' },
            { label: 'Height', value: height ? `${height} cm` : '—' },
            { label: 'Weight', value: weight ? `${weight} kg` : '—' },
            { label: 'BMI', value: bmi, color: bmiColor },
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
    </>
  )
}