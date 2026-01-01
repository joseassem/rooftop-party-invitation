import { Metadata } from 'next'
import { getEventBySlugWithSettings } from '@/lib/queries'
import eventConfig from '@/event-config.json'

interface LayoutProps {
    children: React.ReactNode
    params: { slug: string }
}

export async function generateMetadata({ params }: LayoutProps): Promise<Metadata> {
    const { slug } = params
    const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://party.timekast.mx'

    try {
        const event = await getEventBySlugWithSettings(slug)

        if (!event) {
            return {
                metadataBase: new URL(baseUrl),
                title: 'Evento no encontrado',
                description: 'La invitación que buscas no existe o no está disponible.',
            }
        }

        const title = `${event.title} - ${event.subtitle}`
        const description = `${event.date} ${event.time} - ${event.location}`

        // Preferir la imagen configurada en el evento (si existe). Fallback a imagen OG generada (endpoint normal).
        let imageUrl = event.backgroundImageUrl || `${baseUrl}/api/og/${slug}`
        if (imageUrl.startsWith('/')) {
            imageUrl = `${baseUrl}${imageUrl}`
        }

        return {
            metadataBase: new URL(baseUrl),
            title,
            description,
            openGraph: {
                title,
                description,
                type: 'website',
                locale: 'es_MX',
                url: `${baseUrl}/${slug}`,
                siteName: eventConfig.event.title,
                images: [
                    {
                        url: imageUrl,
                        secureUrl: imageUrl,
                        width: 1200,
                        height: 630,
                        alt: event.title,
                    },
                ],
            },
            twitter: {
                card: 'summary_large_image',
                title,
                description,
                images: [imageUrl],
            },
        }
    } catch (error) {
        return {
            metadataBase: new URL(baseUrl),
            title: eventConfig.event.title,
            description: eventConfig.event.subtitle,
        }
    }
}

export default function EventLayout({ children }: { children: React.ReactNode }) {
    return <>{children}</>
}
