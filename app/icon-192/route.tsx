import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a0033 0%, #2d0052 50%, #1a0033 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '38px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative sparkles */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '22px',
            width: '14px',
            height: '14px',
            background: '#FFD700',
            borderRadius: '50%',
            boxShadow: '0 0 14px #FFD700',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '45px',
            width: '8px',
            height: '8px',
            background: '#FF1493',
            borderRadius: '50%',
            boxShadow: '0 0 10px #FF1493',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '22px',
            left: '20px',
            width: '12px',
            height: '12px',
            background: '#00FFFF',
            borderRadius: '50%',
            boxShadow: '0 0 12px #00FFFF',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '42px',
            left: '40px',
            width: '6px',
            height: '6px',
            background: '#FFD700',
            borderRadius: '50%',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '55px',
            left: '16px',
            width: '9px',
            height: '9px',
            background: '#FF1493',
            borderRadius: '50%',
            boxShadow: '0 0 8px #FF1493',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '32px',
            right: '28px',
            width: '10px',
            height: '10px',
            background: '#00FFFF',
            borderRadius: '50%',
            boxShadow: '0 0 10px #00FFFF',
            display: 'flex',
          }}
        />
        {/* Main party icon */}
        <span style={{ 
          fontSize: 96,
          filter: 'drop-shadow(0 0 24px rgba(255, 20, 147, 0.6)) drop-shadow(0 4px 10px rgba(0, 0, 0, 0.4))',
        }}>
          🎉
        </span>
      </div>
    ),
    {
      width: 192,
      height: 192,
    }
  )
}
