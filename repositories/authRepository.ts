import { supabase } from '../lib/supabase'
import { AppError } from '../lib/errors/appError'

export type PostAuthRoute = '/(setup)/consent' | '/(setup)/onboarding' | '/(tabs)'

function normalizeEmail(email: string): string {
  return email.trim().toLowerCase()
}

function assertValidEmail(email: string): string {
  const normalized = normalizeEmail(email)

  const isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(normalized)

  if (!isValid) {
    throw new AppError({
      code: 'VALIDATION_ERROR',
      message: `Invalid email submitted: "${email}"`,
      userMessage: 'Please enter a valid email address.',
      retryable: false,
    })
  }

  return normalized
}

function assertValidOtp(token: string): string {
  const normalized = token.replace(/\D/g, '').slice(0, 6)

  if (normalized.length !== 6) {
    throw new AppError({
      code: 'VALIDATION_ERROR',
      message: 'OTP must be exactly 6 digits.',
      userMessage: 'Enter the 6-digit code from your email.',
      retryable: false,
    })
  }

  return normalized
}

export const authRepository = {
  async sendEmailOtp(email: string): Promise<string> {
    const normalizedEmail = assertValidEmail(email)

    const { error } = await supabase.auth.signInWithOtp({
      email: normalizedEmail,
    })

    if (error) {
      throw new AppError({
        code: 'AUTH_FAILED',
        message: 'Failed to send email OTP.',
        userMessage: error.message || 'We could not send your sign-in code.',
        cause: error,
        retryable: true,
      })
    }

    return normalizedEmail
  },

  async verifyEmailOtp(email: string, token: string): Promise<string> {
    const normalizedEmail = assertValidEmail(email)
    const normalizedToken = assertValidOtp(token)

    const { error } = await supabase.auth.verifyOtp({
      email: normalizedEmail,
      token: normalizedToken,
      type: 'email',
    })

    if (error) {
      throw new AppError({
        code: 'AUTH_FAILED',
        message: 'Failed to verify email OTP.',
        userMessage: 'Invalid or expired code. Please request a new one.',
        cause: error,
        retryable: true,
      })
    }

    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user?.id) {
      throw new AppError({
        code: 'AUTH_FAILED',
        message: 'OTP verification succeeded but no authenticated user was returned.',
        userMessage: 'Authentication failed. Please try again.',
        cause: userError,
        retryable: true,
      })
    }

    return user.id
  },

  async resolvePostAuthRoute(userId: string): Promise<PostAuthRoute> {
    const [{ data: consent, error: consentError }, { data: profile, error: profileError }] =
      await Promise.all([
        supabase
          .from('user_consents')
          .select('user_id')
          .eq('user_id', userId)
          .maybeSingle(),
        supabase
          .from('profiles')
          .select('id')
          .eq('id', userId)
          .maybeSingle(),
      ])

    if (consentError) {
      throw new AppError({
        code: 'DB_READ_FAILED',
        message: 'Failed to load user consent after auth.',
        userMessage: 'We could not load your account setup status.',
        cause: consentError,
        retryable: true,
      })
    }

    if (profileError) {
      throw new AppError({
        code: 'DB_READ_FAILED',
        message: 'Failed to load profile after auth.',
        userMessage: 'We could not load your account setup status.',
        cause: profileError,
        retryable: true,
      })
    }

    if (!consent) {
      return '/(setup)/consent'
    }

    if (!profile) {
      return '/(setup)/onboarding'
    }

    return '/(tabs)'
  },
}