import React, { useMemo } from 'react'
import { Pressable, View, Text } from 'react-native'
import { Sparkles, ChevronRight } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { makeHomeStyles } from '../../styles/screens/home'
import type { CheckInRhythmInsight } from '../../utils/streakHelper'

type BodyAwarenessCardProps = {
  colors: any
  rhythm: CheckInRhythmInsight
}

function getRhythmDisplayText(rhythm: CheckInRhythmInsight): string | null {
  if (rhythm.status === 'inactive' || rhythm.count === 0) {
    return null
  }

  if (rhythm.count === 1) {
    return '1 day in rhythm'
  }

  return `${rhythm.count} days in rhythm`
}

export default function BodyAwarenessCard({
  colors,
  rhythm,
}: BodyAwarenessCardProps) {
  const styles = useMemo(() => makeHomeStyles(colors), [colors])
  const router = useRouter()

  const isInactive = rhythm.status === 'inactive'
  const rhythmDisplayText = getRhythmDisplayText(rhythm)

  return (
    <Pressable
      onPress={() => router.push('/(tabs)/calendar')}
      style={({ pressed }) => [
        styles.awarenessCard,
        isInactive && styles.awarenessCardInactive,
        pressed && styles.awarenessCardPressed,
      ]}
      accessibilityRole="button"
      accessibilityLabel="Open today’s check-in"
      accessibilityHint="Takes you to the logging screen"
    >
      <View style={styles.awarenessIconWrap}>
        <Sparkles color={colors.accentRose} size={18} strokeWidth={1.8} />
      </View>

      <View style={styles.awarenessBody}>
        <Text style={styles.awarenessTitle}>{rhythm.title}</Text>

        {rhythmDisplayText ? (
          <Text style={styles.awarenessStreak}>{rhythmDisplayText}</Text>
        ) : null}

        <Text style={styles.awarenessSubtitle}>{rhythm.subtitle}</Text>
      </View>

      <ChevronRight color={colors.textMuted} size={18} strokeWidth={1.8} />
    </Pressable>
  )
}