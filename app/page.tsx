import { redirect } from 'next/navigation'
import eventConfig from '../event-config.json'

/**
 * Home page - redirects to the default event's slug
 * All events should be accessed via /{slug}
 */
import { getAppSetting, getEventById } from '@/lib/queries'

/**
 * Home page - redirects to the default event's slug
 * All events should be accessed via /{slug}
 */
export default async function Home() {
  // 1. Intentar obtener el ID del evento de inicio desde la DB
  const homeEventId = await getAppSetting('home_event_id')

  if (homeEventId) {
    const event = await getEventById(homeEventId)
    if (event && event.slug) {
      redirect(`/${event.slug}`)
    }
  }

  // 2. Fallback al slug del config por defecto (usando id como slug historical legacy)
  redirect(`/${eventConfig.event.id}`)
}
