import { NextRequest, NextResponse } from 'next/server';
import { kv } from '@vercel/kv';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const clean = String(body.id ?? '').trim().replace(/\D/g, '');

    if (!clean) {
      return NextResponse.json({ ok: false, error: 'Введите ID аккаунта.' }, { status: 400 });
    }

    const exists = await kv.exists(`player:${clean}`);
    if (exists) {
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
