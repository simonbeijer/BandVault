/**
 * Authentication Type Definitions
 * 
 * Comprehensive type definitions for authentication, user management,
 * JWT operations, and auth-related API responses.
 */

// ============================================================================
// CORE USER TYPES
// ============================================================================

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  createdAt: Date;
  updatedAt: Date;
}

export interface DatabaseUser extends User {
  password: string;
}

// ============================================================================
// JWT & TOKEN TYPES
// ============================================================================

export interface JWTPayload {
  id: string;
  email: string;
  name: string;
  role: string;
  exp: number;
  iat: number;
}

// ============================================================================
// AUTHENTICATION REQUEST/RESPONSE TYPES
// ============================================================================

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  user?: User;
  timestamp?: string;
}

export interface LogoutResponse {
  message: string;
  timestamp?: string;
}

export interface AuthVerificationResponse {
  user: User | null;
  message?: string;
  timestamp?: string;
}

// ============================================================================
// AUTH CONTEXT TYPES
// ============================================================================

export interface AuthState {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  token?: string;
}

// ============================================================================
// ERROR TYPES
// ============================================================================

export interface AuthError extends Error {
  code: 'INVALID_CREDENTIALS' | 'TOKEN_EXPIRED' | 'MISSING_TOKEN' | 'UNAUTHORIZED';
  statusCode?: number;
}

// ============================================================================
// TYPE GUARDS
// ============================================================================

export const isUser = (obj: unknown): obj is User => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    'name' in obj &&
    'role' in obj &&
    typeof (obj as User).id === 'string' &&
    typeof (obj as User).email === 'string' &&
    typeof (obj as User).name === 'string' &&
    ['user', 'admin'].includes((obj as User).role)
  );
};

export const isJWTPayload = (obj: unknown): obj is JWTPayload => {
  return (
    typeof obj === 'object' &&
    obj !== null &&
    'id' in obj &&
    'email' in obj &&
    'name' in obj &&
    'role' in obj &&
    'exp' in obj &&
    'iat' in obj &&
    typeof (obj as JWTPayload).id === 'string' &&
    typeof (obj as JWTPayload).email === 'string' &&
    typeof (obj as JWTPayload).name === 'string' &&
    typeof (obj as JWTPayload).role === 'string' &&
    typeof (obj as JWTPayload).exp === 'number' &&
    typeof (obj as JWTPayload).iat === 'number'
  );
};

// ============================================================================
// UTILITY TYPES
// ============================================================================

export type PublicUser = Omit<User, 'password'>;