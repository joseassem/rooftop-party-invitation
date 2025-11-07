'use client'

import { useState, useEffect } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import eventConfig from '../event-config.json'
import RSVPModal from './components/RSVPModal'
import styles from './page.module.css'

export default function Home() {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [config, setConfig] = useState(eventConfig)
  const { event, theme } = config

  // Cargar configuración dinámica al montar el componente
  useEffect(() => {
    const loadConfig = async () => {
      try {
        const response = await fetch('/api/event-settings', {
          cache: 'no-store'
        })
        
        if (response.ok) {
          const data = await response.json()
          if (data.success && data.settings) {
            // Convertir EventSettings a formato del JSON
            const settings = data.settings
            setConfig({
              ...eventConfig,
              event: {
                ...eventConfig.event,
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
                backgroundImage: settings.backgroundImage.url || eventConfig.event.backgroundImage
              }
            })
          }
        }
      } catch (error) {
        console.log('Usando configuración por defecto:', error)
      }
    }

    loadConfig()
  }, [])

  return (
    <main className={styles.main}>
      {/* Ícono secreto para admin */}
      <a href="/admin" className={styles.adminIcon} title="Admin">
        ⚙️
      </a>

      {/* Fondo con imagen */}
      <div className={styles.backgroundWrapper}>
        <div 
          className={styles.background}
          style={{
            backgroundImage: `url(${event.backgroundImage})`,
          }}
        />
        <div className={styles.overlay} />
      </div>

      {/* Contenido principal */}
      <div className={styles.content}>
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className={styles.hero}
        >
          {/* Título principal con efecto neón */}
          <h1 className={styles.title}>
            {event.title.split(' ').map((word, index) => (
              <span key={index} className={index === 0 ? styles.titleLine1 : styles.titleLine2}>
                {word}
              </span>
            ))}
          </h1>

          {/* Subtítulo */}
          <motion.h2
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6, delay: 0.6 }}
            className={styles.subtitle}
            style={{ color: theme.secondaryColor }}
          >
            {event.subtitle}
          </motion.h2>
        </motion.div>

        {/* Información del evento */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className={styles.eventInfo}
        >
          <div className={styles.infoItem}>
            <span className={styles.icon}>📅</span>
            <span className={styles.infoText}>{event.date}</span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.icon}>🕔</span>
            <span className={styles.infoText}>{event.time}</span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.icon}>📍</span>
            <span className={styles.infoText}>{event.location}</span>
          </div>
          
          <div className={styles.infoItem}>
            <span className={styles.infoText}>
              {event.details.split('\n').map((line, i) => (
                <span key={i}>
                  {line}
                  {i < event.details.split('\n').length - 1 && <br />}
                </span>
              ))}
            </span>
          </div>

          {event.price && (
            <div className={styles.infoItem}>
              <span className={styles.infoText} style={{ color: theme.accentColor, fontWeight: 'bold' }}>
                {event.price}
              </span>
            </div>
          )}

          {event.capacity && (
            <div className={styles.infoItem}>
              <span className={styles.infoText} style={{ color: theme.secondaryColor }}>
                {event.capacity}
              </span>
            </div>
          )}
        </motion.div>

        {/* RSVP Section */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.6, delay: 1 }}
          className={styles.rsvpSection}
        >
          <h3 className={styles.rsvpTitle} style={{ color: theme.accentColor }}>
            RSVP INDISPENSABLE
          </h3>
          
          <motion.button
            className={styles.rsvpButton}
            onClick={() => setIsModalOpen(true)}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            style={{
              background: `linear-gradient(135deg, ${theme.primaryColor}, ${theme.secondaryColor})`,
            }}
          >
            CONFIRMAR ASISTENCIA
          </motion.button>
        </motion.div>

        {/* Decorative elements */}
        <div className={styles.sparkles}>
          {[...Array(5)].map((_, i) => (
            <motion.div
              key={i}
              className={styles.sparkle}
              initial={{ opacity: 0 }}
              animate={{
                opacity: [0, 1, 0],
                scale: [0, 1, 0],
                rotate: [0, 180, 360],
              }}
              transition={{
                duration: 2,
                delay: i * 0.3,
                repeat: Infinity,
                repeatDelay: 1,
              }}
              style={{
                left: `${20 + i * 15}%`,
                top: `${30 + (i % 3) * 20}%`,
              }}
            >
              ✨
            </motion.div>
          ))}
        </div>
      </div>

      {/* Modal RSVP */}
      <AnimatePresence>
        {isModalOpen && (
          <RSVPModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
          />
        )}
      </AnimatePresence>
    </main>
  )
}
