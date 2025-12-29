import { NextRequest, NextResponse } from 'next/server'
import { isDatabaseConfigured } from '@/lib/db'

interface RouteParams {
    params: Promise<{ slug: string }>
}

/**
 * GET /api/events/[slug]
 * Get a specific event by its URL slug
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params

        if (isDatabaseConfigured()) {
            const { getEventBySlug } = await import('@/lib/queries')
            const event = await getEventBySlug(slug)

            if (!event) {
                return NextResponse.json({
                    success: false,
                    error: 'Evento no encontrado'
                }, { status: 404 })
            }

            return NextResponse.json({
                success: true,
                event
            })
        } else {
            return NextResponse.json({
                success: false,
                error: 'Base de datos no configurada'
            }, { status: 503 })
        }
    } catch (error) {
        console.error('Error getting event:', error)
        return NextResponse.json({
            success: false,
            error: 'Error al obtener evento'
        }, { status: 500 })
    }
}

/**
 * PUT /api/events/[slug]
 * Update an existing event (requires admin auth)
 */
export async function PUT(request: NextRequest, { params }: RouteParams) {
    try {
        // Verify admin authentication
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !verifyAuth(authHeader)) {
            return NextResponse.json({
                success: false,
                error: 'No autorizado'
            }, { status: 401 })
        }

        const { slug } = await params

        if (!isDatabaseConfigured()) {
            return NextResponse.json({
                success: false,
                error: 'Base de datos no configurada'
            }, { status: 503 })
        }

        const { getEventBySlug, updateEvent } = await import('@/lib/queries')
        const existingEvent = await getEventBySlug(slug)

        if (!existingEvent) {
            return NextResponse.json({
                success: false,
                error: 'Evento no encontrado'
            }, { status: 404 })
        }

        const body = await request.json()

        // Build update object (only include provided fields)
        const updates: any = {}

        if (body.title !== undefined) updates.title = body.title
        if (body.subtitle !== undefined) updates.subtitle = body.subtitle
        if (body.date !== undefined) updates.date = body.date
        if (body.time !== undefined) updates.time = body.time
        if (body.location !== undefined) updates.location = body.location
        if (body.details !== undefined) updates.details = body.details
        if (body.price?.enabled !== undefined) updates.priceEnabled = body.price.enabled
        if (body.price?.amount !== undefined) updates.priceAmount = body.price.amount
        if (body.capacity?.enabled !== undefined) updates.capacityEnabled = body.capacity.enabled
        if (body.capacity?.limit !== undefined) updates.capacityLimit = body.capacity.limit
        if (body.backgroundImage?.url !== undefined) updates.backgroundImageUrl = body.backgroundImage.url
        if (body.theme !== undefined) updates.theme = body.theme
        if (body.contact?.hostName !== undefined) updates.hostName = body.contact.hostName
        if (body.contact?.hostEmail !== undefined) updates.hostEmail = body.contact.hostEmail
        if (body.isActive !== undefined) updates.isActive = body.isActive

        const updatedEvent = await updateEvent(existingEvent.id, updates)

        return NextResponse.json({
            success: true,
            event: updatedEvent
        })
    } catch (error) {
        console.error('Error updating event:', error)
        return NextResponse.json({
            success: false,
            error: 'Error al actualizar evento'
        }, { status: 500 })
    }
}

/**
 * DELETE /api/events/[slug]
 * Delete an event (soft delete by default, requires admin auth)
 */
export async function DELETE(request: NextRequest, { params }: RouteParams) {
    try {
        // Verify admin authentication
        const authHeader = request.headers.get('authorization')
        if (!authHeader || !verifyAuth(authHeader)) {
            return NextResponse.json({
                success: false,
                error: 'No autorizado'
            }, { status: 401 })
        }

        const { slug } = await params
        const { searchParams } = new URL(request.url)
        const hardDelete = searchParams.get('hard') === 'true'

        if (!isDatabaseConfigured()) {
            return NextResponse.json({
                success: false,
                error: 'Base de datos no configurada'
            }, { status: 503 })
        }

        const { getEventBySlug, deleteEvent } = await import('@/lib/queries')
        const existingEvent = await getEventBySlug(slug)

        if (!existingEvent) {
            return NextResponse.json({
                success: false,
                error: 'Evento no encontrado'
            }, { status: 404 })
        }

        await deleteEvent(existingEvent.id, hardDelete)

        return NextResponse.json({
            success: true,
            message: hardDelete ? 'Evento eliminado permanentemente' : 'Evento desactivado'
        })
    } catch (error) {
        console.error('Error deleting event:', error)
        return NextResponse.json({
            success: false,
            error: 'Error al eliminar evento'
        }, { status: 500 })
    }
}

/**
 * Verify admin authentication
 */
function verifyAuth(authHeader: string): boolean {
    try {
        const base64Credentials = authHeader.replace('Basic ', '')
        const credentials = Buffer.from(base64Credentials, 'base64').toString('ascii')
        const [username, password] = credentials.split(':')
        return username === 'admin' && password === 'rooftop2024!'
    } catch {
        return false
    }
}
