import type { Context } from 'hono'
import type {
  AddIncidentNoteInput,
  CreateIncidentInput,
  Incident,
  ResolveIncidentInput,
  UpdateIncidentInput,
} from '../domain/entities/incident'
import { ValidationError } from '../domain/errors'
import type { IncidentService } from '../services/incident-service'

function toDto(incident: Incident) {
  return { ...incident, effectivePriority: incident.confirmedPriority ?? incident.reportedPriority }
}

function toListDto(incident: Incident) {
  const { imageData: _imageData, imageMimeType: _imageMimeType, ...safe } = toDto(incident)
  return safe
}

export class IncidentHandler {
  constructor(private readonly service: IncidentService) {}

  list = async (c: Context) => {
    const result = await this.service.listIncidents()
    return c.json({ success: true as const, data: { ...result, items: result.items.map(toListDto) } })
  }

  get = async (c: Context) => {
    const detail = await this.service.getIncident(this.param(c))
    return c.json({ success: true as const, data: { ...detail, incident: toDto(detail.incident) } })
  }

  create = async (c: Context) => {
    const detail = await this.service.createIncident(await this.json<CreateIncidentInput>(c))
    return c.json({ success: true as const, data: { ...detail, incident: toDto(detail.incident) } }, 201)
  }

  update = async (c: Context) => {
    const detail = await this.service.updateIncident(this.param(c), await this.json<UpdateIncidentInput>(c))
    return c.json({ success: true as const, data: { ...detail, incident: toDto(detail.incident) } })
  }

  note = async (c: Context) => {
    const detail = await this.service.addNote(this.param(c), await this.json<AddIncidentNoteInput>(c))
    return c.json({ success: true as const, data: { ...detail, incident: toDto(detail.incident) } })
  }

  resolve = async (c: Context) => {
    const detail = await this.service.resolveIncident(this.param(c), await this.json<ResolveIncidentInput>(c))
    return c.json({ success: true as const, data: { ...detail, incident: toDto(detail.incident) } })
  }

  private param(c: Context): string {
    const id = c.req.param('id')
    if (!id) throw new ValidationError('กรุณาระบุรหัสเหตุการณ์')
    return id
  }

  private async json<T>(c: Context): Promise<T> {
    try { return await c.req.json<T>() }
    catch { throw new ValidationError('รูปแบบ JSON ไม่ถูกต้อง') }
  }
}
