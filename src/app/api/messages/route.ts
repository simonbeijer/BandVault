import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

/**
 * Extract JWT token from request (Authorization header or cookie)
 */
function getTokenFromRequest(request: NextRequest): string | null {
  // Try Authorization header first
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }

  // Fallback to cookie
  const token = request.cookies.get('token')?.value;
  return token || null;
}

// ============================================================================
// GET /api/messages
// Fetch messages (global chat or song-specific)
// ============================================================================

export async function GET(request: NextRequest) {
  // Check authentication
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  try {
    // Verify token and get user
    const payload = await verifyAuth(token);
    
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Get songId from query params (optional)
    const { searchParams } = new URL(request.url);
    const songId = searchParams.get('songId');

    // Fetch messages filtered by band and song
    const messages = await prisma.message.findMany({
      where: {
        bandId: user.bandId, // Only user's band messages
        songId: songId || null, // null = global chat
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
      orderBy: {
        createdAt: 'asc',
      },
    });

    return NextResponse.json(messages);
    
  } catch (error) {
    console.error('Error fetching messages:', error);
    return NextResponse.json(
      { error: 'Failed to fetch messages' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/messages
// Create a new message
// ============================================================================

export async function POST(request: NextRequest) {
  // Check authentication
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  try {
    // Verify token and get user
    const payload = await verifyAuth(token);
    
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      return NextResponse.json(
        { error: 'User not found' },
        { status: 404 }
      );
    }

    // Parse request body
    const body = await request.json();
    const { text, songId } = body;

    // Validate input
    if (!text || text.trim().length === 0) {
      return NextResponse.json(
        { error: 'Message text is required' },
        { status: 400 }
      );
    }

    // Create message
    const message = await prisma.message.create({
      data: {
        text: text.trim(),
        songId: songId || null,
        userId: user.id,
        bandId: user.bandId,
      },
      include: {
        user: {
          select: {
            id: true,
            name: true,
            email: true,
          },
        },
      },
    });

    return NextResponse.json(message, { status: 201 });
    
  } catch (error) {
    console.error('Error creating message:', error);
    return NextResponse.json(
      { error: 'Failed to send message' },
      { status: 500 }
    );
  }
}