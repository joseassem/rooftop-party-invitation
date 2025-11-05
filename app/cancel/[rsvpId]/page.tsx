'use client'

import { useState } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import eventConfig from '@/event-config.json'
import styles from './cancel.module.css'

export default function CancelPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const rsvpId = params?.rsvpId as string
  const token = searchParams?.get('token')

  const [loading, setLoading] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [error, setError] = useState('')

  const handleCancel = async () => {
    if (!rsvpId || !token) {
      setError('Link inválido')
      return
    }

    if (!confirm('¿Estás seguro de que quieres cancelar tu asistencia?')) {
      return
    }

    setLoading(true)
    setError('')

    try {
      const response = await fetch('/api/rsvp/cancel', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rsvpId,
          token
        })
      })

      const data = await response.json()

      if (data.success) {
        setCancelled(true)
      } else {
        setError(data.error || 'Error al cancelar')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setLoading(false)
    }
  }

  if (cancelled) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.iconSuccess}>✅</div>
          <h1>RSVP Cancelado</h1>
          <p>Tu asistencia ha sido cancelada exitosamente.</p>
          <p className={styles.subtext}>
            Lamentamos que no puedas asistir a {eventConfig.event.title}.
          </p>
          <a href="/" className={styles.homeBtn}>
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <div className={styles.card}>
        <h1>Cancelar Asistencia</h1>
        <div className={styles.eventInfo}>
          <h2>{eventConfig.event.title}</h2>
          <p>{eventConfig.event.subtitle}</p>
          <p>{eventConfig.event.date} - {eventConfig.event.time}</p>
          <p>{eventConfig.event.location}</p>
        </div>

        {error && (
          <div className={styles.error}>
            ❌ {error}
          </div>
        )}

        <p className={styles.warning}>
          ⚠️ Esta acción no se puede deshacer
        </p>

        <button
          onClick={handleCancel}
          disabled={loading}
          className={styles.cancelBtn}
        >
          {loading ? 'Procesando...' : 'Confirmar Cancelación'}
        </button>

        <a href="/" className={styles.backLink}>
          Volver sin cancelar
        </a>
      </div>
    </div>
  )
}
