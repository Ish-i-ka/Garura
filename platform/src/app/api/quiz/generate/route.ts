import { getUserFromRequest } from '@/lib/auth';
import { generateQuiz } from '@/lib/gemini';
import { NextRequest, NextResponse } from 'next/server';

export async function POST(request: NextRequest) {
  // 1. Authenticate the request
  const user = await getUserFromRequest(request);
  if (!user?.userId) {
    return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
  }

  try {
    const body = await request.json();
    const { topic, count, directions } = body;

    // 2. Validate the incoming data
    if (!topic || !count || !directions) {
      return NextResponse.json(
        { message: 'Missing required fields: topic, count, and directions are required.' },
        { status: 400 }
      );
    }
    
    // 3. Check for the API key BEFORE making the call
    if (!process.env.GEMINI_API_KEY) {
        console.error("CRITICAL: GEMINI_API_KEY environment variable is not set!");
        return NextResponse.json(
            { message: "The Quiz Generation service is not configured on the server." },
            { status: 503 } // 503 Service Unavailable is more accurate
        );
    }

    // 4. Call the Gemini helper function
    const quizData = await generateQuiz(topic, parseInt(count), directions);

    // 5. Return the successful response
    return NextResponse.json(quizData);

  } catch (error: any) {
    // 6. Provide detailed error logging for any other failure
    console.error('--- QUIZ GENERATION FAILED ---');
    console.error('Error Message:', error.message);
    console.error('Full Error Object:', error);
    console.error('------------------------------');
    
    return NextResponse.json(
      { message: 'An unexpected error occurred while generating the quiz from the AI provider.' },
      { status: 500 }
    );
  }
}