import { NextRequest, NextResponse } from 'next/server'
import { validateAdminAuth, getUnauthorizedResponse } from '@/lib/auth'
import { updateRSVP } from '@/lib/firestore'

export async function POST(request: NextRequest) {
  // Validar autenticación
  if (!validateAdminAuth(request)) {
    return getUnauthorizedResponse()
  }

  try {
    const body = await request.json()
    const { rsvpId, updates } = body

    if (!rsvpId) {
      return NextResponse.json(
        { error: 'rsvpId es requerido' },
        { status: 400 }
      )
    }

    if (!updates || Object.keys(updates).length === 0) {
      return NextResponse.json(
        { error: 'No hay cambios para actualizar' },
        { status: 400 }
      )
    }

    // Actualizar RSVP sin enviar email
    await updateRSVP(rsvpId, updates)

    return NextResponse.json({
      success: true,
      message: 'RSVP actualizado exitosamente'
    })

  } catch (error: any) {
    console.error('Error en POST /api/admin/update-rsvp:', error)
    return NextResponse.json(
      { error: 'Error al actualizar RSVP', details: error.message },
      { status: 500 }
    )
  }
}
