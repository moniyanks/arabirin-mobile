import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { makeProfileStyles } from '../../styles/screens/profile'
import LegalNoticeCard from '../../components/common/LegalNoticeCard'

type Props = {
  s: ReturnType<typeof makeProfileStyles>
  saving: boolean
  showDeleteConfirm: boolean
  onLogout: () => void
  onDeleteData: () => void
}

export default function AccountCard({
  s,
  saving,
  showDeleteConfirm,
  onLogout,
  onDeleteData
}: Props) {
  return (
    <>
      <Text style={s.sectionHeading}>Account & data</Text>

      <View style={s.card}>
        <Text style={s.version}>Version 1.0.0</Text>
      </View>

      <LegalNoticeCard />

      <View style={s.card}>
        <Pressable style={s.logoutBtn} onPress={onLogout}>
          <Text style={s.logoutBtnText}>Log out</Text>
        </Pressable>

        <Pressable style={s.deleteBtn} onPress={onDeleteData} disabled={saving}>
          <Text style={s.deleteBtnText}>
            {showDeleteConfirm ? 'Tap again to confirm' : 'Delete my data'}
          </Text>
          <Text style={s.deleteWarning}>
            This permanently deletes your profile, cycle history, symptom logs, settings, and
            consent records, then signs you out.
          </Text>
          <Text style={s.deleteSupportText}>
            Need help with your account or data? Contact support at titayanks@gmail.com
          </Text>
        </Pressable>
      </View>
    </>
  )
}
