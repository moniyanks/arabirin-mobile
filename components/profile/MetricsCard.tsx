import React from 'react'
import { View, Text, TextInput } from 'react-native'
import { makeProfileStyles } from '../../styles/screens/profile'
import { clampNumber, LIMITS } from '../../utils/profileValidation'

type Props = {
  s: ReturnType<typeof makeProfileStyles>
  colors: any
  age: string
  height: string
  weight: string
  setAge: (value: string) => void
  setHeight: (value: string) => void
  setWeight: (value: string) => void
  errors: Record<string, string>
}

export default function MetricsCard({
  s,
  colors,
  age,
  height,
  weight,
  setAge,
  setHeight,
  setWeight,
  errors
}: Props) {
  return (
    <>
      <View style={s.card}>
        <Text style={s.cardLabel}>Age</Text>
        <TextInput
          style={s.input}
          value={age}
          onChangeText={(v) => setAge(v.replace(/[^0-9]/g, ''))}
          onBlur={() => setAge(clampNumber(age, LIMITS.age.min, LIMITS.age.max))}
          placeholder="Enter your age"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
        />
        {errors.age ? <Text style={s.errorText}>{errors.age}</Text> : null}
      </View>

      <View style={s.card}>
        <Text style={s.cardLabel}>Height (cm)</Text>
        <TextInput
          style={s.input}
          value={height}
          onChangeText={(v) => setHeight(v.replace(/[^0-9]/g, ''))}
          onBlur={() => setHeight(clampNumber(height, LIMITS.height.min, LIMITS.height.max))}
          placeholder="Enter your height in cm"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
        />
        {errors.height ? <Text style={s.errorText}>{errors.height}</Text> : null}
      </View>

      <View style={s.card}>
        <Text style={s.cardLabel}>Weight (kg)</Text>
        <TextInput
          style={s.input}
          value={weight}
          onChangeText={(v) => setWeight(v.replace(/[^0-9]/g, ''))}
          onBlur={() => setWeight(clampNumber(weight, LIMITS.weight.min, LIMITS.weight.max))}
          placeholder="Enter your weight in kg"
          placeholderTextColor={colors.textMuted}
          keyboardType="number-pad"
        />
        {errors.weight ? <Text style={s.errorText}>{errors.weight}</Text> : null}
      </View>
    </>
  )
}
