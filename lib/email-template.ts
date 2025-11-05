import eventConfig from '../event-config.json'

interface EmailTemplateProps {
  name: string
  plusOne: boolean
  cancelUrl: string
}

export function generateConfirmationEmail({ name, plusOne, cancelUrl }: EmailTemplateProps): string {
  const { event, theme } = eventConfig

  return `
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Confirmación RSVP - ${event.title}</title>
</head>
<body style="margin: 0; padding: 0; font-family: 'Arial', sans-serif; background-color: #f4f4f4;">
  <table role="presentation" style="width: 100%; border-collapse: collapse;">
    <tr>
      <td align="center" style="padding: 40px 0;">
        <table role="presentation" style="width: 600px; max-width: 100%; border-collapse: collapse; background-color: #ffffff; border-radius: 10px; overflow: hidden; box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);">
          
          <!-- Header con colores del evento -->
          <tr>
            <td style="background: linear-gradient(135deg, ${theme.primaryColor} 0%, ${theme.backgroundColor} 100%); padding: 40px 30px; text-align: center;">
              <h1 style="margin: 0; color: #ffffff; font-size: 32px; font-weight: 900; text-transform: uppercase; letter-spacing: 2px; text-shadow: 2px 2px 4px rgba(0,0,0,0.3);">
                ${event.title}
              </h1>
              <h2 style="margin: 10px 0 0 0; color: ${theme.secondaryColor}; font-size: 24px; font-weight: 700; text-transform: uppercase; text-shadow: 1px 1px 2px rgba(0,0,0,0.2);">
                ${event.subtitle}
              </h2>
            </td>
          </tr>

          <!-- Contenido principal -->
          <tr>
            <td style="padding: 40px 30px;">
              <p style="margin: 0 0 20px 0; font-size: 18px; color: #333333;">
                ¡Hola <strong>${name}</strong>!
              </p>
              
              <p style="margin: 0 0 30px 0; font-size: 16px; line-height: 1.6; color: #555555;">
                Tu asistencia ha sido confirmada para <strong>${event.title}</strong>. ¡Nos vemos ahí! 🎉
              </p>

              <!-- Detalles del evento -->
              <table role="presentation" style="width: 100%; border-collapse: collapse; background-color: #f9f9f9; border-radius: 8px; padding: 20px; margin-bottom: 30px;">
                <tr>
                  <td style="padding: 10px;">
                    <p style="margin: 0 0 15px 0; font-size: 16px; color: #333;">
                      <strong style="color: ${theme.primaryColor};">📅 Fecha:</strong> ${event.date}
                    </p>
                    <p style="margin: 0 0 15px 0; font-size: 16px; color: #333;">
                      <strong style="color: ${theme.primaryColor};">🕔 Hora:</strong> ${event.time}
                    </p>
                    <p style="margin: 0 0 15px 0; font-size: 16px; color: #333;">
                      <strong style="color: ${theme.primaryColor};">📍 Lugar:</strong> ${event.location}
                    </p>
                    ${event.price ? `
                    <p style="margin: 0 0 15px 0; font-size: 16px; color: #333;">
                      <strong style="color: ${theme.accentColor};">${event.price}</strong>
                    </p>
                    ` : ''}
                    ${plusOne ? `
                    <p style="margin: 0 0 15px 0; font-size: 16px; color: #333;">
                      <strong style="color: ${theme.secondaryColor};">👥 +1:</strong> Confirmado
                    </p>
                    ` : ''}
                    <p style="margin: 0; font-size: 16px; color: #333;">
                      ${event.details.split('\n').join('<br>')}
                    </p>
                  </td>
                </tr>
              </table>

              <p style="margin: 0 0 30px 0; font-size: 14px; line-height: 1.6; color: #777777;">
                Si tus planes cambian y no puedes asistir, puedes cancelar tu RSVP haciendo clic en el botón de abajo:
              </p>

              <!-- Botón de cancelación -->
              <table role="presentation" style="width: 100%; border-collapse: collapse;">
                <tr>
                  <td align="center" style="padding: 0;">
                    <a href="${cancelUrl}" style="display: inline-block; padding: 14px 30px; background-color: #dc2626; color: #ffffff; text-decoration: none; border-radius: 6px; font-size: 16px; font-weight: 600; text-align: center;">
                      Cancelar mi asistencia
                    </a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #f9f9f9; padding: 30px; text-align: center; border-top: 1px solid #eeeeee;">
              <p style="margin: 0 0 10px 0; font-size: 14px; color: #999999;">
                ¿Preguntas? Contáctanos: ${eventConfig.contact.hostEmail}
              </p>
              <p style="margin: 0; font-size: 12px; color: #aaaaaa;">
                Este email fue enviado porque confirmaste tu asistencia a ${event.title}
              </p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `.trim()
}
