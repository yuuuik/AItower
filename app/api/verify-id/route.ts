import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';
import { VALID_DEPOSIT_IDS } from '@/lib/validIds';

const DATA_FILE = path.join(process.cwd(), 'data', 'validIds.json');

async function getDynamicIds(): Promise<Set<string>> {
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    const data = JSON.parse(content) as { ids: Record<string, unknown> };
    return new Set(Object.keys(data.ids ?? {}));
  } catch {
    return new Set();
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clean = String(body.id ?? '').trim().replace(/\D/g, '');

    if (!clean) {
      return NextResponse.json({ ok: false, error: 'Введите ID аккаунта.' }, { status: 400 });
    }

    // Check hardcoded list first (instant), then dynamic file
    if (VALID_DEPOSIT_IDS.has(clean)) {
      return NextResponse.json({ ok: true });
    }

    const dynamicIds = await getDynamicIds();
    if (dynamicIds.has(clean)) {
      return NextResponse.json({ ok: true });
    }

    return NextResponse.json(
      { ok: false, error: 'ID не найден. Убедитесь, что вы сделали депозит на 1win.' },
      { status: 400 }
    );
  } catch {
    return NextResponse.json({ ok: false, error: 'Ошибка сервера.' }, { status: 500 });
  }
}
