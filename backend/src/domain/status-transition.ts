import type { IncidentStatus } from './entities/incident'

const nextStatus: Partial<Record<IncidentStatus, IncidentStatus>> = {
  NEW: 'ACKNOWLEDGED',
  ACKNOWLEDGED: 'IN_PROGRESS',
  IN_PROGRESS: 'RESOLVED',
}

export function canTransitionStatus(current: IncidentStatus, next: IncidentStatus): boolean {
  return nextStatus[current] === next
}
