'use client'

import { useState, useEffect } from 'react'
import { useParams, useSearchParams } from 'next/navigation'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import eventConfig from '@/event-config.json'
import styles from './cancel.module.css'

interface RSVPData {
  id: string
  name: string
  email: string
  phone: string
  plusOne: boolean
  status: string
  eventId: string
}

interface EventTheme {
  primaryColor: string
  secondaryColor: string
  accentColor: string
  title: string
  subtitle: string
}


export default function CancelPage() {
  const params = useParams()
  const searchParams = useSearchParams()
  const rsvpId = params?.rsvpId as string
  const token = searchParams?.get('token')

  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [cancelled, setCancelled] = useState(false)
  const [updated, setUpdated] = useState(false)
  const [error, setError] = useState('')
  const [rsvpData, setRsvpData] = useState<RSVPData | null>(null)
  const [eventTheme, setEventTheme] = useState<EventTheme | null>(null)

  // Campos editables
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [plusOne, setPlusOne] = useState(false)


  // Cargar datos del RSVP
  useEffect(() => {
    if (!rsvpId || !token) {
      setError('Link inválido')
      setLoading(false)
      return
    }

    const loadRSVP = async () => {
      try {
        const response = await fetch(`/api/rsvp/get?rsvpId=${rsvpId}&token=${token}`)
        const data = await response.json()

        if (data.success && data.rsvp) {
          setRsvpData(data.rsvp)
          setName(data.rsvp.name)
          setEmail(data.rsvp.email)
          setPhone(data.rsvp.phone)
          setPlusOne(data.rsvp.plusOne)

          // Cargar configuración de la fiesta
          try {
            const eventRes = await fetch(`/api/events/${data.rsvp.eventId}`)
            const eventData = await eventRes.json()
            if (eventData.success && eventData.event) {
              setEventTheme({
                primaryColor: eventData.event.theme.primaryColor,
                secondaryColor: eventData.event.theme.secondaryColor,
                accentColor: eventData.event.theme.accentColor,
                title: eventData.event.title,
                subtitle: eventData.event.subtitle
              })
            }
          } catch (e) {
            console.error('Error loading event theme:', e)
          }
        } else {
          setError(data.error || 'No se pudo cargar la información')
        }
      } catch (err) {
        setError('Error de conexión')
      } finally {
        setLoading(false)
      }
    }

    loadRSVP()
  }, [rsvpId, token])

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!rsvpId || !token) {
      setError('Link inválido')
      return
    }

    setSaving(true)
    setError('')
    setUpdated(false)

    try {
      const response = await fetch('/api/rsvp/update', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          rsvpId,
          token,
          name,
          email,
          phone,
          plusOne,
          reconfirm: rsvpData?.status === 'cancelled' // Si está cancelado, reconfirmar
        })
      })

      const data = await response.json()

      if (data.success) {
        const wasReconfirmed = rsvpData?.status === 'cancelled'
        setUpdated(true)
        setRsvpData(data.rsvp)

        // Mostrar mensaje apropiado
        if (wasReconfirmed) {
          setError('') // Limpiar errores
        }
      } else {
        setError(data.error || 'Error al actualizar')
      }
    } catch (err) {
      setError('Error de conexión')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = async () => {
    if (!rsvpId || !token) {
      setError('Link inválido')
      return
    }

    if (!confirm('¿Estás seguro de que quieres cancelar tu asistencia?')) {
      return
    }

    setSaving(true)
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
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <p>Cargando...</p>
        </div>
      </div>
    )
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

  if (!rsvpData) {
    return (
      <div className={styles.container}>
        <div className={styles.card}>
          <div className={styles.error}>
            ❌ {error || 'No se encontró el RSVP'}
          </div>
          <a href="/" className={styles.homeBtn}>
            Volver al inicio
          </a>
        </div>
      </div>
    )
  }

  const displayTitle = eventTheme?.title || eventConfig.event.title
  const displaySubtitle = eventTheme?.subtitle || eventConfig.event.subtitle
  const theme = eventTheme || {
    primaryColor: '#FF1493',
    secondaryColor: '#00FFFF',
    accentColor: '#FFD700'
  }

  return (
    <div className={styles.container}>
      <div
        className={styles.card}
        style={{
          borderColor: `${theme.primaryColor}80`,
          boxShadow: `0 0 30px ${theme.primaryColor}33`
        }}
      >
        <h1 style={{ color: theme.primaryColor }}>Modificar o Cancelar Asistencia</h1>

        <div
          className={styles.eventInfo}
          style={{
            background: `${theme.primaryColor}15`,
            border: `1px solid ${theme.primaryColor}33`
          }}
        >
          <h2 style={{ color: theme.primaryColor }}>{displayTitle}</h2>
          <p>{displaySubtitle}</p>
          <p>{eventConfig.event.date} - {eventConfig.event.time}</p>
          <p>{eventConfig.event.location}</p>
        </div>

        {rsvpData?.status === 'cancelled' && !updated && (
          <div className={styles.warning}>
            ⚠️ Tu asistencia está cancelada. Puedes actualizarla para reconfirmar.
          </div>
        )}

        {error && (
          <div className={styles.error}>
            ❌ {error}
          </div>
        )}

        {updated && (
          <div className={styles.success} style={{ borderColor: theme.secondaryColor }}>
            {rsvpData?.status === 'confirmed'
              ? '✅ ¡Asistencia reconfirmada! Nos vemos en el evento 🎉'
              : '✅ Información actualizada correctamente'}
          </div>
        )}

        <form onSubmit={handleUpdate} className={styles.form}>
          <div className={styles.formGroup}>
            <label htmlFor="name">Nombre completo</label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              disabled={saving}
              style={{ borderColor: `${theme.primaryColor}4d` }}
              onFocus={(e) => (e.target.style.borderColor = theme.primaryColor)}
              onBlur={(e) => (e.target.style.borderColor = `${theme.primaryColor}4d`)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="email">Email</label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              disabled={saving}
              style={{ borderColor: `${theme.primaryColor}4d` }}
              onFocus={(e) => (e.target.style.borderColor = theme.primaryColor)}
              onBlur={(e) => (e.target.style.borderColor = `${theme.primaryColor}4d`)}
            />
          </div>

          <div className={styles.formGroup}>
            <label htmlFor="phone">Teléfono</label>
            <PhoneInput
              defaultCountry="mx"
              value={phone}
              onChange={(phone) => setPhone(phone)}
              className={styles.phoneInput}
              disabled={saving}
              inputClassName={styles.phoneInputField}
              countrySelectorStyleProps={{
                buttonClassName: styles.countrySelector
              }}
              disableDialCodePrefill={false}
              forceDialCode={true}
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.checkboxLabel}>
              <input
                type="checkbox"
                checked={plusOne}
                onChange={(e) => setPlusOne(e.target.checked)}
                disabled={saving}
                style={{ accentColor: theme.primaryColor } as any}
              />
              <span>Asistiré con acompañante (+1)</span>
            </label>
          </div>

          <button
            type="submit"
            disabled={saving}
            className={styles.updateBtn}
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
              boxShadow: `0 4px 15px ${theme.primaryColor}4d`
            }}
          >
            {saving
              ? 'Guardando...'
              : rsvpData?.status === 'cancelled'
                ? '✅ Reconfirmar Asistencia'
                : '💾 Actualizar Información'}
          </button>
        </form>

        {rsvpData?.status === 'confirmed' && (
          <>
            <div className={styles.divider}>o</div>

            <button
              onClick={handleCancel}
              disabled={saving}
              className={styles.cancelBtn}
            >
              {saving ? 'Procesando...' : '❌ Cancelar mi Asistencia'}
            </button>
          </>
        )}

        <a
          href="/"
          className={styles.backLink}
          style={{ color: theme.secondaryColor }}
        >
          Volver al inicio
        </a>
      </div>
    </div>
  )
}
