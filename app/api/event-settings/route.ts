import { NextRequest, NextResponse } from 'next/server'
import { neon } from '@neondatabase/serverless'
import eventConfig from '@/event-config.json'

export const dynamic = 'force-dynamic'

/**
 * GET /api/event-settings?eventId=X
 * Obtiene la configuración de un evento específico desde la base de datos
 */
export async function GET(request: NextRequest) {
  try {
    // Get eventId from query params, or use default
    const { searchParams } = new URL(request.url)
    const eventId = searchParams.get('eventId') || eventConfig.event.id

    const { getEventSettings } = await import('@/lib/queries')
    const result = await getEventSettings(eventId)

    if (result) {
      return NextResponse.json({
        success: true,
        settings: {
          eventId: result.eventId,
          title: result.title,
          subtitle: result.subtitle || '',
          date: result.date || '',
          time: result.time || '',
          location: result.location || '',
          details: result.details || '',
          price: {
            enabled: result.priceEnabled || false,
            amount: result.priceAmount || 0,
            currency: result.priceCurrency || 'MXN'
          },
          capacity: {
            enabled: result.capacityEnabled || false,
            limit: result.capacityLimit || 0
          },
          backgroundImage: {
            url: result.backgroundImageUrl || '/background.png'
          },
          theme: {
            primaryColor: result.primaryColor || '#FF1493',
            secondaryColor: result.secondaryColor || '#00FFFF',
            accentColor: result.accentColor || '#FFD700'
          }
        },
        source: 'database'
      })
    }

    // Return default/empty config for new events
    return NextResponse.json({
      success: true,
      settings: {
        eventId: eventId,
        title: '',
        subtitle: '',
        date: '',
        time: '',
        location: '',
        details: '',
        price: {
          enabled: false,
          amount: 0,
          currency: 'MXN'
        },
        capacity: {
          enabled: false,
          limit: 0
        },
        backgroundImage: {
          url: '/background.png'
        },
        theme: {
          primaryColor: '#FF1493',
          secondaryColor: '#00FFFF',
          accentColor: '#FFD700'
        }
      },
      source: 'new'
    })

  } catch (error) {
    console.error('Error al obtener configuración del evento:', error)
    return NextResponse.json({
      success: false,
      message: 'Error al obtener configuración'
    }, { status: 500 })
  }
}
