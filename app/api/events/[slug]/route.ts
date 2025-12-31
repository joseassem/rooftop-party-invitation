import { NextRequest, NextResponse } from 'next/server'
import { isDatabaseConfigured } from '@/lib/db'
import { validateAdminAuth, getUnauthorizedResponse } from '@/lib/auth'
import { neon } from '@neondatabase/serverless'
import eventConfig from '@/event-config.json'

export const dynamic = 'force-dynamic'

interface RouteParams {
    params: Promise<{ slug: string }>
}

/**
 * GET /api/events/[slug]
 * Get a specific event by its URL slug
 * Supports both DB events and the default event from event-config.json
 */
export async function GET(request: NextRequest, { params }: RouteParams) {
    try {
        const { slug } = await params

        // Check if this is the default event from config
        const isDefaultEvent = slug === eventConfig.event.id

        if (isDatabaseConfigured()) {
            const { getEventBySlug } = await import('@/lib/queries')
            const event = await getEventBySlug(slug)

            if (event) {
                // Fetch event_settings using the robust query function
                const { getEventSettings } = await import('@/lib/queries')
                const settings = await getEventSettings(slug)

                let mergedEvent: any = { ...event }

                if (settings) {
                    console.log('🔗 [api/events/slug] Merging settings for event:', slug)
                    // Override with settings data (settings take priority)
                    mergedEvent = {
                        ...event,
                        title: settings.title || event.title,
                        subtitle: settings.subtitle || event.subtitle,
                        date: settings.date || event.date,
                        time: settings.time || event.time,
                        location: settings.location || event.location,
                        details: settings.details || event.details,
                        backgroundImage: {
                            url: settings.backgroundImageUrl || event.backgroundImageUrl || '/background.png'
                        },
                        price: {
                            enabled: settings.priceEnabled ?? event.priceEnabled ?? false,
                            amount: settings.priceAmount ?? event.priceAmount ?? 0,
                            currency: settings.priceCurrency ?? 'MXN'
                        },
                        capacity: {
                            enabled: settings.capacityEnabled ?? event.capacityEnabled ?? false,
                            limit: settings.capacityLimit ?? event.capacityLimit ?? 0
                        },
                        theme: {
                            primaryColor: settings.primaryColor || eventConfig.theme.primaryColor,
                            secondaryColor: settings.secondaryColor || eventConfig.theme.secondaryColor,
                            accentColor: settings.accentColor || eventConfig.theme.accentColor,
                            backgroundColor: eventConfig.theme.backgroundColor,
                            textColor: eventConfig.theme.textColor
                        }
                    }
                } else {
                    // No settings, use event data with default structure
                    mergedEvent = {
                        ...event,
                        backgroundImage: {
                            url: event.backgroundImageUrl || '/background.png'
                        },
                        price: {
                            enabled: event.priceEnabled ?? false,
                            amount: event.priceAmount ?? 0,
                            currency: 'MXN'
                        },
                        capacity: {
                            enabled: event.capacityEnabled ?? false,
                            limit: event.capacityLimit ?? 0
                        },
                        theme: eventConfig.theme
                    }
                }

                return NextResponse.json({
                    success: true,
                    event: mergedEvent
                })
            }

            // If not found in DB but is the default event, build from config + settings
            if (isDefaultEvent) {
                const { getEventSettings } = await import('@/lib/queries')
                const settings = await getEventSettings(slug)

                if (settings) {
                    return NextResponse.json({
                        success: true,
                        event: {
                            id: eventConfig.event.id,
                            slug: eventConfig.event.id,
                            title: settings.title || eventConfig.event.title,
                            subtitle: settings.subtitle || eventConfig.event.subtitle,
                            date: settings.date || eventConfig.event.date,
                            time: settings.time || eventConfig.event.time,
                            location: settings.location || eventConfig.event.location,
                            details: settings.details || eventConfig.event.details,
                            price: {
                                enabled: settings.priceEnabled || false,
                                amount: settings.priceAmount || 0,
                                currency: settings.priceCurrency || 'MXN'
                            },
                            capacity: {
                                enabled: settings.capacityEnabled || false,
                                limit: settings.capacityLimit || 0
                            },
                            backgroundImage: {
                                url: settings.backgroundImageUrl || eventConfig.event.backgroundImage
                            },
                            theme: {
                                primaryColor: settings.primaryColor || eventConfig.theme.primaryColor,
                                secondaryColor: settings.secondaryColor || eventConfig.theme.secondaryColor,
                                accentColor: settings.accentColor || eventConfig.theme.accentColor,
                                backgroundColor: eventConfig.theme.backgroundColor,
                                textColor: eventConfig.theme.textColor
                            },
                            contact: eventConfig.contact,
                            isActive: true
                        }
                    })
                }

                // Fallback to pure config data
                return NextResponse.json({
                    success: true,
                    event: {
                        id: eventConfig.event.id,
                        slug: eventConfig.event.id,
                        title: eventConfig.event.title,
                        subtitle: eventConfig.event.subtitle,
                        date: eventConfig.event.date,
                        time: eventConfig.event.time,
                        location: eventConfig.event.location,
                        details: eventConfig.event.details,
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
                            url: eventConfig.event.backgroundImage
                        },
                        theme: eventConfig.theme,
                        contact: eventConfig.contact,
                        isActive: true
                    }
                })
            }

            return NextResponse.json({
                success: false,
                error: 'Evento no encontrado'
            }, { status: 404 })
        } else {
            // No DB but is default event - return from config
            if (isDefaultEvent) {
                return NextResponse.json({
                    success: true,
                    event: {
                        id: eventConfig.event.id,
                        slug: eventConfig.event.id,
                        title: eventConfig.event.title,
                        subtitle: eventConfig.event.subtitle,
                        date: eventConfig.event.date,
                        time: eventConfig.event.time,
                        location: eventConfig.event.location,
                        details: eventConfig.event.details,
                        price: { enabled: false, amount: 0, currency: 'MXN' },
                        capacity: { enabled: false, limit: 0 },
                        backgroundImage: { url: eventConfig.event.backgroundImage },
                        theme: eventConfig.theme,
                        contact: eventConfig.contact,
                        isActive: true
                    }
                })
            }

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
        if (!validateAdminAuth(request)) {
            return getUnauthorizedResponse()
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
        if (!validateAdminAuth(request)) {
            return getUnauthorizedResponse()
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

