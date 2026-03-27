import React from 'react'
import { View, Text, Pressable } from 'react-native'

type EmptyStateCardProps = {
  styles: any
  title: string
  description: string
  ctaLabel: string
  onPress: () => void
}

export default function EmptyStateCard({
  styles,
  title,
  description,
  ctaLabel,
  onPress,
}: EmptyStateCardProps) {
  return (
    <View style={styles.emptyStateCard}>
      <Text style={styles.emptyStateIcon}>◉</Text>
      <Text style={styles.emptyStateTitle}>{title}</Text>
      <Text style={styles.emptyStateDesc}>{description}</Text>

      <Pressable style={styles.emptyStateBtn} onPress={onPress}>
        <Text style={styles.emptyStateBtnText}>{ctaLabel} →</Text>
      </Pressable>
    </View>
  )
}