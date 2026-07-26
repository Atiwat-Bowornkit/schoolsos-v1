import type { IncidentRepository } from '../domain/repositories/incident-repository'
import { IncidentHandler } from '../handlers/incident-handler'
import { IncidentService } from '../services/incident-service'

export interface Container {
  incidentHandler: IncidentHandler
}

export function createContainer(repository: IncidentRepository): Container {
  return { incidentHandler: new IncidentHandler(new IncidentService(repository)) }
}
