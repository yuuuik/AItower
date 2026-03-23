/**
 * Test endpoint — открой в браузере:
 * /api/postback/test?secret=towerrush2026
 * Показывает список сохранённых ID и форму для тест-вызова постбэка
 */
import { NextRequest, NextResponse } from 'next/server';
import { promises as fs } from 'fs';
import path from 'path';

const DATA_FILE = path.join(process.cwd(), 'data', 'validIds.json');
const SECRET = process.env.POSTBACK_SECRET ?? 'towerrush2026';

export async function GET(req: NextRequest) {
  const { searchParams } = req.nextUrl;

  if (searchParams.get('secret') !== SECRET) {
    return new NextResponse('Forbidden', { status: 403 });
  }

  let ids: Record<string, { addedAt: number; type: string }> = {};
  try {
    const content = await fs.readFile(DATA_FILE, 'utf-8');
    ids = JSON.parse(content).ids ?? {};
  } catch {
    ids = {};
  }

  const base = `${req.nextUrl.protocol}//${req.nextUrl.host}`;
  const testUrl = `${base}/api/postback?secret=${SECRET}&id=TEST_ID_HERE&type=FD`;
  const verifyUrl = `${base}/api/verify-id`;

  const rows = Object.entries(ids)
    .sort((a, b) => b[1].addedAt - a[1].addedAt)
    .map(([id, meta]) => {
      const date = new Date(meta.addedAt).toLocaleString('ru-RU');
      return `<tr>
        <td style="padding:8px 12px;font-family:monospace;font-size:15px;font-weight:bold;color:#4ade80">${id}</td>
        <td style="padding:8px 12px;color:#a78bfa">${meta.type}</td>
        <td style="padding:8px 12px;color:#9ca3af">${date}</td>
      </tr>`;
    }).join('');

  const html = `<!DOCTYPE html>
<html lang="ru">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Постбэк тестер — Tower Rush</title>
  <style>
    * { box-sizing: border-box; margin: 0; padding: 0; }
    body { background: #070712; color: #fff; font-family: -apple-system, sans-serif; padding: 32px 24px; }
    h1 { font-size: 22px; font-weight: 900; margin-bottom: 4px; }
    .sub { color: #6b7280; font-size: 13px; margin-bottom: 32px; }
    .card { background: #0f0f1f; border: 1px solid rgba(255,255,255,0.08); border-radius: 16px; padding: 24px; margin-bottom: 24px; }
    h2 { font-size: 13px; text-transform: uppercase; letter-spacing: .15em; color: #6b7280; margin-bottom: 16px; }
    label { display: block; font-size: 12px; color: #9ca3af; margin-bottom: 6px; text-transform: uppercase; letter-spacing: .1em; }
    input { width: 100%; background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.1); border-radius: 10px; padding: 10px 14px; color: #fff; font-size: 15px; outline: none; margin-bottom: 12px; }
    button { background: linear-gradient(135deg,#7c3aed,#8b5cf6); color: #fff; border: none; border-radius: 10px; padding: 11px 24px; font-size: 14px; font-weight: 700; cursor: pointer; }
    button:hover { opacity: .9; }
    .result { margin-top: 14px; padding: 12px 16px; border-radius: 10px; font-size: 13px; font-family: monospace; display: none; }
    .ok { background: rgba(34,197,94,.1); border: 1px solid rgba(34,197,94,.3); color: #4ade80; }
    .err { background: rgba(239,68,68,.1); border: 1px solid rgba(239,68,68,.3); color: #f87171; }
    table { width: 100%; border-collapse: collapse; }
    tr:not(:last-child) td { border-bottom: 1px solid rgba(255,255,255,0.05); }
    .empty { color: #4b5563; font-size: 13px; text-align: center; padding: 20px; }
    .url-box { background: rgba(255,255,255,0.04); border: 1px solid rgba(255,255,255,0.08); border-radius: 10px; padding: 10px 14px; font-family: monospace; font-size: 12px; color: #a78bfa; word-break: break-all; margin-bottom: 8px; }
    .copy-btn { background: rgba(255,255,255,0.06); border: 1px solid rgba(255,255,255,0.1); color: rgba(255,255,255,0.6); border-radius: 8px; padding: 5px 12px; font-size: 11px; cursor: pointer; }
  </style>
</head>
<body>
  <h1>🛰 Постбэк тестер</h1>
  <p class="sub">Tower Rush · только для вас</p>

  <!-- Stored IDs -->
  <div class="card">
    <h2>Сохранённые ID (${Object.keys(ids).length})</h2>
    ${Object.keys(ids).length > 0
      ? `<table>${rows}</table>`
      : '<p class="empty">Нет сохранённых ID — отправьте тест-постбэк ниже</p>'
    }
  </div>

  <!-- Test postback -->
  <div class="card">
    <h2>Тест-постбэк (симуляция депозита)</h2>
    <label>ID игрока (любой номер)</label>
    <input id="testId" type="text" inputmode="numeric" placeholder="например: 352767034" />
    <label>Тип события</label>
    <input id="testType" type="text" value="FD" />
    <button onclick="sendTest()">Отправить постбэк</button>
    <div id="testResult" class="result"></div>
  </div>

  <!-- Verify ID -->
  <div class="card">
    <h2>Проверить ID</h2>
    <label>ID для проверки</label>
    <input id="verifyId" type="text" inputmode="numeric" placeholder="введите ID" />
    <button onclick="verifyId()">Проверить</button>
    <div id="verifyResult" class="result"></div>
  </div>

  <!-- Real URL for 1win -->
  <div class="card">
    <h2>URL для 1win (вставить в постбэк)</h2>
    <p style="color:#6b7280;font-size:12px;margin-bottom:10px">Первый депозит (FD):</p>
    <div class="url-box">${base}/api/postback?secret=${SECRET}&id={player_id}&type=FD</div>
    <p style="color:#6b7280;font-size:12px;margin:10px 0">Повторный депозит (RD):</p>
    <div class="url-box">${base}/api/postback?secret=${SECRET}&id={player_id}&type=RD</div>
    <p style="color:#4b5563;font-size:11px;margin-top:10px">Замените <code style="color:#f59e0b">{player_id}</code> на макрос из 1win (например player_id, uid и т.д.)</p>
  </div>

  <script>
    async function sendTest() {
      const id = document.getElementById('testId').value.trim();
      const type = document.getElementById('testType').value.trim() || 'FD';
      const el = document.getElementById('testResult');
      if (!id) { showResult(el, false, 'Введите ID'); return; }
      const url = '/api/postback?secret=${SECRET}&id=' + encodeURIComponent(id) + '&type=' + encodeURIComponent(type);
      try {
        const res = await fetch(url);
        const text = await res.text();
        showResult(el, res.ok, res.ok ? '✅ OK — ID ' + id + ' добавлен! Обновите страницу.' : '❌ ' + text);
      } catch(e) {
        showResult(el, false, '❌ Ошибка: ' + e);
      }
    }

    async function verifyId() {
      const id = document.getElementById('verifyId').value.trim();
      const el = document.getElementById('verifyResult');
      if (!id) { showResult(el, false, 'Введите ID'); return; }
      try {
        const res = await fetch('/api/verify-id', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ id })
        });
        const data = await res.json();
        showResult(el, data.ok, data.ok ? '✅ ID найден — доступ разрешён' : '❌ ' + (data.error ?? 'Не найден'));
      } catch(e) {
        showResult(el, false, '❌ Ошибка: ' + e);
      }
    }

    function showResult(el, ok, msg) {
      el.className = 'result ' + (ok ? 'ok' : 'err');
      el.textContent = msg;
      el.style.display = 'block';
    }
  </script>
</body>
</html>`;

  return new NextResponse(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}
