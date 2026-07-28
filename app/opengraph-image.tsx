import { ImageResponse } from 'next/og';

export const alt = 'Tower Rush — Демо краш-игра с AI Аналитиком';
export const size = { width: 1200, height: 630 };
export const contentType = 'image/png';

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'linear-gradient(135deg, #0a0a12 0%, #141415 50%, #0d1a0d 100%)',
          fontFamily: 'sans-serif',
          position: 'relative',
        }}
      >
        {/* Glow blobs */}
        <div
          style={{
            position: 'absolute',
            top: 80,
            left: 120,
            width: 400,
            height: 400,
            borderRadius: '50%',
            background: 'rgba(34,197,94,0.07)',
            filter: 'blur(80px)',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: 60,
            right: 100,
            width: 320,
            height: 320,
            borderRadius: '50%',
            background: 'rgba(59,130,246,0.06)',
            filter: 'blur(80px)',
          }}
        />

        {/* Badge */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 8,
            padding: '6px 18px',
            borderRadius: 999,
            background: 'rgba(34,197,94,0.1)',
            border: '1px solid rgba(34,197,94,0.25)',
            marginBottom: 32,
          }}
        >
          <div
            style={{
              width: 8,
              height: 8,
              borderRadius: '50%',
              background: '#22c55e',
            }}
          />
          <span style={{ color: '#4ade80', fontSize: 18, fontWeight: 700, letterSpacing: '0.15em', textTransform: 'uppercase' }}>
            Демо-режим
          </span>
        </div>

        {/* Title */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 24,
            marginBottom: 20,
          }}
        >
          <span
            style={{
              fontSize: 96,
              fontWeight: 900,
              color: '#ffffff',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            Tower
          </span>
          <span
            style={{
              fontSize: 96,
              fontWeight: 900,
              background: 'linear-gradient(90deg, #4ade80, #22c55e)',
              backgroundClip: 'text',
              color: 'transparent',
              letterSpacing: '-0.02em',
              lineHeight: 1,
            }}
          >
            Rush
          </span>
        </div>

        {/* Subtitle */}
        <p
          style={{
            fontSize: 28,
            color: 'rgba(255,255,255,0.45)',
            margin: 0,
            marginBottom: 48,
            letterSpacing: '0.01em',
          }}
        >
          Краш-игра с AI Аналитиком · Предсказание этажа краша
        </p>

        {/* Stats row */}
        <div style={{ display: 'flex', gap: 20 }}>
          {[
            { value: '×15', label: 'Макс. множитель' },
            { value: 'AI', label: 'Предсказатель' },
            { value: '500%', label: 'Бонус ADUNLOCK' },
          ].map(item => (
            <div
              key={item.label}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                padding: '16px 36px',
                borderRadius: 16,
                background: 'rgba(255,255,255,0.04)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            >
              <span style={{ fontSize: 36, fontWeight: 900, color: '#22c55e' }}>{item.value}</span>
              <span style={{ fontSize: 16, color: 'rgba(255,255,255,0.35)', marginTop: 4 }}>{item.label}</span>
            </div>
          ))}
        </div>
      </div>
    ),
    size,
  );
}
