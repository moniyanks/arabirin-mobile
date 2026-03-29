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

function getContextCopy(conditions: string[], mode: string) {
  const lower = conditions.map((c) => c.toLowerCase())

  if (lower.includes('fibroids')) {
    return {
      title: 'Others are navigating this too.',
      message:
        'Women with fibroids often share patterns of heavy flow, pressure, and fatigue. Explore how others are making sense of it.',
      footer: 'Find conversations that feel relevant to your experience.',
    }
  }

  if (lower.includes('pcos')) {
    return {
      title: 'Others are navigating this too.',
      message:
        'Many women with PCOS talk about irregular timing, body changes, and uncertainty. Explore stories that may feel familiar.',
      footer: 'Find conversations that meet you where you are.',
    }
  }

  if (lower.includes('endometriosis')) {
    return {
      title: 'Others are navigating this too.',
      message:
        'Pain, fatigue, and cycle disruption can feel isolating. Explore how others with endometriosis are navigating it.',
      footer: 'Find conversations that feel relevant to your experience.',
    }
  }

  if (mode === 'ttc') {
    return {
      title: 'You’re not navigating this alone.',
      message:
        'Explore stories, support, and conversations from women trying to understand their fertile rhythm.',
      footer: 'Find a circle that meets you where you are.',
    }
  }

  return {
    title: 'You’re not alone.',
    message:
      'Explore stories, support, and conversations that feel relevant to this season.',
    footer: 'Find a circle that meets you where you are.',
  }
}

export default function SistersPreviewCard({
  colors,
  conditions = [],
  mode = 'cycle',
}: SistersPreviewCardProps) {
  const styles = useMemo(() => makeSistersPreviewCardStyles(colors), [colors])
  const router = useRouter()

  const conditionDefinitions = getConditionDefinitions(conditions)
  const copy = getContextCopy(conditions, mode)

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

      <Text style={styles.title}>{copy.title}</Text>

      <Text style={styles.message}>{copy.message}</Text>
      {conditionDefinitions.length > 0 ? (
        <Text style={styles.contextLine}>
          Circles related to your experience
        </Text>
      ) : null}

      <View style={styles.topicRow}>
        {topics.map((topic) => (
          <View key={topic} style={styles.topicChip}>
            <Text style={styles.topicChipText}>{topic}</Text>
          </View>
        ))}
      </View>

      <View style={styles.footerRow}>
        <Text style={styles.footerText}>{copy.footer}</Text>
        <Text style={styles.cta}>Explore</Text>
      </View>
    </Pressable>
  )
}