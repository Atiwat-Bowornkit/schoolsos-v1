export type IncidentStatus = 'NEW' | 'ACKNOWLEDGED' | 'IN_PROGRESS' | 'RESOLVED'
export type IncidentPriority = 'LOW' | 'MEDIUM' | 'HIGH' | 'CRITICAL'
export type IncidentCategory =
  | 'BUILDING_AND_FACILITIES'
  | 'GENERAL_SAFETY'
  | 'UTILITIES'
  | 'HEALTH_AND_ACCIDENT'
  | 'EQUIPMENT_AND_TECHNOLOGY'
  | 'CLEANLINESS_AND_HYGIENE'
  | 'OTHER'

export interface Incident {
  id: string
  code: string
  title: string
  description: string
  category: IncidentCategory
  location: string
  reporterName?: string
  imageData?: string
  imageMimeType?: string
  reportedPriority: IncidentPriority
  confirmedPriority?: IncidentPriority
  effectivePriority: IncidentPriority
  assignedTo?: string
  status: IncidentStatus
  resolutionAction?: string
  resolutionResult?: string
  resolutionNote?: string
  closureSummary?: string
  createdAt: string
  updatedAt: string
  resolvedAt?: string
}

export interface TimelineEvent {
  id: string
  incidentId: string
  eventType: 'INCIDENT_CREATED' | 'ASSIGNEE_CHANGED' | 'PRIORITY_CHANGED' | 'STATUS_CHANGED' | 'NOTE_ADDED' | 'INCIDENT_RESOLVED'
  actorName?: string
  message: string
  createdAt: string
}

export interface IncidentDetail { incident: Incident, timeline: TimelineEvent[] }
export interface Summary { new: number, acknowledged: number, inProgress: number, resolved: number }
export interface ApiSuccess<T> { success: true, data: T }
export interface CreateIncidentBody {
  title: string
  description: string
  category: IncidentCategory
  location: string
  reportedPriority: IncidentPriority
  reporterName?: string
  imageData?: string
  imageMimeType?: string
}
