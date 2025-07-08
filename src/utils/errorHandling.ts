/**
 * Standardized Error Handling for QuantumVest Platform
 * Replaces all 'catch (error: any)' patterns with proper typed errors
 */

import { AppError, ErrorContext } from "../types/common";

// Base error class for all application errors
export class AppErrorBase extends Error {
  public readonly code: string;
  public readonly severity: "info" | "warning" | "error" | "critical";
  public readonly timestamp: Date;
  public readonly context: ErrorContext;
  public readonly userId?: string;
  public readonly sessionId?: string;

  constructor(
    code: string,
    message: string,
    severity: "info" | "warning" | "error" | "critical" = "error",
    context: ErrorContext = {},
    userId?: string,
    sessionId?: string,
  ) {
    super(message);
    this.name = "AppError";
    this.code = code;
    this.severity = severity;
    this.timestamp = new Date();
    this.context = context;
    this.userId = userId;
    this.sessionId = sessionId;

    // Maintains proper stack trace for where error was thrown (Node.js only)
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, AppErrorBase);
    }
  }

  toJSON(): AppError {
    return {
      code: this.code,
      message: this.message,
      severity: this.severity,
      timestamp: this.timestamp,
      userId: this.userId,
      sessionId: this.sessionId,
      stack: this.stack,
      context: this.context,
    };
  }
}

// Specific error classes for different domains
export class AuthenticationError extends AppErrorBase {
  constructor(message: string, context: ErrorContext = {}, userId?: string) {
    super("AUTH_ERROR", message, "error", context, userId);
    this.name = "AuthenticationError";
  }
}

export class AuthorizationError extends AppErrorBase {
  constructor(message: string, context: ErrorContext = {}, userId?: string) {
    super("AUTHZ_ERROR", message, "error", context, userId);
    this.name = "AuthorizationError";
  }
}

export class ValidationError extends AppErrorBase {
  public readonly field?: string;
  public readonly value?: unknown;

  constructor(
    message: string,
    field?: string,
    value?: unknown,
    context: ErrorContext = {},
  ) {
    super("VALIDATION_ERROR", message, "warning", context);
    this.name = "ValidationError";
    this.field = field;
    this.value = value;
  }
}

export class PaymentError extends AppErrorBase {
  public readonly provider?: string;
  public readonly transactionId?: string;

  constructor(
    message: string,
    provider?: string,
    transactionId?: string,
    context: ErrorContext = {},
  ) {
    super("PAYMENT_ERROR", message, "error", context);
    this.name = "PaymentError";
    this.provider = provider;
    this.transactionId = transactionId;
  }
}

export class NetworkError extends AppErrorBase {
  public readonly status?: number;
  public readonly url?: string;

  constructor(
    message: string,
    status?: number,
    url?: string,
    context: ErrorContext = {},
  ) {
    super("NETWORK_ERROR", message, "error", context);
    this.name = "NetworkError";
    this.status = status;
    this.url = url;
  }
}

export class SecurityError extends AppErrorBase {
  public readonly riskLevel: "low" | "medium" | "high" | "critical";

  constructor(
    message: string,
    riskLevel: "low" | "medium" | "high" | "critical" = "medium",
    context: ErrorContext = {},
    userId?: string,
  ) {
    super("SECURITY_ERROR", message, "critical", context, userId);
    this.name = "SecurityError";
    this.riskLevel = riskLevel;
  }
}

export class ConfigurationError extends AppErrorBase {
  public readonly configKey?: string;

  constructor(message: string, configKey?: string, context: ErrorContext = {}) {
    super("CONFIG_ERROR", message, "error", context);
    this.name = "ConfigurationError";
    this.configKey = configKey;
  }
}

export class DatabaseError extends AppErrorBase {
  public readonly query?: string;
  public readonly parameters?: unknown[];

  constructor(
    message: string,
    query?: string,
    parameters?: unknown[],
    context: ErrorContext = {},
  ) {
    super("DATABASE_ERROR", message, "error", context);
    this.name = "DatabaseError";
    this.query = query;
    this.parameters = parameters;
  }
}

export class ExternalServiceError extends AppErrorBase {
  public readonly service: string;
  public readonly endpoint?: string;

  constructor(
    message: string,
    service: string,
    endpoint?: string,
    context: ErrorContext = {},
  ) {
    super("EXTERNAL_SERVICE_ERROR", message, "error", context);
    this.name = "ExternalServiceError";
    this.service = service;
    this.endpoint = endpoint;
  }
}

// Error handler utility functions
export function handleApiError(
  error: unknown,
  context: ErrorContext = {},
): AppErrorBase {
  if (error instanceof AppErrorBase) {
    return error;
  }

  if (error instanceof Error) {
    return new AppErrorBase("UNKNOWN_ERROR", error.message, "error", {
      ...context,
      originalError: error.name,
      stack: error.stack,
    });
  }

  return new AppErrorBase(
    "UNKNOWN_ERROR",
    "An unknown error occurred",
    "error",
    { ...context, originalError: String(error) },
  );
}

