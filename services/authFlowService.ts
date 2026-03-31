import { authRepository, type PostAuthRoute } from '../repositories/authRepository'
import { toAppError } from '../lib/errors/appError'

export const authFlowService = {
  async requestOtp(email: string): Promise<string> {
    try {
      return await authRepository.sendEmailOtp(email)
    } catch (error) {
      throw toAppError(error, {
        code: 'AUTH_FAILED',
        userMessage: 'We could not send your sign-in code.',
        retryable: true,
      })
    }
  },

  async verifyOtpAndResolveRoute(
    email: string,
    otp: string
  ): Promise<{ userId: string; route: PostAuthRoute }> {
    try {
      const userId = await authRepository.verifyEmailOtp(email, otp)
      const route = await authRepository.resolvePostAuthRoute(userId)

      return { userId, route }
    } catch (error) {
      throw toAppError(error, {
        code: 'AUTH_FAILED',
        userMessage: 'We could not verify your sign-in code.',
        retryable: true,
      })
    }
  },
}