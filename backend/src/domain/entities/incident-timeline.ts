export const TIMELINE_EVENT_TYPES = [
  'INCIDENT_CREATED',
  'ASSIGNEE_CHANGED',
  'PRIORITY_CHANGED',
  'STATUS_CHANGED',
  'NOTE_ADDED',
  'INCIDENT_RESOLVED',
] as const

export type TimelineEventType = (typeof TIMELINE_EVENT_TYPES)[number]

export interface TimelineEvent {
  id: string
  incidentId: string
  eventType: TimelineEventType
  actorName?: string
  message: string
  metadataJson?: string
  createdAt: string
}

export type NewTimelineEvent = Omit<TimelineEvent, 'id' | 'createdAt'>
