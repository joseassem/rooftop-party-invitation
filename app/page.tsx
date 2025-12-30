import { redirect } from 'next/navigation'
import eventConfig from '../event-config.json'

/**
 * Home page - redirects to the default event's slug
 * All events should be accessed via /{slug}
 */
export default function Home() {
  // Redirect to the default event's slug
  redirect(`/${eventConfig.event.id}`)
}
