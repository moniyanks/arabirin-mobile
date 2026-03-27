import React from 'react'
import { View, Text } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import type { HomeViewModel } from '../../features/home/types'

const RING_SIZE = 210
const STROKE_WIDTH = 16
const RADIUS = (RING_SIZE - STROKE_WIDTH) / 2
const CIRCUMFERENCE = 2 * Math.PI * RADIUS

type HeroSectionProps = {
  styles: any
  colors: any
  hero: HomeViewModel['hero']
}

export default function HeroSection({
  styles,
  colors,
  hero,
}: HeroSectionProps) {
  if (!hero) return null

  if (hero.kind === 'cycle') {
    const ringProgress = hero.ringProgress ?? 0
    const strokeDashoffset = CIRCUMFERENCE * (1 - ringProgress)
    const showPeriodDay =
      hero.title.toLowerCase().includes('cycle day') === false &&
      hero.ringLabel?.toLowerCase() !== 'today'

    return (
      <View style={styles.ringHeroCard}>
        <View style={styles.phaseBadge}>
          <Text style={styles.phaseBadgeText}>{hero.badge}</Text>
        </View>

        <View style={styles.ringWrap}>
          <Svg width={RING_SIZE} height={RING_SIZE}>
            <Circle
              stroke={colors.borderRose}
              fill="none"
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
            />
            <Circle
              stroke={colors.accentRose}
              fill="none"
              cx={RING_SIZE / 2}
              cy={RING_SIZE / 2}
              r={RADIUS}
              strokeWidth={STROKE_WIDTH}
              strokeDasharray={`${CIRCUMFERENCE} ${CIRCUMFERENCE}`}
              strokeDashoffset={strokeDashoffset}
              strokeLinecap="round"
              transform={`rotate(-90, ${RING_SIZE / 2}, ${RING_SIZE / 2})`}
            />
          </Svg>

          <View style={styles.ringCenter}>
            {showPeriodDay ? (
              <>
                <Text style={styles.ringCenterValue}>{hero.title}</Text>
                {!!hero.ringLabel && (
                  <Text style={styles.ringCenterSubLabel}>{hero.ringLabel}</Text>
                )}
              </>
            ) : (
              <Text style={styles.ringCenterValueAlt}>{hero.ringLabel || 'Today'}</Text>
            )}
          </View>
        </View>

        {!!hero.subtitle && <Text style={styles.heroMessage}>{hero.subtitle}</Text>}
        {!!hero.meta && <Text style={styles.heroMessage}>{hero.meta}</Text>}
      </View>
    )
  }

  if (hero.kind === 'ttc') {
    return (
      <View style={styles.heroCard}>
        <View style={styles.phaseBadge}>
          <Text style={styles.phaseBadgeText}>{hero.badge}</Text>
        </View>

        <Text style={styles.heroTitle}>{hero.title}</Text>

        {!!hero.subtitle && <Text style={styles.heroMessage}>{hero.subtitle}</Text>}
        {!!hero.meta && <Text style={styles.heroMessage}>{hero.meta}</Text>}

        {!!hero.confidenceLabel && (
          <View style={styles.confidencePill}>
            <Text style={styles.confidenceText}>{hero.confidenceLabel}</Text>
          </View>
        )}
      </View>
    )
  }

  return (
    <View style={styles.heroCard}>
      <View style={styles.phaseBadge}>
        <Text style={styles.phaseBadgeText}>{hero.badge}</Text>
      </View>

      <Text style={styles.heroTitle}>{hero.title}</Text>

      {!!hero.subtitle && <Text style={styles.heroMessage}>{hero.subtitle}</Text>}
      {!!hero.meta && <Text style={styles.heroMessage}>{hero.meta}</Text>}
    </View>
  )
}