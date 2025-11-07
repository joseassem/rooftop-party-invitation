import { NextRequest, NextResponse } from 'next/server'
import { saveEventSettings } from '@/lib/firestore'
import type { EventSettings } from '@/types/event-settings'

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

    // Preparar settings con valores por defecto
    const settings = {
      eventId: body.eventId,
      title: body.title,
      subtitle: body.subtitle || '',
      date: body.date || '',
      time: body.time || '',
      location: body.location || '',
      details: body.details || '',
      price: body.price || { enabled: false, amount: 0, currency: 'MXN' },
      capacity: body.capacity || { enabled: false, limit: 0 },
      backgroundImage: body.backgroundImage || { url: '', uploadedAt: null }
    }

    // Guardar en Firestore
    await saveEventSettings(settings)

    return NextResponse.json({
      success: true,
      message: 'Configuración actualizada correctamente'
    })

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
    return username === 'admin' && password === 'rooftop2024!'
  } catch {
    return false
  }
}
