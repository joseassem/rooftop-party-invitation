import { NextRequest, NextResponse } from 'next/server'
import eventConfig from '@/event-config.json'

// Endpoint para obtener estadísticas del evento
export async function GET(request: NextRequest) {
  try {
    const hasCosmosConfig = process.env.COSMOS_ENDPOINT && process.env.COSMOS_KEY

    if (hasCosmosConfig) {
      const { getEventStats } = await import('@/lib/cosmosdb')
      const stats = await getEventStats(eventConfig.event.id)

      return NextResponse.json({
        success: true,
        eventId: eventConfig.event.id,
        stats,
      })
    } else {
      // Modo demo
      return NextResponse.json({
        success: true,
        eventId: eventConfig.event.id,
        stats: {
          totalConfirmed: 0,
          confirmed: 0,
          cancelled: 0
        },
        note: 'Modo Demo: Configura Azure Cosmos DB para estadísticas reales'
      })
    }
  } catch (error) {
    console.error('Error en GET /api/stats:', error)
    return NextResponse.json(
      { error: 'Error al obtener estadísticas' },
      { status: 500 }
    )
  }
}
