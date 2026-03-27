import React from 'react'
import { View, Text, Pressable } from 'react-native'
import { useRouter } from 'expo-router'
import { makeHomeStyles } from '../../styles/screens/home'

type HomeHeaderProps = {
  colors: any
  firstLetter: string
}

export default function HomeHeader({
  colors,
  firstLetter,
}: HomeHeaderProps) {
  const styles = makeHomeStyles(colors)
  const router = useRouter()

  return (
    <>
      <View style={styles.topBar}>
        <View>
          <Text style={styles.logo}>Àràbìrín</Text>
          <Text style={styles.tagline}>BODY INTELLIGENCE FOR EVERY STAGE</Text>
        </View>

        <Pressable
          style={styles.avatar}
          onPress={() => router.push('/(tabs)/profile')}
        >
          <Text style={styles.avatarText}>{firstLetter}</Text>
        </Pressable>
      </View>
    </>
  )
}