/**
 * Notification Adapter Interface
 *
 * Sends notifications about constellation changes via webhooks or other channels.
 */

export interface ConstellationEvent {
  type: 'symbol.created' | 'symbol.updated' | 'symbol.deleted' |
        'pillar.created' | 'pillar.updated' | 'pillar.deleted' |
        'link.created' | 'link.updated' | 'link.deleted' |
        'relationship.created' | 'content.created' | 'theme.created'
  communityId: string
  entityId: string
  entityType: string
  data: any
  timestamp: Date
}

export interface NotificationAdapter {
  /**
   * Send notification about an event
   */
  notify(event: ConstellationEvent): Promise<void>

  /**
   * Send batch notifications
   */
  notifyBatch(events: ConstellationEvent[]): Promise<void>
}

/**
 * No-Op Notification Adapter
 */
export class NoOpNotificationAdapter implements NotificationAdapter {
  async notify(event: ConstellationEvent): Promise<void> {
    // No-op
  }

  async notifyBatch(events: ConstellationEvent[]): Promise<void> {
    // No-op
  }
}

/**
 * Log Notification Adapter (logs events instead of sending)
 */
export class LogNotificationAdapter implements NotificationAdapter {
  async notify(event: ConstellationEvent): Promise<void> {
    console.log('[NOTIFICATION]', {
      type: event.type,
      entityId: event.entityId,
      timestamp: event.timestamp,
    })
  }

  async notifyBatch(events: ConstellationEvent[]): Promise<void> {
    console.log('[NOTIFICATION BATCH]', {
      count: events.length,
      types: events.map(e => e.type),
    })
  }
}

/**
 * Webhook Notification Adapter
 */
export class WebhookNotificationAdapter implements NotificationAdapter {
  constructor(private webhookUrl: string) {}

  async notify(event: ConstellationEvent): Promise<void> {
    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(event),
      })
    } catch (error) {
      console.error('Webhook notification failed:', error)
    }
  }

  async notifyBatch(events: ConstellationEvent[]): Promise<void> {
    try {
      await fetch(this.webhookUrl, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ events }),
      })
    } catch (error) {
      console.error('Webhook batch notification failed:', error)
    }
  }
}

// Factory function
export function createNotificationAdapter(): NotificationAdapter {
  const webhookUrl = process.env.WEBHOOK_URL

  if (webhookUrl) {
    return new WebhookNotificationAdapter(webhookUrl)
  }

  if (process.env.NODE_ENV === 'development') {
    return new LogNotificationAdapter()
  }

  return new NoOpNotificationAdapter()
}
