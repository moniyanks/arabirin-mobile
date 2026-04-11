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

function normalizeBadgeLabel(value: string | null | undefined): string {
  const base = (value ?? '').trim()
  if (!base) return 'Cycle phase'
  if (base.toLowerCase().includes('phase')) return base
  return `${base} phase`
}

function extractCycleDay(title?: string | null, ringLabel?: string | null): number | null {
  const candidates = [ringLabel ?? '', title ?? '']

  for (const candidate of candidates) {
    const match = candidate.match(/\b(\d+)\b/)
    if (match) {
      const value = Number(match[1])
      if (Number.isInteger(value) && value > 0) {
        return value
      }
    }
  }

  return null
}

function getCenterLabel(title?: string | null, ringLabel?: string | null): string {
  const day = extractCycleDay(title, ringLabel)

  if (day !== null) {
    return `Day ${day}`
  }

  if ((ringLabel ?? '').trim()) {
    return String(ringLabel).trim()
  }

  return 'Today'
}

export default function HeroSection({ styles, colors, hero }: HeroSectionProps) {
  if (!hero) return null

  if (hero.kind === 'cycle') {
    const ringProgress = Math.max(0, Math.min(hero.ringProgress ?? 0, 1))
    const strokeDashoffset = CIRCUMFERENCE * (1 - ringProgress)
    const phaseLabel = normalizeBadgeLabel(hero.badge)
    const centerLabel = getCenterLabel(hero.title, hero.ringLabel)

    return (
      <View style={styles.ringHeroCard}>
        <View style={styles.phaseBadge}>
          <Text style={styles.phaseBadgeText}>{phaseLabel}</Text>
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
            <Text style={styles.ringCenterValueAlt}>{centerLabel}</Text>
          </View>
        </View>

        {!!hero.meta && (
          <View style={styles.predictionRow}>
            <View>
              <Text style={styles.predictionLabel}>Next period</Text>
              <Text style={styles.predictionDate}>{hero.meta.replace('Next period: ', '')}</Text>
            </View>
          </View>
        )}

        {!!hero.subtitle && <Text style={styles.heroMessage}>{hero.subtitle}</Text>}
      </View>
    )
  }

  if (hero.kind === 'ttc') {
    return (
      <View style={styles.heroCard}>
        <View style={styles.phaseBadge}>
          <Text style={styles.phaseBadgeText}>{normalizeBadgeLabel(hero.badge)}</Text>
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
        <Text style={styles.phaseBadgeText}>{normalizeBadgeLabel(hero.badge)}</Text>
      </View>

      <Text style={styles.heroTitle}>{hero.title}</Text>

      {!!hero.subtitle && <Text style={styles.heroMessage}>{hero.subtitle}</Text>}
      {!!hero.meta && <Text style={styles.heroMessage}>{hero.meta}</Text>}
    </View>
  )
}
