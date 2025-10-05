import { NextResponse, NextRequest } from "next/server";
import { v2 as cloudinary } from 'cloudinary';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';

// Configure Cloudinary
const cloudName = process.env.CLOUDINARY_CLOUD_NAME;
const apiKey = process.env.CLOUDINARY_API_KEY;
const apiSecret = process.env.CLOUDINARY_API_SECRET;

if (!cloudName || !apiKey || !apiSecret) {
  throw new Error('Missing Cloudinary credentials. Check your .env file.');
}

cloudinary.config({
  cloud_name: cloudName,
  api_key: apiKey,
  api_secret: apiSecret,
});

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

// Valid audio/video MIME types
const VALID_AUDIO_TYPES = [
  'audio/mpeg',
  'audio/mp3',
  'audio/wav',
  'audio/wave',
  'audio/x-wav',
  'audio/aac',
  'audio/m4a',
  'audio/x-m4a',
  'audio/mp4',
  'audio/ogg',
  'audio/flac',
  'audio/webm',
  'video/mp4',        // Voice memos
  'video/quicktime',  // .mov files
  'video/x-m4a',
];

function isValidAudioFile(file: File): boolean {
  // Check MIME type
  if (VALID_AUDIO_TYPES.includes(file.type)) {
    return true;
  }
  
  // Check file extension as fallback
  const validExtensions = /\.(mp3|wav|m4a|aac|ogg|flac|webm|mp4|mov)$/i;
  return validExtensions.test(file.name);
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
      // Fetch single song
      const song = await prisma.song.findFirst({
        where: {
          id: songId,
          bandId: user.bandId,
        },
      });

      if (!song) {
        return NextResponse.json({ error: 'Song not found' }, { status: 404 });
      }

      return NextResponse.json(song);
    }

    // Fetch all songs for user's band
    const songs = await prisma.song.findMany({
      where: {
        bandId: user.bandId,
      },
      orderBy: {
        createdAt: 'desc',
      },
      select: {
        id: true,
        title: true,
        createdAt: true,
        audioUrl: true,
      },
    });

    return NextResponse.json(songs);
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

    // Validate file type (accepts audio and video files for voice memos)
    if (!isValidAudioFile(file)) {
      return NextResponse.json({ 
        error: `Invalid file type: ${file.type}. Please upload an audio file (MP3, WAV, M4A, AAC, etc.)` 
      }, { status: 400 });
    }

    // Validate file size (50MB max)
    const maxSize = 50 * 1024 * 1024;
    if (file.size > maxSize) {
      return NextResponse.json({ 
        error: 'File too large. Maximum size is 50MB' 
      }, { status: 400 });
    }

    console.log('Uploading file:', {
      name: file.name,
      type: file.type,
      size: `${(file.size / 1024 / 1024).toFixed(2)} MB`
    });

    // Convert file to buffer
    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    // Upload to Cloudinary
    const uploadResult: any = await new Promise((resolve, reject) => {
      const uploadStream = cloudinary.uploader.upload_stream(
        {
          resource_type: 'video', // Cloudinary uses 'video' for all audio files
          folder: 'band-vault',
          // Let Cloudinary auto-detect the format instead of forcing mp3
        },
        (error, result) => {
          if (error) {
            console.error('Cloudinary upload error:', error);
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
      uploadStream.end(buffer);
    });

    console.log('Uploaded to Cloudinary:', uploadResult.secure_url);

    // Store song in database with Cloudinary URL
    const song = await prisma.song.create({
      data: {
        title: title.trim(),
        bandId: user.bandId,
        audioUrl: uploadResult.secure_url,
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