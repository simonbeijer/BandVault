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
