export class AppError extends Error {
  constructor(
    message: string,
    public readonly status: number = 500,
    public readonly code: string = 'INTERNAL_SERVER_ERROR',
    public readonly details?: unknown
  ) {
    super(message)
    this.name = 'AppError'
  }
}

export class NotFoundError extends AppError {
  constructor() {
    super('ไม่พบรายการแจ้งเหตุ', 404, 'INCIDENT_NOT_FOUND')
  }
}

export class ConflictError extends AppError {
  constructor(message: string, code = 'INVALID_STATUS_TRANSITION') {
    super(message, 409, code)
  }
}

export class ValidationError extends AppError {
  constructor(message: string, code = 'VALIDATION_ERROR', details?: unknown) {
    super(message, 400, code, details)
  }
}
