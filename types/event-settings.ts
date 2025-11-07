export interface EventSettings {
  id?: string
  eventId: string
  title: string
  subtitle: string
  date: string
  time: string
  location: string
  details: string
  price: {
    enabled: boolean
    amount: number
    currency: string
  }
  capacity: {
    enabled: boolean
    limit: number
  }
  backgroundImage: {
    url: string
    uploadedAt?: string
  }
  updatedAt: string
  updatedBy?: string
}

export interface EventConfig {
  event: {
    id: string
    title: string
    subtitle: string
    date: string
    time: string
    location: string
    details: string
    price: string
    capacity?: {
      enabled: boolean
      limit: number
    }
    backgroundImage?: string
  }
}
