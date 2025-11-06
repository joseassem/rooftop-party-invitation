import * as admin from 'firebase-admin'
import * as dotenv from 'dotenv'

// Cargar variables de entorno
dotenv.config({ path: '.env.local' })

// Inicializar Firebase Admin
const privateKey = process.env.GOOGLE_CLOUD_PRIVATE_KEY
const formattedKey = privateKey?.includes('\\n') 
  ? privateKey.replace(/\\n/g, '\n')
  : privateKey

if (!admin.apps.length) {
  admin.initializeApp({
    credential: admin.credential.cert({
      projectId: process.env.GOOGLE_CLOUD_PROJECT_ID!,
      privateKey: formattedKey,
      clientEmail: process.env.GOOGLE_CLOUD_CLIENT_EMAIL!,
    }),
  })
}

const db = admin.firestore()
const collectionName = process.env.FIRESTORE_COLLECTION_NAME || 'rsvps'

const demoRSVPs = [
  {
    name: 'José Assem',
    email: 'joseassem@gmail.com',
    phone: '+52 1 55 1234 5678',
    plusOne: true,
    status: 'confirmed',
    createdAt: new Date().toISOString(),
    emailSent: new Date().toISOString()
  },
  {
    name: 'María González',
    email: 'maria.gonzalez@example.com',
    phone: '+52 1 55 2345 6789',
    plusOne: false,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 86400000).toISOString(), // 1 día atrás
  },
  {
    name: 'Carlos Ramírez',
    email: 'carlos.ramirez@example.com',
    phone: '+52 1 55 3456 7890',
    plusOne: true,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 172800000).toISOString(), // 2 días atrás
    emailSent: new Date(Date.now() - 86400000).toISOString()
  },
  {
    name: 'Ana López',
    email: 'ana.lopez@example.com',
    phone: '+52 1 55 4567 8901',
    plusOne: false,
    status: 'cancelled',
    createdAt: new Date(Date.now() - 259200000).toISOString(), // 3 días atrás
    emailSent: new Date(Date.now() - 172800000).toISOString()
  },
  {
    name: 'Luis Martínez',
    email: 'luis.martinez@example.com',
    phone: '+52 1 55 5678 9012',
    plusOne: true,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 345600000).toISOString(), // 4 días atrás
  },
  {
    name: 'Laura Fernández',
    email: 'laura.fernandez@example.com',
    phone: '+52 1 55 6789 0123',
    plusOne: false,
    status: 'cancelled',
    createdAt: new Date(Date.now() - 432000000).toISOString(), // 5 días atrás
  },
  {
    name: 'Pedro Sánchez',
    email: 'pedro.sanchez@example.com',
    phone: '+52 1 55 7890 1234',
    plusOne: true,
    status: 'confirmed',
    createdAt: new Date(Date.now() - 518400000).toISOString(), // 6 días atrás
    emailSent: new Date(Date.now() - 259200000).toISOString()
  }
]

async function addDemoData() {
  try {
    console.log('🚀 Agregando datos demo a Firestore...')
    console.log(`📦 Colección: ${collectionName}`)
    
    for (const rsvp of demoRSVPs) {
      const docRef = await db.collection(collectionName).add(rsvp)
      console.log(`✅ Agregado: ${rsvp.name} (ID: ${docRef.id})`)
    }
    
    console.log('\n✨ ¡Datos demo agregados exitosamente!')
    console.log(`📊 Total: ${demoRSVPs.length} RSVPs`)
    console.log(`✅ Confirmados: ${demoRSVPs.filter(r => r.status === 'confirmed').length}`)
    console.log(`❌ Cancelados: ${demoRSVPs.filter(r => r.status === 'cancelled').length}`)
    console.log(`👥 Con +1: ${demoRSVPs.filter(r => r.plusOne).length}`)
    console.log(`📧 Con email enviado: ${demoRSVPs.filter(r => r.emailSent).length}`)
    
    process.exit(0)
  } catch (error) {
    console.error('❌ Error agregando datos demo:', error)
    process.exit(1)
  }
}

addDemoData()
