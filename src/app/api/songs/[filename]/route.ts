import { NextRequest, NextResponse } from 'next/server';
import { readFile } from 'fs/promises';
import { join } from 'path';

export async function GET(
  request: NextRequest,
  { params }: { params: { filename: string } }
) {
  try {
    const filepath = join(process.cwd(), 'uploads', params.filename);
    const file = await readFile(filepath);
    
    // Set appropriate content type
    const contentType = params.filename.endsWith('.mp3') 
      ? 'audio/mpeg' 
      : 'audio/wav';
    
    return new NextResponse(new Uint8Array(file), { // Convert Buffer to Uint8Array
      headers: {
        'Content-Type': contentType,
      },
    });
  } catch (error) {
    return NextResponse.json({ error: 'File not found' }, { status: 404 });
  }
}