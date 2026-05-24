import { ImageResponse } from 'next/og'

export const runtime = 'edge'
export const size = { width: 1200, height: 630 }
export const contentType = 'image/png'

export default function OgImage() {
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
          background: '#18181B',
          position: 'relative',
        }}
      >
        {/* Accent bar top */}
        <div
          style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            height: 6,
            background: '#722F37',
          }}
        />

        {/* Logo text */}
        <div
          style={{
            fontSize: 72,
            fontWeight: 300,
            color: '#FAF8F5',
            letterSpacing: '0.05em',
            marginBottom: 16,
          }}
        >
          Vinos & Cia
        </div>

        {/* Tagline */}
        <div
          style={{
            fontSize: 24,
            color: '#C9A96E',
            letterSpacing: '0.2em',
            textTransform: 'uppercase',
          }}
        >
          Vinoteca · Baradero
        </div>

        {/* Accent bar bottom */}
        <div
          style={{
            position: 'absolute',
            bottom: 0,
            left: 0,
            right: 0,
            height: 6,
            background: '#722F37',
          }}
        />
      </div>
    ),
    { width: 1200, height: 630 },
  )
}
