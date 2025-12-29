/**
 * Event type definition for multi-party support
 */
export interface Event {
    id?: string
    slug: string           // URL-friendly identifier (e.g., 'andrreas')
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
    theme: {
        primaryColor: string
        secondaryColor: string
        accentColor: string
        backgroundColor: string
        textColor: string
    }
    contact: {
        hostName: string
        hostEmail: string
        hostPhone?: string
    }
    isActive: boolean      // Can guests still RSVP?
    createdAt: string
    updatedAt: string
}

/**
 * Input type for creating a new event (without auto-generated fields)
 */
export type CreateEventInput = Omit<Event, 'id' | 'createdAt' | 'updatedAt'>

/**
 * Input type for updating an event (all fields optional)
 */
export type UpdateEventInput = Partial<Omit<Event, 'id' | 'createdAt'>>
