import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { Brain, ChevronRight } from 'lucide-react-native'
import { makeHomeStyles } from '../../styles/screens/home'

type BodyInsightCardProps = {
  colors: any
  title: string
  message: string
}

export default function BodyInsightCard({
  colors,
  title,
  message,
}: BodyInsightCardProps) {
  const styles = makeHomeStyles(colors)
  const router = useRouter()

  return (
    <Pressable
      style={styles.intelligenceCard}
      onPress={() => router.push('/(tabs)/insights')}
    >
      <View style={styles.intelligenceIconWrap}>
        <Brain color={colors.accentRose} size={20} strokeWidth={1.8} />
      </View>

      <View style={styles.intelligenceBody}>
        <Text style={styles.intelligenceTitle}>{title}</Text>
        <Text style={styles.intelligenceDesc}>{message}</Text>
      </View>

      <ChevronRight color={colors.textMuted} size={20} strokeWidth={1.8} />
    </Pressable>
  )
}