import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { type AppMode } from '../../constants/appMode'
import { makeProfileStyles } from '../../styles/screens/profile'

const MODES: Array<{ key: AppMode; label: string }> = [
  { key: 'cycle', label: 'Tracking my cycle' },
  { key: 'ttc', label: 'Trying to conceive' },
  { key: 'pregnant', label: 'Pregnant' },
  { key: 'postpartum', label: 'Postpartum' },
  { key: 'healing', label: 'Loss or recovery' },
  { key: 'perimenopause', label: 'Perimenopause' },
]

type Props = {
  s: ReturnType<typeof makeProfileStyles>
  mode: AppMode
  setMode: (value: AppMode) => void
}

export default function JourneyCard({ s, mode, setMode }: Props) {
  return (
    <View style={s.card}>
      <Text style={s.cardLabel}>Your journey</Text>
      <View style={s.modeGrid}>
        {MODES.map((m) => (
          <Pressable
            key={m.key}
            style={[s.modeBtn, mode === m.key && s.modeBtnSelected]}
            onPress={() => setMode(m.key)}
          >
            <Text style={[s.modeBtnText, mode === m.key && s.modeBtnTextSelected]}>
              {m.label}
            </Text>
          </Pressable>
        ))}
      </View>
    </View>
  )
}