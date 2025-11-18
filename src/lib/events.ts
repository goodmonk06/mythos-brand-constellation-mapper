/**
 * Domain Events System
 *
 * Provides a type-safe event emitter for constellation domain events.
 * Enables decoupled integrations and extensions.
 */

export type DomainEventType =
  | 'symbol.created'
  | 'symbol.updated'
  | 'symbol.deleted'
  | 'pillar.created'
  | 'pillar.updated'
  | 'pillar.deleted'
  | 'link.created'
  | 'link.deleted'
  | 'relationship.created'
  | 'content.created'
  | 'content.published'
  | 'theme.created'

export interface DomainEvent<T = any> {
  type: DomainEventType
  communityId: string
  entityId: string
  data: T
  timestamp: Date
  metadata?: Record<string, any>
}

type EventHandler<T = any> = (event: DomainEvent<T>) => void | Promise<void>

class EventEmitter {
  private handlers: Map<DomainEventType, EventHandler[]> = new Map()

  /**
   * Register an event handler
   */
  on<T = any>(type: DomainEventType, handler: EventHandler<T>): void {
    const existing = this.handlers.get(type) || []
    this.handlers.set(type, [...existing, handler])
  }

  /**
   * Register a one-time event handler
   */
  once<T = any>(type: DomainEventType, handler: EventHandler<T>): void {
    const wrappedHandler: EventHandler<T> = async (event) => {
      await handler(event)
      this.off(type, wrappedHandler)
    }
    this.on(type, wrappedHandler)
  }

  /**
   * Remove an event handler
   */
  off(type: DomainEventType, handler: EventHandler): void {
    const existing = this.handlers.get(type) || []
    this.handlers.set(
      type,
      existing.filter((h) => h !== handler)
    )
  }

  /**
   * Emit an event
   */
  async emit<T = any>(event: DomainEvent<T>): Promise<void> {
    const handlers = this.handlers.get(event.type) || []

    // Execute handlers in parallel
    await Promise.allSettled(
      handlers.map((handler) =>
        Promise.resolve(handler(event)).catch((error) => {
          console.error(`Event handler error for ${event.type}:`, error)
        })
      )
    )
  }

  /**
   * Remove all handlers for a specific type
   */
  removeAllListeners(type?: DomainEventType): void {
    if (type) {
      this.handlers.delete(type)
    } else {
      this.handlers.clear()
    }
  }

  /**
   * Get count of handlers for a type
   */
  listenerCount(type: DomainEventType): number {
    return (this.handlers.get(type) || []).length
  }
}

// Global event emitter instance
export const events = new EventEmitter()

/**
 * Helper function to create domain events
 */
export function createEvent<T = any>(
  type: DomainEventType,
  communityId: string,
  entityId: string,
  data: T,
  metadata?: Record<string, any>
): DomainEvent<T> {
  return {
    type,
    communityId,
    entityId,
    data,
    timestamp: new Date(),
    metadata,
  }
}

// Example usage:
//
// events.on('symbol.created', async (event) => {
//   console.log('New symbol created:', event.data.name)
//   // Send notification, update cache, trigger webhooks, etc.
// })
