import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'validIds.json');

// Set POSTBACK_SECRET in .env.local — 1win postback URL must include ?secret=YOUR_VALUE
const SECRET = process.env.POSTBACK_SECRET ?? 'towerrush2026';

interface IdsData {
  ids: Record<string, { addedAt: number; type: string; raw?: string }>;
}

async function readIds(): Promise<IdsData> {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    return JSON.parse(content);
  } catch {
    return { ids: {} };
  }
}

async function writeIds(data: IdsData): Promise<void> {
  await fs.mkdir(path.dirname(DATA_FILE), { recursive: true });
  await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function extractId(params: URLSearchParams): string | null {
  // Try common 1win postback param names
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

  // Security check
  const secret = searchParams.get('secret');
  if (secret !== SECRET) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  const playerId = extractId(searchParams);
  if (!playerId) {
    return new NextResponse('Missing player_id', { status: 400 });
  }

  const eventType = searchParams.get('type') ?? searchParams.get('event_type') ?? 'unknown';

  const data = await readIds();
  data.ids[playerId] = {
    addedAt: Date.now(),
    type: eventType,
    raw: req.nextUrl.search,
  };
  await writeIds(data);

  console.log(`[postback] +ID ${playerId} type=${eventType}`);

  // 1win expects 200 OK
  return new NextResponse('OK', { status: 200 });
}

export const GET = handle;
export const POST = handle;
