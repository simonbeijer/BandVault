/**
 * User Authentication Verification API Route
 * 
 * Endpoint to verify JWT tokens and return authenticated user information
 * with proper TypeScript typing, security logging, and error handling.
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import { verifyAuth, AuthError } from "@/lib/auth";
import type { AuthVerificationResponse, User, JWTPayload } from "@/types/auth";


// ============================================================================
// USER VERIFICATION ENDPOINT
// ============================================================================

export async function GET(request: NextRequest): Promise<NextResponse<AuthVerificationResponse>> {
  try {
    // Get the token from the cookie
    const token = (await cookies()).get("token")?.value;

    if (!token) {
      return NextResponse.json(
        { user: null, message: "Authentication token not found." },
        { status: 401 }
      );
    }

    // Verify the token
    const payload = await verifyAuth(token);

    // Reconstruct the user object from the token payload
    const user: User = {
      id: payload.id,
      email: payload.email,
      name: payload.name,
      role: payload.role as "user" | "admin",
      // These fields are not stored in the JWT, so they are omitted or set to a default.
      // For a real app, you might want to re-fetch the user from the database here.
      createdAt: new Date(payload.iat * 1000),
      updatedAt: new Date(payload.iat * 1000),
    };

    // Return the user data
    return NextResponse.json({ user }, { status: 200 });

  } catch (error) {
    // If verification fails (e.g., token expired)
    if (error instanceof AuthError) {
      const response = NextResponse.json(
        { user: null, message: error.message },
        { status: 401 }
      );
      // Clear the invalid/expired token
      response.cookies.set("token", "", { maxAge: 0, path: "/" });
      return response;
    }

    // Handle other unexpected errors
    console.error("User API Error:", error);
    return NextResponse.json(
      { user: null, message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

// ============================================================================
// UPDATE USER PROFILE ENDPOINT (Future Enhancement)
// ============================================================================

export async function PUT(request: NextRequest): Promise<NextResponse> {
  // This endpoint could be implemented in the future for user profile updates
  return NextResponse.json(
    {
      message: "User profile updates not yet implemented",
      timestamp: new Date().toISOString()
    },
    { status: 501 } // Not Implemented
  );
}

// ============================================================================
// METHOD NOT ALLOWED HANDLERS
// ============================================================================

export async function POST(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      message: "Method not allowed. Use GET to verify authentication.",
      timestamp: new Date().toISOString()
    },
    { status: 405 }
  );
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      message: "Method not allowed. Use GET to verify authentication.",
      timestamp: new Date().toISOString()
    },
    { status: 405 }
  );
}

export async function PATCH(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      message: "Method not allowed. Use GET to verify authentication or PUT to update profile.",
      timestamp: new Date().toISOString()
    },
    { status: 405 }
  );
}