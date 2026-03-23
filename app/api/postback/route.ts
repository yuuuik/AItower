import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

const SECRET = process.env.POSTBACK_SECRET ?? 'towerrush2026';

function extractId(params: URLSearchParams): string | null {
  const raw =
    params.get('player_id') ??
    params.get('id') ??
    params.get('user_id') ??
    params.get('uid') ??
    params.get('source_id') ??
    null;
  if (!raw) return null;
  const clean = raw.trim().replace(/\D/g, '');
  return clean || null;
}

async function handle(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  if (searchParams.get('secret') !== SECRET) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const playerId = extractId(searchParams);
  if (!playerId) {
    return new NextResponse('Missing player_id', { status: 400 });
  }

  const eventType = searchParams.get('type') ?? searchParams.get('event_type') ?? 'unknown';

  await kv.hset(`player:${playerId}`, { addedAt: Date.now(), type: eventType });

  console.log(`[postback] +ID ${playerId} type=${eventType}`);

  return new NextResponse('OK', { status: 200 });
}

export const GET = handle;
export const POST = handle;
