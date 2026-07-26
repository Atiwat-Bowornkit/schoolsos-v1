import type { Incident } from '../entities/incident'
import type { NewTimelineEvent, TimelineEvent } from '../entities/incident-timeline'

export interface IncidentDetail {
  incident: Incident
  timeline: TimelineEvent[]
}

export interface IncidentRepository {
  findAll(): Promise<Incident[]>
  findDetail(id: string): Promise<IncidentDetail | null>
  createWithTimeline(incident: Incident, event: NewTimelineEvent): Promise<boolean>
  saveWithTimeline(incident: Incident, events: NewTimelineEvent[]): Promise<IncidentDetail | null>
}
