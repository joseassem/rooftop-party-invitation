import { NextRequest, NextResponse } from 'next/server'
import { ImageResponse } from 'next/og'
import React from 'react'
import { getEventBySlugWithSettings } from '@/lib/queries'

export const runtime = 'nodejs'
export const dynamic = 'force-dynamic'

const OG_SIZE = { width: 1200, height: 630 }
const MAX_BYTES = 5 * 1024 * 1024 // 5MB (límite práctico para scrapers como WhatsApp/FB)
const FETCH_TIMEOUT = 8000 // 8 segundos timeout para fetch de imagen

function createFallbackOg(title: string, subtitle: string, date: string, time: string, location: string) {
  const rootStyle: React.CSSProperties = {
    height: '100%',
    width: '100%',
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#0a0015',
    backgroundImage: 'linear-gradient(135deg, #1a0033 0%, #0a0015 50%, #000510 100%)',
  }

  const containerStyle: React.CSSProperties = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    justifyContent: 'center',
    padding: '48px',
    textAlign: 'center',
    width: '100%',
    maxWidth: '1000px',
  }

  const titleStyle: React.CSSProperties = {
    fontSize: '68px',
    fontWeight: 800,
    color: '#ff6b9d',
    textShadow: '0 0 30px rgba(255, 107, 157, 0.8)',
    lineHeight: 1.05,
  }

  const subtitleStyle: React.CSSProperties = {
    marginTop: '18px',
    fontSize: '34px',
    color: '#00f5ff',
    textShadow: '0 0 20px rgba(0, 245, 255, 0.6)',
    lineHeight: 1.2,
  }

  const dateRowStyle: React.CSSProperties = {
    marginTop: '34px',
    display: 'flex',
    gap: '28px',
    fontSize: '28px',
    color: '#ffffff',
    opacity: 0.95,
  }

  const locationStyle: React.CSSProperties = {
    marginTop: '18px',
    fontSize: '24px',
    color: '#b8b8b8',
  }

  return new ImageResponse(
    React.createElement(
      'div',
      { style: rootStyle },
      React.createElement(
        'div',
        { style: containerStyle },
        React.createElement('div', { style: titleStyle }, title),
        React.createElement('div', { style: subtitleStyle }, subtitle),
        React.createElement(
          'div',
          { style: dateRowStyle },
          React.createElement('span', null, date),
          React.createElement('span', null, time)
        ),
        React.createElement('div', { style: locationStyle }, location)
      )
    ),
    { ...OG_SIZE }
  )
}

// Fallback simple sin ImageResponse (para casos donde ImageResponse falla)
function simpleFallbackResponse() {
  // Devolver un placeholder 1x1 pixel PNG transparente
  const pixel = Buffer.from(
    'iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkYAAAAAYAAjCB0C8AAAAASUVORK5CYII=',
    'base64'
  )
  return new NextResponse(pixel, {
    status: 200,
    headers: {
      'Content-Type': 'image/png',
      'Cache-Control': 'no-cache',
    },
  })
}

export async function GET(_request: NextRequest, { params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  console.log(`[OG-Image] Processing request for slug: ${slug}`)

  // defaults
  let title = 'Evento'
  let subtitle = ''
  let date = ''
  let time = ''
  let location = ''
  let imageUrl: string | null = null

  try {
    const event = await getEventBySlugWithSettings(slug)
    if (event) {
      title = event.title || 'Evento'
      subtitle = event.subtitle || ''
      date = event.date || ''
      time = event.time || ''
      location = event.location || ''
      imageUrl = event.backgroundImageUrl || null
      console.log(`[OG-Image] Event found: ${title}, imageUrl: ${imageUrl}`)
    } else {
      console.log(`[OG-Image] Event not found for slug: ${slug}`)
    }
  } catch (err) {
    console.error(`[OG-Image] Error fetching event:`, err)
  }

  // Helper para devolver fallback con manejo de errores
  const returnFallback = async () => {
    try {
      return createFallbackOg(title, subtitle, date, time, location)
    } catch (fallbackErr) {
      console.error(`[OG-Image] Fallback ImageResponse failed:`, fallbackErr)
      return simpleFallbackResponse()
    }
  }

  // Si no hay imagen configurada, usar fallback generado
  if (!imageUrl) {
    console.log(`[OG-Image] No image URL, using generated fallback`)
    return returnFallback()
  }

  // Forzar URL absoluta si viene como path local
  const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://party.timekast.mx'
  if (imageUrl.startsWith('/')) imageUrl = `${baseUrl}${imageUrl}`

  try {
    // Crear AbortController para timeout
    const controller = new AbortController()
    const timeoutId = setTimeout(() => controller.abort(), FETCH_TIMEOUT)

    console.log(`[OG-Image] Fetching image from: ${imageUrl}`)
    
    const res = await fetch(imageUrl, {
      redirect: 'follow',
      signal: controller.signal,
      headers: {
        // Simular un navegador real para evitar bloqueos
        'User-Agent': 'Mozilla/5.0 (compatible; Googlebot/2.1; +http://www.google.com/bot.html)',
        'Accept': 'image/avif,image/webp,image/apng,image/*,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9',
        'Referer': baseUrl,
      },
    })

    clearTimeout(timeoutId)

    if (!res.ok) {
      console.log(`[OG-Image] Fetch failed with status: ${res.status}`)
      return returnFallback()
    }

    const contentType = res.headers.get('content-type') || 'image/png'
    
    // Verificar que sea una imagen válida
    if (!contentType.startsWith('image/')) {
      console.log(`[OG-Image] Invalid content type: ${contentType}`)
      return returnFallback()
    }

    const buf = Buffer.from(await res.arrayBuffer())
    console.log(`[OG-Image] Image fetched successfully, size: ${buf.byteLength} bytes`)

    // Verificar que el buffer no esté vacío
    if (buf.byteLength < 1000) {
      console.log(`[OG-Image] Image too small or empty (${buf.byteLength} bytes), using fallback`)
      return returnFallback()
    }

    // Si es demasiado grande, WhatsApp suele ignorarlo → devolvemos fallback optimizado
    if (buf.byteLength > MAX_BYTES) {
      console.log(`[OG-Image] Image too large (${buf.byteLength} bytes), using fallback`)
      return returnFallback()
    }

    return new NextResponse(buf, {
      status: 200,
      headers: {
        'Content-Type': contentType,
        'Cache-Control': 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400',
      },
    })
  } catch (err) {
    console.error(`[OG-Image] Error fetching image:`, err)
    return returnFallback()
  }
}
