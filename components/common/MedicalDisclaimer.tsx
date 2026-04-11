import React from 'react'
import { View, Text } from 'react-native'
import { useColors } from '../../styles'
import { makeMedicalDisclaimerStyles } from '../../styles/components/common/medicalDisclaimer'

export default function MedicalDisclaimer() {
  const colors = useColors()
  const s = makeMedicalDisclaimerStyles(colors)

  return (
    <View style={s.wrap}>
      <Text style={s.text}>
        Àràbìrìn provides wellness and educational insights only. It does not provide medical
        advice, diagnosis, or treatment.
      </Text>
    </View>
  )
}
