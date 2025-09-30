import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/prisma';
import { verifyAuth } from '@/lib/auth';


// Helper to get token from request
function getTokenFromRequest(request: NextRequest): string | null {
    // Try to get token from Authorization header
    const authHeader = request.headers.get('authorization');
    if (authHeader?.startsWith('Bearer ')) {
        return authHeader.substring(7);
    }

    // Try to get token from cookie
    const token = request.cookies.get('token')?.value;
    return token || null;
}


export async function POST(request: NextRequest) {

    const token = getTokenFromRequest(request);
    if (!token) {
        return NextResponse.json({ error: 'Unauthorized - No token provided' }, { status: 401 });
    }


    try {

        const payload = await verifyAuth(token);

        // Get full user with bandId
        const user = await prisma.user.findUnique({
            where: { id: payload.id },
        });

        if (!user) {
            return NextResponse.json({ error: 'User not found' }, { status: 404 });
        }



        const body = await request.json();
        const { text, songId } = body;

        const message = await prisma.message.create({
            data: {
                text: text,
                songId: songId || null,
                userId: user.id,
                bandId: user.bandId,
            }, include: {
                user: {
                    select: {
                        id: true,
                        name: true,
                        email: true,
                    },
                }
            }
        })

        return NextResponse.json(message, { status: 201 })
    } catch (error) {
        console.error('Error creating message:', error);
        return NextResponse.json(
            { error: 'Failed to send message' },
            { status: 500 }
        );
    }




}