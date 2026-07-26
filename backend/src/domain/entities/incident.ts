export const INCIDENT_STATUSES = ['NEW', 'ACKNOWLEDGED', 'IN_PROGRESS', 'RESOLVED'] as const
export type IncidentStatus = (typeof INCIDENT_STATUSES)[number]

export const INCIDENT_PRIORITIES = ['LOW', 'MEDIUM', 'HIGH', 'CRITICAL'] as const
export type IncidentPriority = (typeof INCIDENT_PRIORITIES)[number]

export const INCIDENT_CATEGORIES = [
  'BUILDING_AND_FACILITIES',
  'GENERAL_SAFETY',
  'UTILITIES',
  'HEALTH_AND_ACCIDENT',
  'EQUIPMENT_AND_TECHNOLOGY',
  'CLEANLINESS_AND_HYGIENE',
  'OTHER',
] as const
export type IncidentCategory = (typeof INCIDENT_CATEGORIES)[number]

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

export interface IncidentSummaryCounts {
  new: number
  acknowledged: number
  inProgress: number
  resolved: number
}

export interface CreateIncidentInput {
  title: string
  description: string
  category: IncidentCategory
  location: string
  reportedPriority: IncidentPriority
  reporterName?: string
  imageData?: string
  imageMimeType?: string
}

export interface UpdateIncidentInput {
  actorName: string
  assignedTo?: string
  confirmedPriority?: IncidentPriority
  status?: IncidentStatus
}

export interface AddIncidentNoteInput {
  actorName: string
  message: string
}

export interface ResolveIncidentInput {
  actorName: string
  resolutionAction: string
  resolutionResult: string
  resolutionNote?: string
}
