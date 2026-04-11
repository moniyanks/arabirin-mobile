import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { makeProfileStyles } from '../../styles/screens/profile'

const CONDITIONS = [
  { key: 'fibroids', label: 'Fibroids' },
  { key: 'endo', label: 'Endometriosis' },
  { key: 'pcos', label: 'PCOS' },
  { key: 'sickle_cell', label: 'Sickle cell' },
  { key: 'thalassemia', label: 'Thalassemia' }
]

type Props = {
  s: ReturnType<typeof makeProfileStyles>
  conditions: string[]
  setConditions: (value: string[]) => void
}

export default function ConditionsCard({ s, conditions, setConditions }: Props) {
  return (
    <View style={s.card}>
      <Text style={s.cardLabel}>Conditions</Text>
      <Text style={s.cardHint}>Select any conditions that are relevant to your journey.</Text>

      <View style={s.modeGrid}>
        {CONDITIONS.map((condition) => {
          const active = conditions.includes(condition.key)

          return (
            <Pressable
              key={condition.key}
              style={[s.modeBtn, active && s.modeBtnSelected]}
              onPress={() => {
                const updated = active
                  ? conditions.filter((x) => x !== condition.key)
                  : [...conditions, condition.key]

                setConditions(updated)
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
  )
}
