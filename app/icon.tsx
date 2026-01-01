import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 32,
  height: 32,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          fontSize: 24,
          background: 'linear-gradient(135deg, #1a0033 0%, #2d0052 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '6px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Sparkle effect */}
        <div
          style={{
            position: 'absolute',
            top: '2px',
            right: '4px',
            width: '4px',
            height: '4px',
            background: '#FFD700',
            borderRadius: '50%',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '6px',
            left: '3px',
            width: '3px',
            height: '3px',
            background: '#00FFFF',
            borderRadius: '50%',
            display: 'flex',
          }}
        />
        {/* Party emoji/icon */}
        <span style={{ 
          fontSize: 20,
          filter: 'drop-shadow(0 0 2px rgba(255, 20, 147, 0.8))',
        }}>
          🎉
        </span>
      </div>
    ),
    {
      ...size,
    }
  )
}
