/**
 * Logout API Route
 * 
 * Secure logout endpoint that clears authentication cookies
 * with proper TypeScript typing and security logging.
 */

import { NextRequest, NextResponse } from "next/server";
import { cookies } from "next/headers";
import type { LogoutResponse } from "@/types/auth";
import { verifyAuth } from "@/lib/auth";


// ============================================================================
// LOGOUT ENDPOINT
// ============================================================================

export async function POST(request: NextRequest): Promise<NextResponse<LogoutResponse>> {
  try {
    const response = NextResponse.json(
      {
        message: "Logout successful",
        timestamp: new Date().toISOString()
      },
      { status: 200 }
    );

    response.cookies.set("token", "", {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 0, // Immediately expire
      path: "/",
    });

    return response;
  } catch (error) {
    console.error("Logout API Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}

// ============================================================================
// METHOD NOT ALLOWED HANDLERS
// ============================================================================

export async function GET(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      message: "Method not allowed. Use POST to logout.",
      timestamp: new Date().toISOString()
    },
    { status: 405 }
  );
}

export async function PUT(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      message: "Method not allowed. Use POST to logout.",
      timestamp: new Date().toISOString()
    },
    { status: 405 }
  );
}

export async function DELETE(): Promise<NextResponse> {
  return NextResponse.json(
    { 
      message: "Method not allowed. Use POST to logout.",
      timestamp: new Date().toISOString()
    },
    { status: 405 }
  );
}