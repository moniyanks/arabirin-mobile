import { useEffect, useMemo, useState } from 'react'
import { View, Text, Pressable, ScrollView, TextInput } from 'react-native'
import { SafeAreaView } from 'react-native-safe-area-context'
import { AlertCircle } from 'lucide-react-native'
import { useColors } from '../../styles'
import { makeSistersStyles } from '../../styles/screens/sisters'
import { useAppData } from '../../context/AppDataContext'
import { resolveConditionAwareCircles } from '../../features/sisters/resolveConditionAwareCircles'
import {
  resolveSistersCircleContent,
  type SistersCircleKey
} from '../../features/sisters/sistersContent'
import { sistersRepository } from '../../repositories/sistersRepository'
import type { SistersReflectionRecord } from '../../types/sisters'

type SaveState = 'idle' | 'saving' | 'saved' | 'error'

export default function SistersScreen() {
  const colors = useColors()
  const s = useMemo(() => makeSistersStyles(colors), [colors])
  const { profile } = useAppData()

  const prioritizedConditions = profile?.conditions ?? []

  const circles = useMemo(
    () => resolveConditionAwareCircles(prioritizedConditions),
    [prioritizedConditions]
  )

  const [activeCircle, setActiveCircle] = useState<SistersCircleKey>('all')
  const [reflectionDraft, setReflectionDraft] = useState('')
  const [saveState, setSaveState] = useState<SaveState>('idle')
  const [savedReflections, setSavedReflections] = useState<SistersReflectionRecord[]>([])

  const activeCircleContent = useMemo(
    () => resolveSistersCircleContent(activeCircle, prioritizedConditions),
    [activeCircle, prioritizedConditions]
  )

  const activeCircleLabel =
    circles.find((circle) => circle.key === activeCircle)?.label ?? activeCircleContent.label

  const trimmedReflection = reflectionDraft.trim()
  const canSaveReflection = trimmedReflection.length >= 20

  useEffect(() => {
    let isMounted = true

    const loadReflections = async () => {
      try {
        const reflections = await sistersRepository.listReflections(activeCircle)

        if (isMounted) {
          setSavedReflections(reflections)
        }
      } catch {
        if (isMounted) {
          setSavedReflections([])
        }
      }
    }

    void loadReflections()

    return () => {
      isMounted = false
    }
  }, [activeCircle])

  const handleSaveReflection = async () => {
    if (!canSaveReflection) {
      return
    }

    setSaveState('saving')

    try {
      const savedReflection = await sistersRepository.saveReflection({
        circleKey: activeCircle,
        reflectionText: trimmedReflection
      })

      setSavedReflections((prev) => [savedReflection, ...prev])
      setReflectionDraft('')
      setSaveState('saved')
    } catch {
      setSaveState('error')
    }
  }

  return (
    <SafeAreaView style={s.safe} edges={['top']}>
      <ScrollView
        style={s.container}
        contentContainerStyle={s.content}
        showsVerticalScrollIndicator={false}
        keyboardShouldPersistTaps="handled"
      >
        <View style={s.header}>
          <Text style={s.title}>Sisters Circle</Text>
          <Text style={s.subtitle}>
            Condition-aware support rooted in lived experience, reflection, and shared
            understanding.
          </Text>
        </View>

        <View style={s.disclaimer}>
          <AlertCircle color={colors.textMuted} size={15} strokeWidth={1.5} />
          <Text style={s.disclaimerText}>
            Sisters Circle is for peer support only. It is not medical advice and does not
            replace care from a qualified healthcare provider.
          </Text>
        </View>

        <View style={s.introCard}>
          <Text style={s.introTitle}>{activeCircleContent.title}</Text>
          <Text style={s.introText}>{activeCircleContent.description}</Text>
          <Text style={s.introFootnote}>
            This space is designed for thoughtful stories, respectful honesty, and support
            that helps women feel less alone.
          </Text>
        </View>

        <Text style={s.sectionLabel}>Explore circles</Text>
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={s.circlesRow}
        >
          {circles.map((circle) => (
            <Pressable
              key={circle.key}
              style={[s.circleBtn, activeCircle === circle.key && s.circleBtnActive]}
              onPress={() => {
                setActiveCircle(circle.key as SistersCircleKey)
                setSaveState('idle')
              }}
            >
              <Text
                style={[
                  s.circleBtnText,
                  activeCircle === circle.key && s.circleBtnTextActive
                ]}
              >
                {circle.label}
              </Text>
            </Pressable>
          ))}
        </ScrollView>

        <Text style={s.sectionLabel}>Guided prompts</Text>
        <View style={s.emptyState}>
          <Text style={s.emptyIcon}>◌</Text>
          <Text style={s.emptyTitle}>Start with one of these prompts</Text>
          <Text style={s.emptyText}>
            These prompts are here to help women share more clearly and safely in{' '}
            {activeCircleLabel}.
          </Text>
          <Text style={s.emptyFootnote}>
            You do not need to answer everything. One honest reflection is enough.
          </Text>
        </View>

        {activeCircleContent.prompts.map((prompt, index) => (
          <View key={`${activeCircleContent.key}-prompt-${index}`} style={s.introCard}>
            <Text style={s.introTitle}>Prompt {index + 1}</Text>
            <Text style={s.introText}>{prompt}</Text>
          </View>
        ))}

        <Text style={s.sectionLabel}>Community reflections</Text>
        {savedReflections.length > 0 ? (
          savedReflections.map((reflection) => (
            <View key={reflection.id} style={s.introCard}>
              <Text style={s.introTitle}>Your reflection</Text>
              <Text style={s.introText}>{reflection.reflection_text}</Text>
              <Text style={s.introFootnote}>
                Saved {new Date(reflection.created_at).toLocaleDateString()}
              </Text>
            </View>
          ))
        ) : (
          <View style={s.emptyState}>
            <Text style={s.emptyIcon}>◌</Text>
            <Text style={s.emptyTitle}>No reflections yet</Text>
            <Text style={s.emptyText}>
              Be one of the first to share a thoughtful reflection in {activeCircleLabel}.
            </Text>
            <Text style={s.emptyFootnote}>
              Real reflections will appear here once members start contributing.
            </Text>
          </View>
        )}

        <Text style={s.sectionLabel}>Share a reflection</Text>
        <TextInput
          style={s.reflectionInput}
          value={reflectionDraft}
          onChangeText={(value) => {
            setReflectionDraft(value)
            if (saveState !== 'idle') {
              setSaveState('idle')
            }
          }}
          placeholder="Write about what changed, what felt hard, or what helped..."
          placeholderTextColor={colors.textMuted}
          multiline
        />

        {saveState === 'error' && (
          <Text style={s.errorText}>
            We could not save your reflection right now. Please try again.
          </Text>
        )}

        <Pressable
          style={[s.waitlistBtn, !canSaveReflection && s.waitlistBtnDisabled]}
          onPress={handleSaveReflection}
          disabled={!canSaveReflection || saveState === 'saving'}
        >
          <Text style={s.waitlistBtnText}>
            {saveState === 'saving' ? 'Saving...' : 'Save my reflection'}
          </Text>
        </Pressable>

        {saveState === 'saved' && (
          <View style={s.successCard}>
            <Text style={s.successIcon}>◉</Text>
            <Text style={s.successTitle}>Reflection saved</Text>
            <Text style={s.successDesc}>
              Your reflection is now part of your Sisters experience.
            </Text>
          </View>
        )}
      </ScrollView>
    </SafeAreaView>
  )
}