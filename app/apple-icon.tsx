import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function AppleIcon() {
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
          borderRadius: '36px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Decorative elements */}
        <div
          style={{
            position: 'absolute',
            top: '12px',
            right: '20px',
            width: '14px',
            height: '14px',
            background: '#FFD700',
            borderRadius: '50%',
            boxShadow: '0 0 12px #FFD700',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '28px',
            right: '42px',
            width: '8px',
            height: '8px',
            background: '#FF1493',
            borderRadius: '50%',
            boxShadow: '0 0 8px #FF1493',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '20px',
            left: '18px',
            width: '12px',
            height: '12px',
            background: '#00FFFF',
            borderRadius: '50%',
            boxShadow: '0 0 10px #00FFFF',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '40px',
            left: '38px',
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
            top: '50px',
            left: '15px',
            width: '8px',
            height: '8px',
            background: '#FF1493',
            borderRadius: '50%',
            boxShadow: '0 0 6px #FF1493',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '30px',
            right: '25px',
            width: '10px',
            height: '10px',
            background: '#00FFFF',
            borderRadius: '50%',
            boxShadow: '0 0 8px #00FFFF',
            display: 'flex',
          }}
        />
        {/* Main party icon */}
        <span style={{ 
          fontSize: 90,
          filter: 'drop-shadow(0 0 20px rgba(255, 20, 147, 0.6)) drop-shadow(0 4px 8px rgba(0, 0, 0, 0.3))',
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
