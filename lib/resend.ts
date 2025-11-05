import { Resend } from 'resend'

if (!process.env.RESEND_API_KEY) {
  console.warn('⚠️  RESEND_API_KEY no configurado. Los emails no se enviarán.')
}

export const resend = new Resend(process.env.RESEND_API_KEY)

export const FROM_EMAIL = process.env.FROM_EMAIL || 'onboarding@resend.dev'
