// src/app/api/interview/history/route.ts
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

// Helper to map database status to the frontend's expected status strings
const mapStatus = (status: 'PENDING' | 'ACTIVE' | 'ENDED'): 'upcoming' | 'ongoing' | 'expired' => {
  switch (status) {
    case 'PENDING':
      return 'upcoming';
    case 'ACTIVE':
      return 'ongoing';
    case 'ENDED':
      return 'expired';
  }
};

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || typeof user.userId !== 'string') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // --- FIX: Fetch ALL sessions for the user, not just 'ENDED' ones. ---
    const sessions = await prisma.interviewSession.findMany({
      where: {
        interviewerId: user.userId,
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    // --- FIX: Map the data to the format the frontend expects. ---
    const formattedMeetings = sessions.map(session => ({
      id: session.roomCode,
      name: 'Room', // As per schema, a placeholder name is used
      status: mapStatus(session.status),
      createdAt: session.createdAt.toISOString(),
    }));

    return NextResponse.json(formattedMeetings);

  } catch (error) {
    console.error('Fetch History Error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}