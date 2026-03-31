import React from 'react'
import { View, Text, TextInput, Pressable } from 'react-native'
import { makeProfileStyles } from '../../styles/screens/profile'

type Props = {
  s: ReturnType<typeof makeProfileStyles>
  colors: any
  editingName: boolean
  setEditingName: (value: boolean) => void
  name: string
  setName: (value: string) => void
  error?: string
}

export default function IdentityCard({
  s,
  colors,
  editingName,
  setEditingName,
  name,
  setName,
  error,
}: Props) {
  return (
    <View style={s.card}>
      <View style={s.cardRow}>
        <Text style={s.cardLabel}>Name</Text>
        <Pressable onPress={() => setEditingName(!editingName)}>
          <Text style={s.editBtn}>{editingName ? 'Cancel' : 'Edit'}</Text>
        </Pressable>
      </View>

      {editingName ? (
        <TextInput
          style={s.input}
          value={name}
          onChangeText={setName}
          placeholder="Your name"
          placeholderTextColor={colors.textMuted}
          maxLength={50}
          autoFocus
        />
      ) : (
        <Text style={s.cardValue}>{name}</Text>
      )}

      {error ? <Text style={s.errorText}>{error}</Text> : null}
    </View>
  )
}