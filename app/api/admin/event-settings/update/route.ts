import { NextRequest, NextResponse } from 'next/server'
import { isDatabaseConfigured } from '@/lib/db'

/**
 * POST /api/admin/event-settings/update
 * Actualiza la configuración del evento (requiere autenticación admin)
 */
export async function POST(request: NextRequest) {
  try {
    // Verificar autenticación básica
    const authHeader = request.headers.get('authorization')
    if (!authHeader || !verifyAuth(authHeader)) {
      return NextResponse.json({
        success: false,
        message: 'No autorizado'
      }, { status: 401 })
    }

    const body = await request.json()

    // Validar campos requeridos
    if (!body.eventId || !body.title) {
      return NextResponse.json({
        success: false,
        message: 'Faltan campos requeridos'
      }, { status: 400 })
    }

    // Preparar settings
    const settings = {
      eventId: body.eventId,
      title: body.title,
      subtitle: body.subtitle || '',
      date: body.date || '',
      time: body.time || '',
      location: body.location || '',
      details: body.details || '',
      priceEnabled: body.price?.enabled || false,
      priceAmount: body.price?.amount || 0,
      priceCurrency: body.price?.currency || 'MXN',
      capacityEnabled: body.capacity?.enabled || false,
      capacityLimit: body.capacity?.limit || 0,
      backgroundImageUrl: body.backgroundImage?.url || '/background.png',
      // Theme colors
      primaryColor: body.theme?.primaryColor || '#FF1493',
      secondaryColor: body.theme?.secondaryColor || '#00FFFF',
      accentColor: body.theme?.accentColor || '#FFD700'
    }

    console.log('📝 Preparando settings:', settings)

    if (isDatabaseConfigured()) {
      console.log('✅ Base de datos configurada, guardando...')
      const { saveEventSettings } = await import('@/lib/queries')
      try {
        const result = await saveEventSettings(settings)
        console.log('✅ Guardado exitoso:', result)

        return NextResponse.json({
          success: true,
          message: 'Configuración actualizada correctamente'
        })
      } catch (dbError) {
        console.error('❌ Error de base de datos:', dbError)
        return NextResponse.json({
          success: false,
          message: 'Error al guardar en base de datos'
        }, { status: 500 })
      }
    } else {
      console.log('⚠️ Modo demo - configuración no guardada permanentemente')
      return NextResponse.json({
        success: true,
        message: 'Configuración actualizada (modo demo)',
        note: 'Configura DATABASE_URL para guardar permanentemente'
      })
    }

  } catch (error) {
    console.error('Error al actualizar configuración:', error)
    return NextResponse.json({
      success: false,
      message: 'Error al actualizar configuración'
    }, { status: 500 })
  }
}

/**
 * Verificar autenticación básica
 */
function verifyAuth(authHeader: string): boolean {
  try {
    const base64Credentials = authHeader.replace('Basic ', '')
    const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
    const [username, password] = credentials.split(':')

    // Estas credenciales deben coincidir con las del admin
    return username === 'admin' && password === 'partytime'
  } catch {
    return false
  }
}
