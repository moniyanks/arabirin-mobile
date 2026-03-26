import React, { useMemo } from 'react'
import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { makeSistersPreviewCardStyles } from '../../styles/components/home/sistersPreviewCard'
import { getConditionDefinitions } from '../../utils/conditions'
import { COMMUNITY_TOPIC_CATALOG } from '../../constants/communityTopics'

type SistersPreviewCardProps = {
  colors: any
  conditions?: string[]
  mode?: string
}

export default function SistersPreviewCard({
  colors,
  conditions = [],
  mode = 'cycle',
}: SistersPreviewCardProps) {
  const styles = useMemo(() => makeSistersPreviewCardStyles(colors), [colors])
  const router = useRouter()

  const conditionDefinitions = getConditionDefinitions(conditions)

  const fallbackTopicKeys =
    mode === 'ttc'
      ? ['trying_to_conceive', 'cycle_irregularity', 'painful_periods']
      : ['heavy_bleeding', 'painful_periods', 'cycle_irregularity']

  const fallbackTopics = fallbackTopicKeys.map(
    (key) => COMMUNITY_TOPIC_CATALOG[key as keyof typeof COMMUNITY_TOPIC_CATALOG].label
  )

  const topics =
    conditionDefinitions.length > 0
      ? conditionDefinitions.slice(0, 3).map((condition) => condition.circleTitle)
      : fallbackTopics

  return (
    <Pressable
      style={styles.card}
      onPress={() => router.push('/(tabs)/sisters')}
    >
      <Text style={styles.eyebrow}>Sister’s Circle</Text>

      <Text style={styles.title}>You are not navigating this alone.</Text>

      <Text style={styles.message}>
        Explore shared experiences, supportive conversations, and real stories from women navigating patterns that may feel familiar.
      </Text>

      <View style={styles.topicRow}>
        {topics.map((topic) => (
          <View key={topic} style={styles.topicChip}>
            <Text style={styles.topicChipText}>{topic}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>
          Enter the circle that feels most relevant today.
        </Text>
        <Text style={styles.cta}>Open</Text>
      </View>
    </Pressable>
  )
}