import React, { useMemo } from 'react'
import { Pressable, View, Text } from 'react-native'
import { Sparkles, ChevronRight } from 'lucide-react-native'
import { useRouter } from 'expo-router'
import { makeHomeStyles } from '../../styles/screens/home'
import type { StreakInsight } from '../../utils/streakHelper'

type BodyAwarenessCardProps = {
  colors: any
  streak: StreakInsight
}

function getStreakDisplayText(streak: StreakInsight): string | null {
  if (streak.status === 'inactive' || streak.count === 0) {
    return null
  }

  if (streak.count === 1) {
    return '1 day of body awareness'
  }

  return `${streak.count} days of body awareness`
}

export default function BodyAwarenessCard({
  colors,
  streak,
}: BodyAwarenessCardProps) {
  const styles = useMemo(() => makeHomeStyles(colors), [colors])
  const router = useRouter()

  const isInactive = streak.status === 'inactive'
  const streakDisplayText = getStreakDisplayText(streak)

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
        <Text style={styles.awarenessTitle}>{streak.title}</Text>

        {streakDisplayText ? (
          <Text style={styles.awarenessStreak}>{streakDisplayText}</Text>
        ) : null}

        <Text style={styles.awarenessSubtitle}>{streak.subtitle}</Text>
      </View>

      <ChevronRight color={colors.textMuted} size={18} strokeWidth={1.8} />
    </Pressable>
  )
}