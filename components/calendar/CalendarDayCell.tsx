import { Pressable, Text, View, StyleSheet } from 'react-native'
import Svg, { Circle } from 'react-native-svg'
import { theme } from '../../styles'

const SIZE = 40
const OUTER_SIZE = 44
const CENTER = OUTER_SIZE / 2
const RADIUS_SELECTED = 20
const RADIUS_TODAY = 17
const RADIUS_PREDICTED = 15

type Props = {
  dayNumber: string
  inCurrentMonth: boolean
  isToday: boolean
  isSelected: boolean
  isPeriod: boolean
  isPredictedPeriod: boolean
  isFertile: boolean
  isOvulation: boolean
  colors: any
  onPress: () => void
}

export function CalendarDayCell({
  dayNumber,
  inCurrentMonth,
  isToday,
  isSelected,
  isPeriod,
  isPredictedPeriod,
  isFertile,
  isOvulation,
  colors,
  onPress
}: Props) {
  const textColor = isPeriod || isOvulation ? colors.bgPrimary : colors.textPrimary

  const fillStyle = [
    styles.fill,
    isPeriod && { backgroundColor: colors.accentRose },
    !isPeriod && isOvulation && { backgroundColor: colors.accentSage },
    !isPeriod &&
      !isOvulation &&
      isFertile && {
        backgroundColor: 'rgba(155, 168, 141, 0.18)'
      }
  ]

  return (
    <Pressable style={styles.wrap} onPress={onPress}>
      <View style={styles.outer}>
        {(isPredictedPeriod || isToday || isSelected) && (
          <Svg width={OUTER_SIZE} height={OUTER_SIZE} style={StyleSheet.absoluteFill}>
            {isPredictedPeriod && !isPeriod && (
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS_PREDICTED}
                fill="none"
                stroke={colors.accentRose}
                strokeWidth={1.5}
                strokeDasharray="3 3"
                opacity={0.85}
              />
            )}

            {isToday && (
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS_TODAY}
                fill="none"
                stroke={colors.accentRose}
                strokeWidth={1.5}
              />
            )}

            {isSelected && (
              <Circle
                cx={CENTER}
                cy={CENTER}
                r={RADIUS_SELECTED}
                fill="none"
                stroke={colors.accentRose}
                strokeWidth={2}
              />
            )}
          </Svg>
        )}

        <View style={fillStyle} />
        <Text style={[styles.dayText, { color: textColor }, !inCurrentMonth && { opacity: 0.35 }]}>
          {dayNumber}
        </Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  wrap: {
    width: '14.285%',
    paddingVertical: 6,
    alignItems: 'center'
  },
  outer: {
    width: OUTER_SIZE,
    height: OUTER_SIZE,
    alignItems: 'center',
    justifyContent: 'center'
  },
  fill: {
    position: 'absolute',
    width: SIZE,
    height: SIZE,
    borderRadius: SIZE / 2,
    backgroundColor: 'transparent'
  },
  dayText: {
    fontFamily: theme.fonts.sans,
    fontSize: 14
  }
})