export function handleAsyncError<T>(
  asyncFn: () => Promise<T>,
  errorHandler?: (error: AppErrorBase) => void,
): Promise<T> {
  return asyncFn().catch((error: unknown) => {
    const appError = handleApiError(error);
    if (errorHandler) {
      errorHandler(appError);
    }
    throw appError;
  });
}

// Type guard functions
export function isAppError(error: unknown): error is AppErrorBase {
  return error instanceof AppErrorBase;
}

export function isAuthenticationError(
  error: unknown,
): error is AuthenticationError {
  return error instanceof AuthenticationError;
}

export function isValidationError(error: unknown): error is ValidationError {
  return error instanceof ValidationError;
}

export function isPaymentError(error: unknown): error is PaymentError {
  return error instanceof PaymentError;
}

export function isNetworkError(error: unknown): error is NetworkError {
  return error instanceof NetworkError;
}

export function isSecurityError(error: unknown): error is SecurityError {
  return error instanceof SecurityError;
}

// Error logging utilities
export interface ErrorLogger {
  log(error: AppErrorBase): void;
  logCritical(error: AppErrorBase): void;
}

export class ConsoleErrorLogger implements ErrorLogger {
  log(error: AppErrorBase): void {
    console.error(
      `[${error.severity.toUpperCase()}] ${error.code}: ${error.message}`,
      {
        timestamp: error.timestamp.toISOString(),
        context: error.context,
        userId: error.userId,
        sessionId: error.sessionId,
      },
    );
  }

  logCritical(error: AppErrorBase): void {
    console.error(
      `[CRITICAL] ${error.code}: ${error.message}`,
      JSON.stringify(error.toJSON(), null, 2),
    );
  }
}

// Global error handler
export class GlobalErrorHandler {
  private logger: ErrorLogger;
  private errorCallback?: (error: AppErrorBase) => void;

  constructor(logger: ErrorLogger = new ConsoleErrorLogger()) {
    this.logger = logger;
  }

  setErrorCallback(callback: (error: AppErrorBase) => void): void {
    this.errorCallback = callback;
  }

  handle(error: unknown, context: ErrorContext = {}): AppErrorBase {
    const appError = handleApiError(error, context);

    // Log the error
    if (appError.severity === "critical") {
      this.logger.logCritical(appError);
    } else {
      this.logger.log(appError);
    }

    // Call error callback if set
    if (this.errorCallback) {
      this.errorCallback(appError);
    }

    return appError;
  }

  handleAsync<T>(
    asyncFn: () => Promise<T>,
    context: ErrorContext = {},
  ): Promise<T> {
    return asyncFn().catch((error: unknown) => {
      const appError = this.handle(error, context);
      throw appError;
    });
  }
}

// Default global error handler instance
export const globalErrorHandler = new GlobalErrorHandler();

// Utility function for React error boundaries
export function getErrorInfo(
  error: Error,
  errorInfo?: { componentStack: string },
): ErrorContext {
  return {
    component: "React Component",
    stack: error.stack,
    componentStack: errorInfo?.componentStack,
  };
}

// Utility for handling fetch errors
export function handleFetchError(
  response: Response,
  url: string,
): NetworkError {
  return new NetworkError(
    `HTTP ${response.status}: ${response.statusText}`,
    response.status,
    url,
    {
      headers: Object.fromEntries(response.headers.entries()),
    },
  );
}

// Utility for validating required fields
export function validateRequired<T>(
  data: Partial<T>,
  requiredFields: (keyof T)[],
  objectName = "Object",
): void {
  const missingFields = requiredFields.filter((field) => !data[field]);

  if (missingFields.length > 0) {
    throw new ValidationError(
      `${objectName} is missing required fields: ${missingFields.join(", ")}`,
      missingFields[0] as string,
      data,
      { missingFields, objectName },
    );
  }
}

// Utility for handling promise rejections
export function safePromise<T>(
  promise: Promise<T>,
  fallback: T,
  context: ErrorContext = {},
): Promise<T> {
  return promise.catch((error: unknown) => {
    globalErrorHandler.handle(error, context);
    return fallback;
  });
}

// Retry utility with exponential backoff
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxAttempts = 3,
  baseDelay = 1000,
  context: ErrorContext = {},
): Promise<T> {
  let lastError: AppErrorBase | undefined;

  for (let attempt = 1; attempt <= maxAttempts; attempt++) {
    try {
      return await fn();
    } catch (error: unknown) {
      lastError = handleApiError(error, { ...context, attempt });

      if (attempt === maxAttempts) {
        throw lastError;
      }

      // Exponential backoff with jitter
      const delay = baseDelay * Math.pow(2, attempt - 1) + Math.random() * 1000;
      await new Promise((resolve) => setTimeout(resolve, delay));
    }
  }

  throw lastError!;
}
