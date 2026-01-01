import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export async function GET() {
  return new ImageResponse(
    (
      <div
        style={{
          background: 'linear-gradient(135deg, #1a0033 0%, #2d0052 40%, #3d0070 70%, #1a0033 100%)',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          borderRadius: '100px',
          position: 'relative',
          overflow: 'hidden',
        }}
      >
        {/* Multiple decorative sparkles for larger icon */}
        <div
          style={{
            position: 'absolute',
            top: '30px',
            right: '55px',
            width: '35px',
            height: '35px',
            background: '#FFD700',
            borderRadius: '50%',
            boxShadow: '0 0 35px #FFD700',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '75px',
            right: '115px',
            width: '20px',
            height: '20px',
            background: '#FF1493',
            borderRadius: '50%',
            boxShadow: '0 0 25px #FF1493',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '55px',
            left: '50px',
            width: '30px',
            height: '30px',
            background: '#00FFFF',
            borderRadius: '50%',
            boxShadow: '0 0 30px #00FFFF',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '110px',
            left: '100px',
            width: '15px',
            height: '15px',
            background: '#FFD700',
            borderRadius: '50%',
            boxShadow: '0 0 15px #FFD700',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '140px',
            left: '40px',
            width: '22px',
            height: '22px',
            background: '#FF1493',
            borderRadius: '50%',
            boxShadow: '0 0 20px #FF1493',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '80px',
            right: '70px',
            width: '25px',
            height: '25px',
            background: '#00FFFF',
            borderRadius: '50%',
            boxShadow: '0 0 25px #00FFFF',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            top: '60px',
            left: '80px',
            width: '12px',
            height: '12px',
            background: '#FFD700',
            borderRadius: '50%',
            display: 'flex',
          }}
        />
        <div
          style={{
            position: 'absolute',
            bottom: '140px',
            right: '45px',
            width: '18px',
            height: '18px',
            background: '#FF1493',
            borderRadius: '50%',
            boxShadow: '0 0 15px #FF1493',
            display: 'flex',
          }}
        />
        {/* Main party icon */}
        <span style={{ 
          fontSize: 256,
          filter: 'drop-shadow(0 0 60px rgba(255, 20, 147, 0.5)) drop-shadow(0 8px 20px rgba(0, 0, 0, 0.4))',
        }}>
          🎉
        </span>
      </div>
    ),
    {
      width: 512,
      height: 512,
    }
  )
}
