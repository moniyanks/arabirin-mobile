export type AppErrorCode =
  | 'UNKNOWN'
  | 'AUTH_REQUIRED'
  | 'AUTH_FAILED'
  | 'NETWORK_ERROR'
  | 'DB_READ_FAILED'
  | 'DB_WRITE_FAILED'
  | 'VALIDATION_ERROR'
  | 'NOT_FOUND'
  | 'DATE_ERROR'
  | 'PERMISSION_DENIED'

export class AppError extends Error {
  public readonly code: AppErrorCode
  public readonly cause?: unknown
  public readonly userMessage: string
  public readonly retryable: boolean

  constructor(params: {
    code: AppErrorCode
    message: string
    userMessage?: string
    cause?: unknown
    retryable?: boolean
  }) {
    super(params.message)
    this.name = 'AppError'
    this.code = params.code
    this.cause = params.cause
    this.userMessage = params.userMessage ?? 'Something went wrong. Please try again.'
    this.retryable = params.retryable ?? false

    Object.setPrototypeOf(this, new.target.prototype)
  }
}

export function toAppError(error: unknown, fallback?: Partial<AppError>): AppError {
  if (error instanceof AppError) {
    return error
  }

  const message =
    error instanceof Error
      ? error.message
      : typeof fallback?.message === 'string' && fallback.message.trim().length > 0
        ? fallback.message
        : 'Unexpected error'

  return new AppError({
    code: fallback?.code ?? 'UNKNOWN',
    message,
    userMessage: fallback?.userMessage ?? 'Something went wrong. Please try again.',
    cause: error,
    retryable: fallback?.retryable ?? false
  })
}
