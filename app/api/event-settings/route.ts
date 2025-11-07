import { NextResponse } from 'next/server'
import { getEventSettings } from '@/lib/firestore'

/**
 * GET /api/event-settings
 * Obtiene la configuración actual del evento desde Firestore
 */
export async function GET() {
  try {
    const eventId = 'rooftop-party-andrreas'
    const settings = await getEventSettings(eventId)

    if (settings) {
      return NextResponse.json({
        success: true,
        settings
      })
    }

    return NextResponse.json({
      success: false,
      message: 'No se encontró configuración'
    }, { status: 404 })

  } catch (error) {
    console.error('Error al obtener configuración del evento:', error)
    return NextResponse.json({
      success: false,
      message: 'Error al obtener configuración'
    }, { status: 500 })
  }
}
