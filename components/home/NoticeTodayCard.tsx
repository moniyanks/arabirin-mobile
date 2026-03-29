import React from 'react'
import { View, Text, Pressable } from 'react-native'

type NoticeTodayCardProps = {
  styles: any
  items: string[]
  onPressCheckIn: () => void
  rhythm?: {
    count: number
    status: 'active' | 'grace' | 'inactive'
    hasCheckedInToday?: boolean
  }
}

export default function NoticeTodayCard({
  styles,
  items,
  rhythm,
  onPressCheckIn,
}: NoticeTodayCardProps) {
  if (!items.length) return null

  function getRhythmText(rhythm?: NoticeTodayCardProps['rhythm']) {
    if (!rhythm || rhythm.status === 'inactive' || rhythm.count === 0) {
      return null
    }

    if (rhythm.count === 1) {
      return '1 day in rhythm'
    }

    return `${rhythm.count} days in rhythm`
  }

  const rhythmText = getRhythmText(rhythm)
  const hasCheckedInToday = Boolean(rhythm?.hasCheckedInToday)

  const title = hasCheckedInToday ? 'You checked in today' : 'Check in today'
  const ctaLabel = hasCheckedInToday ? 'View' : 'Begin'

  return (
    <Pressable
      style={styles.checkInCard}
      onPress={onPressCheckIn}
    >
      <View style={styles.checkInContent}>
        <Text style={styles.checkInTitle}>{title}</Text>

        {rhythmText ? (
          <Text style={styles.checkInRhythm}>{rhythmText}</Text>
        ) : null}

        <View style={styles.checkInTags}>
          {items.map((item) => (
            <View key={item} style={styles.checkInTag}>
              <Text style={styles.checkInTagText}>{item}</Text>
            </View>
          ))}
        </View>
      </View>

      <Text style={styles.checkInCTA}>{ctaLabel}</Text>
    </Pressable>
  )
}