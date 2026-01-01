import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'

// Usar edge en producción, pero el código funciona igual
export const runtime = 'edge'

// WhatsApp requiere exactamente estas dimensiones para mostrar imagen grande
const OG_SIZE = { width: 1200, height: 630 }

export async function GET(request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params

  // defaults
  let title = 'Party Time!'
  let subtitle = ''
  let date = ''
  let time = ''
  let location = ''
  let backgroundImageUrl: string | null = null
  const primaryColor = '#ff6b9d'
  const secondaryColor = '#00f5ff'

  // Obtener datos del evento via API
  try {
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || new URL(request.url).origin
    const res = await fetch(`${baseUrl}/api/events/${slug}`, {
      headers: { 'Accept': 'application/json' },
      cache: 'no-store',
    })
    
    if (res.ok) {
      const data = await res.json()
      if (data.success && data.event) {
        title = data.event.title || title
        subtitle = data.event.subtitle || ''
        date = data.event.date || ''
        time = data.event.time || ''
        location = data.event.location || ''
        backgroundImageUrl = data.event.backgroundImageUrl || data.event.backgroundImage?.url || null
      }
    }
  } catch (e) {
    console.error('[og-image] Error fetching event:', e)
  }

  // En desarrollo en Windows hay un bug con @vercel/og
  // Si falla, devolver un redirect a la imagen original
  try {
    return new ImageResponse(
      (
        <div
          style={{
            height: '100%',
            width: '100%',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            position: 'relative',
            overflow: 'hidden',
          }}
        >
          {/* Fondo: imagen o gradiente */}
          {backgroundImageUrl ? (
            <img
              src={backgroundImageUrl}
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                objectFit: 'cover',
                objectPosition: 'center',
              }}
            />
          ) : (
            <div
              style={{
                position: 'absolute',
                top: 0,
                left: 0,
                width: '100%',
                height: '100%',
                background: 'linear-gradient(135deg, #1a0033 0%, #0a0015 50%, #000510 100%)',
              }}
            />
          )}

          {/* Overlay oscuro */}
          <div
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              background: 'linear-gradient(180deg, rgba(0,0,0,0.4) 0%, rgba(0,0,0,0.75) 100%)',
            }}
          />

          {/* Contenido */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              justifyContent: 'center',
              padding: '40px 60px',
              textAlign: 'center',
              position: 'relative',
              zIndex: '1',
              width: '100%',
              height: '100%',
            }}
          >
            {/* Título */}
            <div
              style={{
                fontSize: title.length > 15 ? 64 : 80,
                fontWeight: 800,
                color: '#ffffff',
                textShadow: `0 0 40px ${primaryColor}, 0 4px 8px rgba(0,0,0,0.9), 0 0 80px ${primaryColor}80`,
                lineHeight: 1.1,
                marginBottom: 16,
              }}
            >
              {title}
            </div>

            {/* Subtítulo */}
            {subtitle && (
              <div
                style={{
                  fontSize: 36,
                  fontWeight: 600,
                  color: secondaryColor,
                  textShadow: `0 0 30px ${secondaryColor}, 0 2px 4px rgba(0,0,0,0.9)`,
                  lineHeight: 1.2,
                  marginBottom: 24,
                }}
              >
                {subtitle}
              </div>
            )}

            {/* Fecha y hora */}
            {(date || time) && (
              <div
                style={{
                  display: 'flex',
                  gap: 40,
                  fontSize: 32,
                  fontWeight: 600,
                  color: '#ffffff',
                  textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                  marginBottom: 16,
                }}
              >
                {date && <span>📅 {date}</span>}
                {time && <span>🕐 {time}</span>}
              </div>
            )}

            {/* Ubicación */}
            {location && (
              <div
                style={{
                  fontSize: 26,
                  fontWeight: 500,
                  color: '#e0e0e0',
                  textShadow: '0 2px 4px rgba(0,0,0,0.9)',
                }}
              >
                📍 {location}
              </div>
            )}
          </div>
        </div>
      ),
      {
        ...OG_SIZE,
      }
    )
  } catch (error) {
    console.error('[og-image] ImageResponse failed:', error)
    
    // Fallback: si hay imagen de fondo, redirigir a ella
    if (backgroundImageUrl) {
      return NextResponse.redirect(backgroundImageUrl, { status: 302 })
    }
    
    // Fallback final: imagen estática
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://party.timekast.mx'
    return NextResponse.redirect(`${baseUrl}/og-image.png`, { status: 302 })
  }
}
