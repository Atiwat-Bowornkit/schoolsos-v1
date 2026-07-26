import type { Incident } from '../../domain/entities/incident'
import type { NewTimelineEvent, TimelineEvent } from '../../domain/entities/incident-timeline'
import type { IncidentDetail, IncidentRepository } from '../../domain/repositories/incident-repository'

export class MemoryIncidentRepository implements IncidentRepository {
  private readonly incidents = new Map<string, Incident>()
  private readonly timeline = new Map<string, TimelineEvent[]>()

  async findAll(): Promise<Incident[]> {
    return [...this.incidents.values()]
      .sort((a, b) => b.createdAt.localeCompare(a.createdAt))
      .map(item => ({ ...item, imageData: undefined, imageMimeType: undefined }))
  }

  async findDetail(id: string): Promise<IncidentDetail | null> {
    const incident = this.incidents.get(id)
    return incident
      ? { incident: { ...incident }, timeline: [...(this.timeline.get(id) ?? [])] }
      : null
  }

  async createWithTimeline(incident: Incident, event: NewTimelineEvent): Promise<boolean> {
    if ([...this.incidents.values()].some(item => item.code === incident.code)) return false
    this.incidents.set(incident.id, { ...incident })
    this.timeline.set(incident.id, [this.toEvent(event)])
    return true
  }

  async saveWithTimeline(incident: Incident, events: NewTimelineEvent[]): Promise<IncidentDetail | null> {
    if (!this.incidents.has(incident.id)) return null
    this.incidents.set(incident.id, { ...incident })
    const current = this.timeline.get(incident.id) ?? []
    current.push(...events.map(event => this.toEvent(event)))
    this.timeline.set(incident.id, current)
    return this.findDetail(incident.id)
  }

  private toEvent(event: NewTimelineEvent): TimelineEvent {
    return { ...event, id: crypto.randomUUID(), createdAt: new Date().toISOString() }
  }
}
