/**
 * API Route: Generate Stream Token
 * Generates user token for Stream video calls
 */

import { NextRequest, NextResponse } from 'next/server';
import { StreamChat } from 'stream-chat';

const STREAM_API_KEY = process.env.NEXT_PUBLIC_STREAM_API_KEY;
const STREAM_API_SECRET = process.env.STREAM_API_SECRET;

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json();

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      );
    }

    if (!STREAM_API_KEY || !STREAM_API_SECRET) {
      return NextResponse.json(
        { error: 'Stream credentials not configured' },
        { status: 500 }
      );
    }

    // Initialize Stream server client
    const serverClient = StreamChat.getInstance(STREAM_API_KEY, STREAM_API_SECRET);

    // Generate token for the user
    const token = serverClient.createToken(userId);

    return NextResponse.json({
      token,
      apiKey: STREAM_API_KEY,
      userId,
    });
  } catch (error) {
    console.error('Error generating Stream token:', error);
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Failed to generate token' },
      { status: 500 }
    );
  }
}
