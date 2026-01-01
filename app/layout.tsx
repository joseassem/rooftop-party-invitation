import type { Metadata, Viewport } from 'next'
import './globals.css'
import eventConfig from '../event-config.json'

const baseUrl = process.env.NEXT_PUBLIC_BASE_URL || 'https://party.timekast.mx'

export const metadata: Metadata = {
  metadataBase: new URL(baseUrl),
  title: 'Party Time!',
  applicationName: 'Party Time!',
  description: 'Party Time! — Invitaciones y RSVP',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'black-translucent',
    title: 'Party Time!',
  },
  formatDetection: {
    telephone: false,
  },
  icons: {
    icon: [
      { url: '/icon-192', sizes: '192x192', type: 'image/png' },
      { url: '/icon-512', sizes: '512x512', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-icon', sizes: '180x180', type: 'image/png' },
    ],
  },
}

export const viewport: Viewport = {
  width: 'device-width',
  initialScale: 1,
  maximumScale: 1,
  themeColor: eventConfig.theme.backgroundColor,
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body>{children}</body>
    </html>
  )
}
