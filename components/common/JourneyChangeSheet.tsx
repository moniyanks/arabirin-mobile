import { useEffect, useMemo, useState } from 'react'
import { View, Text, Pressable, Modal, ActivityIndicator } from 'react-native'
import DateTimePicker from '@react-native-community/datetimepicker'
import { format } from 'date-fns'

import { useColors } from '../../styles'
import { makeJourneyChangeSheetStyles } from '../../styles/components/journeyChangeSheet'
import type { JourneyMode, JourneyTransitionInput } from '../../utils/journeyTransitionHelper'

type Props = {
  visible: boolean
  loading: boolean
  error: string
  currentMode: JourneyMode
  onClose: () => void
  onSubmit: (input: JourneyTransitionInput) => Promise<void> | void
}

type PendingMode = JourneyMode | null

export default function JourneyChangeSheet({
  visible,
  loading,
  error,
  currentMode,
  onClose,
  onSubmit
}: Props) {
  const colors = useColors()
  const s = useMemo(() => makeJourneyChangeSheetStyles(colors), [colors])

  const [pendingMode, setPendingMode] = useState<PendingMode>(null)
  const [showLmpPicker, setShowLmpPicker] = useState(false)
  const [lmpDate, setLmpDate] = useState(new Date())

  useEffect(() => {
    if (!visible) {
      setPendingMode(null)
      setShowLmpPicker(false)
      setLmpDate(new Date())
    }
  }, [visible])

  const lmpDateStr = format(lmpDate, 'yyyy-MM-dd')
  const lmpDateLabel = format(lmpDate, 'd MMMM yyyy')

  const handleBack = () => {
    setPendingMode(null)
  }

  const handleSave = async () => {
    if (!pendingMode) return

    if (pendingMode === 'pregnant') {
      await onSubmit({
        mode: 'pregnant',
        lmpDate: lmpDateStr
      })
      return
    }

    if (pendingMode === 'postpartum') {
      await onSubmit({
        mode: 'postpartum'
      })
      return
    }

    await onSubmit({
      mode: pendingMode
    })
  }

  const modeOption = (mode: JourneyMode, title: string, description?: string) => {
    const disabled = currentMode === mode

    return (
      <Pressable
        key={mode}
        onPress={() => {
          if (!disabled) setPendingMode(mode)
        }}
        disabled={disabled}
        style={[s.optionCard, disabled && s.optionCardDisabled]}
      >
        <Text style={s.optionTitle}>{title}</Text>
        {!!description && <Text style={s.optionText}>{description}</Text>}
      </Pressable>
    )
  }

  return (
    <Modal visible={visible} animationType="slide" transparent onRequestClose={onClose}>
      <View style={s.overlay}>
        <Pressable style={s.backdrop} onPress={onClose} />

        <View style={s.sheet}>
          <View style={s.handleWrap}>
            <View style={s.handle} />
          </View>

          <Text style={s.title}>My journey has changed</Text>
          <Text style={s.body}>
            Tell Àràbìrìn what feels true for you now. We’ll gently reshape your experience.
          </Text>

          {!pendingMode && (
            <View style={s.optionsList}>
              {modeOption('pregnant', 'I’m pregnant', 'Shift into pregnancy support and guidance')}

              {modeOption(
                'postpartum',
                'I’m postpartum now',
                'Move into recovery and return-to-cycle support'
              )}

              {modeOption(
                'ttc',
                'I’m trying to conceive',
                'Show fertility-focused guidance and timing insight'
              )}

              {modeOption(
                'cycle',
                'I’m tracking my cycle',
                'Focus on cycle patterns, phases, and symptoms'
              )}

              {modeOption(
                'healing',
                'I’m in a healing or recovery phase',
                'Support you gently through a different rhythm'
              )}

              {modeOption(
                'perimenopause',
                'I’m in perimenopause',
                'Reflect cycle shifts and changing symptoms'
              )}
            </View>
          )}

          {pendingMode === 'pregnant' && (
            <>
              <Text style={s.sectionTitle}>When did your last period start?</Text>

              <Pressable style={s.dateField} onPress={() => setShowLmpPicker(true)}>
                <Text style={s.dateFieldText}>{lmpDateLabel}</Text>
              </Pressable>

              {showLmpPicker && (
                <DateTimePicker
                  value={lmpDate}
                  mode="date"
                  display="default"
                  maximumDate={new Date()}
                  onChange={(_, date) => {
                    setShowLmpPicker(false)
                    if (date) setLmpDate(date)
                  }}
                />
              )}

              <Text style={s.helperText}>
                We’ll use this to shape your pregnancy timeline. You can refine it later.
              </Text>
            </>
          )}

          {!!error && <Text style={s.error}>{error}</Text>}

          {!!pendingMode && (
            <View style={s.actionRow}>
              <Pressable style={s.secondaryBtn} onPress={handleBack} disabled={loading}>
                <Text style={s.secondaryBtnText}>Back</Text>
              </Pressable>

              <Pressable
                style={[s.primaryBtn, loading && s.primaryBtnDisabled]}
                onPress={handleSave}
                disabled={loading}
              >
                {loading ? (
                  <ActivityIndicator color={colors.bgPrimary} />
                ) : (
                  <Text style={s.primaryBtnText}>Save</Text>
                )}
              </Pressable>
            </View>
          )}
        </View>
      </View>
    </Modal>
  )
}
