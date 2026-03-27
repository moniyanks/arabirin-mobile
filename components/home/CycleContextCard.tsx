import React, { useMemo } from 'react'
import { View, Text } from 'react-native'
import { makeCycleContextCardStyles } from '../../styles/components/home/cycleContextCard'

type CycleContextCardProps = {
  colors: any
  cycleDay: number | null
  phaseLabel: string
  phaseSupportText: string
  nextPeriodText: string
}

export default function CycleContextCard({
  colors,
  cycleDay,
  phaseLabel,
  phaseSupportText,
  nextPeriodText,
}: CycleContextCardProps) {
  const styles = useMemo(() => makeCycleContextCardStyles(colors), [colors])

  return (
    <View style={styles.card}>
      <View style={styles.topRow}>
        <View style={styles.leftBlock}>
          <Text style={styles.eyebrow}>Your cycle today</Text>
          <Text style={styles.cycleDay}>
            {cycleDay ? `Day ${cycleDay}` : 'No cycle data'}
          </Text>
          <Text style={styles.phaseLabel}>{phaseLabel}</Text>
        </View>

        <View style={styles.rightBlock}>
          <Text style={styles.metaLabel}>Next period</Text>
          <Text style={styles.metaValue}>{nextPeriodText}</Text>
        </View>
      </View>

      <View style={styles.divider} />

      <Text style={styles.supportText}>
        A snapshot of where you are in your cycle today.
      </Text>
    </View>
  )
}