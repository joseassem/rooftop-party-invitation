import eventConfigJson from '@/event-config.json'

/**
 * Obtener la configuración del evento
 * Lee desde la API (que lee de Firestore) o fallback a JSON estático
 */
export async function getEventConfig() {
  try {
    // Intentar leer desde la API (Firestore)
    const response = await fetch('/api/event-settings', {
      cache: 'no-store'
    })

    if (response.ok) {
      const data = await response.json()
      if (data.success && data.settings) {
        // Convertir EventSettings a formato del JSON
        const settings = data.settings
        return {
          ...eventConfigJson,
          event: {
            ...eventConfigJson.event,
            id: settings.eventId,
            title: settings.title,
            subtitle: settings.subtitle,
            date: settings.date,
            time: settings.time,
            location: settings.location,
            details: settings.details,
            price: settings.price.enabled 
              ? `💵 Cuota de recuperación: $${settings.price.amount}` 
              : '',
            capacity: settings.capacity.enabled
              ? `⚠️ Cupo limitado: ${settings.capacity.limit} personas`
              : '',
            backgroundImage: settings.backgroundImage.url
          }
        }
      }
    }
  } catch (error) {
    console.log('No se pudo cargar config desde Firestore, usando JSON default:', error)
  }

  // Fallback a JSON estático
  return eventConfigJson
}

/**
 * Versión síncrona para uso en servidor (SSR/API routes)
 * Solo devuelve el JSON estático
 */
export function getStaticEventConfig() {
  return eventConfigJson
}
