// src/app/api/interview/history/route.ts
import { getUserFromRequest } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const user = await getUserFromRequest(request);
    if (!user || typeof user.userId !== 'string') {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Fetch ALL sessions for the user from the database.
    // The dashboard component will handle sorting and filtering.
    const sessions = await prisma.interviewSession.findMany({
      where: {
        interviewerId: user.userId,
      },
      orderBy: {
        createdAt: 'desc', // Return the newest sessions first.
      },
    });

    // --- THIS IS THE CRITICAL FIX ---
    // We are no longer mapping or changing the data.
    // We will send the raw, complete `InterviewSession` objects directly to the frontend.
    // This ensures that all required fields, especially `status` and `reportFilePath`,
    // are included in the response.

    return NextResponse.json(sessions);

  } catch (error) {
    console.error('Fetch History Error:', error);
    return NextResponse.json({ message: 'An internal server error occurred' }, { status: 500 });
  }
}