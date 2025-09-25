/**
 * Login API Route
 *
 * NOTE: This is a simplified version for functionality.
 * The original file included advanced features like rate limiting, comprehensive
 * validation, and security logging which have been removed for clarity.
 */

import { NextRequest, NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { createToken } from "@/lib/auth";
import bcrypt from "bcrypt";
import type { LoginResponse, User, DatabaseUser } from "@/types/auth";

export async function POST(request: NextRequest): Promise<NextResponse<LoginResponse>> {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Basic validation
    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    // Find user in the database
    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Return a generic error message to prevent email enumeration
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
      return NextResponse.json(
        { message: "Invalid credentials" },
        { status: 401 }
      );
    }

    // Create a user object for the token, excluding the password
    const publicUser: User = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role as "user" | "admin",
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
    };

    // Create JWT token
    const token = await createToken(publicUser);

    // Create success response
    const response = NextResponse.json(
      {
        message: "Login successful",
        user: publicUser,
      },
      { status: 200 }
    );

    // Set a secure, HTTP-only cookie with the token
    response.cookies.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 24 * 60 * 60, // 24 hours
      path: "/",
    });

    return response;

  } catch (error) {
    console.error("Login API Error:", error);
    return NextResponse.json(
      { message: "An internal server error occurred" },
      { status: 500 }
    );
  }
}