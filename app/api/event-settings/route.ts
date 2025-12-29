import { NextResponse } from 'next/server'
import { isDatabaseConfigured } from '@/lib/db'
import eventConfig from '@/event-config.json'

/**
 * GET /api/event-settings
 * Obtiene la configuración actual del evento desde la base de datos
 */
export async function GET() {
  try {
    const eventId = eventConfig.event.id

    if (isDatabaseConfigured()) {
      const { getEventSettings } = await import('@/lib/queries')
      const settings = await getEventSettings(eventId)

      if (settings) {
        return NextResponse.json({
          success: true,
          settings
        })
      }
    }

    // Return default from static config
    return NextResponse.json({
      success: true,
      settings: {
        eventId: eventConfig.event.id,
        title: eventConfig.event.title,
        subtitle: eventConfig.event.subtitle,
        date: eventConfig.event.date,
        time: eventConfig.event.time,
        location: eventConfig.event.location,
        details: eventConfig.event.details,
        priceEnabled: true,
        priceAmount: 250,
        priceCurrency: 'MXN',
        capacityEnabled: true,
        capacityLimit: 100,
        backgroundImageUrl: eventConfig.event.backgroundImage
      },
      note: 'Usando configuración estática por defecto'
    })

  } catch (error) {
    console.error('Error al obtener configuración del evento:', error)
    return NextResponse.json({
      success: false,
      message: 'Error al obtener configuración'
    }, { status: 500 })
  }
}
