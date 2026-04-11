import { useState, useMemo } from 'react'
import { View, Text, Pressable, ScrollView, ActivityIndicator, Alert } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { useRouter } from 'expo-router'
import { X, Pencil, Trash2, Plus } from 'lucide-react-native'
import { format, parseISO } from 'date-fns'
import DateTimePicker from '@react-native-community/datetimepicker'
import { useColors } from '../../styles'
import { makePeriodsStyles } from '../../styles/screens/periods'
import { useAppData } from '../../context/AppDataContext'
import type { Period } from '../../types/appData'

type EditingPeriod = {
  id: string
  startDate: Date
  endDate: Date
  field: 'start' | 'end' | null
}

export default function PeriodsScreen() {
  const colors = useColors()
  const s = useMemo(() => makePeriodsStyles(colors), [colors])
  const router = useRouter()
  const { periods, updatePeriod, deletePeriod, addPeriod, periodLength } = useAppData()

  const [editing, setEditing] = useState<EditingPeriod | null>(null)
  const [saving, setSaving] = useState(false)
  const [showPicker, setShowPicker] = useState(false)
  const [addingNew, setAddingNew] = useState(false)
  const [newStart, setNewStart] = useState(new Date())
  const [showNewPicker, setShowNewPicker] = useState(false)

  const sorted = useMemo(
    () => [...periods].sort((a, b) => b.startDate.localeCompare(a.startDate)),
    [periods]
  )

  const getDuration = (p: Period) => {
    if (!p.endDate) return '—'
    const days =
      Math.round((parseISO(p.endDate).getTime() - parseISO(p.startDate).getTime()) / 86400000) + 1
    return `${days} days`
  }

  const handleEdit = (p: Period) => {
    setEditing({
      id: p.id,
      startDate: parseISO(p.startDate),
      endDate: p.endDate ? parseISO(p.endDate) : parseISO(p.startDate),
      field: null
    })
  }

  const handleSave = async () => {
    if (!editing) return
    setSaving(true)
    try {
      await updatePeriod(
        editing.id,
        format(editing.startDate, 'yyyy-MM-dd'),
        format(editing.endDate, 'yyyy-MM-dd')
      )
      setEditing(null)
    } finally {
      setSaving(false)
    }
  }

  const handleDelete = (p: Period) => {
    Alert.alert(
      'Delete period',
      `Delete the period starting ${format(parseISO(p.startDate), 'd MMM yyyy')}? This cannot be undone.`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            setSaving(true)
            try {
              await deletePeriod(p.id)
            } finally {
              setSaving(false)
            }
          }
        }
      ]
    )
  }

  const handleAddNew = async () => {
    setSaving(true)
    try {
      await addPeriod(format(newStart, 'yyyy-MM-dd'))
      setAddingNew(false)
      setNewStart(new Date())
    } finally {
      setSaving(false)
    }
  }

  return (
    <SafeAreaView style={s.safe} edges={['top', 'bottom']}>
      <View style={s.topBar}>
        <View>
          <Text style={s.topBarTitle}>Period History</Text>
          <Text style={s.topBarSub}>{periods.length} periods logged</Text>
        </View>
        <Pressable style={s.closeBtn} onPress={() => router.back()}>
          <X color={colors.textMuted} size={20} strokeWidth={1.5} />
        </Pressable>
      </View>

      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
      >
        {/* Add new period */}
        {!addingNew ? (
          <Pressable style={s.addBtn} onPress={() => setAddingNew(true)}>
            <Plus color={colors.accentRose} size={18} strokeWidth={1.5} />
            <Text style={s.addBtnText}>Add a past period</Text>
          </Pressable>
        ) : (
          <View style={s.addCard}>
            <Text style={s.addCardTitle}>Add a period</Text>
            <Text style={s.addCardLabel}>Start date</Text>
            <Pressable style={s.dateField} onPress={() => setShowNewPicker(true)}>
              <Text style={s.dateFieldText}>{format(newStart, 'd MMMM yyyy')}</Text>
            </Pressable>

            {showNewPicker && (
              <DateTimePicker
                value={newStart}
                mode="date"
                display="default"
                maximumDate={new Date()}
                onChange={(_, date) => {
                  setShowNewPicker(false)
                  if (date) setNewStart(date)
                }}
              />
            )}

            <Text style={s.addCardHint}>
              End date will be calculated using your period length ({periodLength} days)
            </Text>

            <View style={s.addCardBtns}>
              <Pressable
                style={s.cancelBtn}
                onPress={() => {
                  setAddingNew(false)
                  setNewStart(new Date())
                }}
              >
                <Text style={s.cancelBtnText}>Cancel</Text>
              </Pressable>
              <Pressable
                style={[s.saveBtn, saving && s.saveBtnDisabled]}
                onPress={handleAddNew}
                disabled={saving}
              >
                {saving ? (
                  <ActivityIndicator color={colors.bgPrimary} size="small" />
                ) : (
                  <Text style={s.saveBtnText}>Add period</Text>
                )}
              </Pressable>
            </View>
          </View>
        )}

        {/* Period list */}
        {sorted.length === 0 ? (
          <View style={s.emptyState}>
            <Text style={s.emptyText}>No periods logged yet.</Text>
            <Text style={s.emptySubtext}>Log your first period from the Calendar tab.</Text>
          </View>
        ) : (
          sorted.map((p) => (
            <View key={p.id}>
              {editing?.id === p.id ? (
                <View style={s.editCard}>
                  <Text style={s.editCardTitle}>Edit period</Text>

                  <Text style={s.editLabel}>Start date</Text>
                  <Pressable
                    style={s.dateField}
                    onPress={() => {
                      setEditing({ ...editing, field: 'start' })
                      setShowPicker(true)
                    }}
                  >
                    <Text style={s.dateFieldText}>{format(editing.startDate, 'd MMMM yyyy')}</Text>
                  </Pressable>

                  <Text style={s.editLabel}>End date</Text>
                  <Pressable
                    style={s.dateField}
                    onPress={() => {
                      setEditing({ ...editing, field: 'end' })
                      setShowPicker(true)
                    }}
                  >
                    <Text style={s.dateFieldText}>{format(editing.endDate, 'd MMMM yyyy')}</Text>
                  </Pressable>

                  {showPicker && (
                    <DateTimePicker
                      value={editing.field === 'start' ? editing.startDate : editing.endDate}
                      mode="date"
                      display="default"
                      maximumDate={new Date()}
                      onChange={(_, date) => {
                        setShowPicker(false)
                        if (!date || !editing) return
                        if (editing.field === 'start') {
                          setEditing({ ...editing, startDate: date, field: null })
                        } else {
                          setEditing({ ...editing, endDate: date, field: null })
                        }
                      }}
                    />
                  )}

                  <View style={s.addCardBtns}>
                    <Pressable style={s.cancelBtn} onPress={() => setEditing(null)}>
                      <Text style={s.cancelBtnText}>Cancel</Text>
                    </Pressable>
                    <Pressable
                      style={[s.saveBtn, saving && s.saveBtnDisabled]}
                      onPress={handleSave}
                      disabled={saving}
                    >
                      {saving ? (
                        <ActivityIndicator color={colors.bgPrimary} size="small" />
                      ) : (
                        <Text style={s.saveBtnText}>Save</Text>
                      )}
                    </Pressable>
                  </View>
                </View>
              ) : (
                <View style={s.periodCard}>
                  <View style={s.periodCardLeft}>
                    <Text style={s.periodStart}>{format(parseISO(p.startDate), 'd MMM yyyy')}</Text>
                    <Text style={s.periodEnd}>
                      {p.endDate
                        ? `to ${format(parseISO(p.endDate), 'd MMM yyyy')}`
                        : 'End date not set'}
                    </Text>
                    <Text style={s.periodDuration}>{getDuration(p)}</Text>
                  </View>

                  <View style={s.periodCardActions}>
                    <Pressable style={s.actionBtn} onPress={() => handleEdit(p)}>
                      <Pencil color={colors.textMuted} size={16} strokeWidth={1.5} />
                    </Pressable>
                    <Pressable style={s.actionBtn} onPress={() => handleDelete(p)}>
                      <Trash2 color={colors.accentRose} size={16} strokeWidth={1.5} />
                    </Pressable>
                  </View>
                </View>
              )}
            </View>
          ))
        )}
      </ScrollView>
    </SafeAreaView>
  )
}
