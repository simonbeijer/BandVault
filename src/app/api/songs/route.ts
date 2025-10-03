import { NextResponse, NextRequest } from "next/server";
import { writeFile } from 'fs/promises';
import { join } from 'path';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// ============================================================================
// HELPER FUNCTIONS
// ============================================================================

function getTokenFromRequest(request: NextRequest): string | null {
  const authHeader = request.headers.get('authorization');
  if (authHeader?.startsWith('Bearer ')) {
    return authHeader.substring(7);
  }
  const token = request.cookies.get('token')?.value;
  return token || null;
}

// ============================================================================
// GET /api/songs - List all songs for user's band
// ============================================================================

export async function GET(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  try {
    const payload = await verifyAuth(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const { searchParams } = new URL(request.url);
    const songId = searchParams.get('id');

    if (songId) {
      const song = await prisma.song.findUnique({
        where: {
          id: songId,
          bandId: user.bandId,
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          audioUrl: true,
          lyrics: true,
        },
      });

      if (!song) {
        return NextResponse.json({ error: 'Song not found' }, { status: 404 });
      }

      return NextResponse.json(song);
    } else {
      const songs = await prisma.song.findMany({
        where: {
          bandId: user.bandId,
        },
        orderBy: {
          createdAt: 'desc', // Newest first
        },
        select: {
          id: true,
          title: true,
          createdAt: true,
          audioUrl: true,
        },
      });

      return NextResponse.json(songs);
    }
  } catch (error) {
    console.error('Error fetching songs:', error);
    return NextResponse.json(
      { error: 'Failed to fetch songs' },
      { status: 500 }
    );
  }
}

// ============================================================================
// POST /api/songs - Create a new song with audio file
// ============================================================================

export async function POST(request: NextRequest) {
  const token = getTokenFromRequest(request);
  if (!token) {
    return NextResponse.json(
      { error: 'Unauthorized - No token provided' },
      { status: 401 }
    );
  }

  try {
    const payload = await verifyAuth(token);
    const user = await prisma.user.findUnique({
      where: { id: payload.id },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    // Parse FormData
    const formData = await request.formData();
    const title = formData.get('title') as string;
    const file = formData.get('file') as File;

    // Validate
    if (!title?.trim()) {
      return NextResponse.json({ error: 'Title is required' }, { status: 400 });
    }

    if (!file) {
      return NextResponse.json({ error: 'Audio file is required' }, { status: 400 });
    }

    // Validate file type
    if (!file.type.startsWith('audio/')) {
      return NextResponse.json({ error: 'File must be an audio file' }, { status: 400 });
    }

    // Generate unique filename: timestamp-originalname
    const timestamp = Date.now();
    const filename = `${timestamp}-${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    
    // Save file to disk
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);
    
    const uploadDir = join(process.cwd(), 'uploads');
    const filepath = join(uploadDir, filename);
    
    await writeFile(filepath, buffer);
    console.log('File saved to:', filepath);

    // Store filename in database (not full path)
    const song = await prisma.song.create({
      data: {
        title: title.trim(),
        bandId: user.bandId,
        audioUrl: filename, // Just the filename, not full path
      },
    });

    return NextResponse.json({ 
      message: 'Song created successfully', 
      song 
    }, { status: 201 });

  } catch (error) {
    console.error('Error adding song:', error);
    return NextResponse.json(
      { error: 'Failed to add song' },
      { status: 500 }
    );
  }
}

export async function PUT(request: NextRequest) {
    const token = getTokenFromRequest(request);
    if (!token) {
        return NextResponse.json(
            { error: 'Unauthorized - No token provided' },
            { status: 401 }
        );
    }

    try {
        const payload = await verifyAuth(token);
        const user = await prisma.user.findUnique({
            where: { id: payload.id },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }

        const { searchParams } = new URL(request.url);
        const songId = searchParams.get('id');

        if (!songId) {
            return NextResponse.json({ error: 'Song ID is required' }, { status: 400 });
        }

        const { lyrics } = await request.json();

        const song = await prisma.song.update({
            where: {
                id: songId,
                bandId: user.bandId,
            },
            data: {
                lyrics,
            },
        });

        return NextResponse.json({ message: 'Lyrics updated successfully', song });
    } catch (error) {
        console.error('Error updating lyrics:', error);
        return NextResponse.json(
            { error: 'Failed to update lyrics' },
            { status: 500 }
        );
    }
}