import type {
  AddIncidentNoteInput,
  CreateIncidentInput,
  Incident,
  IncidentSummaryCounts,
  ResolveIncidentInput,
  UpdateIncidentInput,
} from '../domain/entities/incident'
import type { NewTimelineEvent } from '../domain/entities/incident-timeline'
import { ConflictError, NotFoundError, ValidationError } from '../domain/errors'
import type { IncidentDetail, IncidentRepository } from '../domain/repositories/incident-repository'
import { canTransitionStatus } from '../domain/status-transition'
import { createClosureSummary } from '../utils/closure-summary'
import { validateImage } from '../utils/image-validation'
import { generateIncidentCode } from '../utils/incident-code'

export class IncidentService {
  constructor(
    private readonly repository: IncidentRepository,
    private readonly codeFactory: () => string = () => generateIncidentCode()
  ) {}

  async listIncidents(): Promise<{ summary: IncidentSummaryCounts, items: Incident[] }> {
    const items = await this.repository.findAll()
    return {
      summary: {
        new: items.filter(item => item.status === 'NEW').length,
        acknowledged: items.filter(item => item.status === 'ACKNOWLEDGED').length,
        inProgress: items.filter(item => item.status === 'IN_PROGRESS').length,
        resolved: items.filter(item => item.status === 'RESOLVED').length,
      },
      items,
    }
  }

  async getIncident(id: string): Promise<IncidentDetail> {
    const detail = await this.repository.findDetail(id)
    if (!detail) throw new NotFoundError()
    return detail
  }

  async createIncident(input: CreateIncidentInput): Promise<IncidentDetail> {
    validateImage(input.imageData, input.imageMimeType)
    for (let attempt = 0; attempt < 5; attempt += 1) {
      const now = new Date().toISOString()
      const incident: Incident = {
        id: crypto.randomUUID(),
        code: this.codeFactory(),
        title: input.title.trim(),
        description: input.description.trim(),
        category: input.category,
        location: input.location.trim(),
        reporterName: input.reporterName?.trim() || undefined,
        imageData: input.imageData,
        imageMimeType: input.imageMimeType,
        reportedPriority: input.reportedPriority,
        status: 'NEW',
        createdAt: now,
        updatedAt: now,
      }
      const created = await this.repository.createWithTimeline(incident, {
        incidentId: incident.id,
        eventType: 'INCIDENT_CREATED',
        actorName: incident.reporterName,
        message: `สร้างรายการแจ้งเหตุ ${incident.code}`,
      })
      if (created) return this.getIncident(incident.id)
    }
    throw new ConflictError('ไม่สามารถสร้างรหัสเหตุการณ์ที่ไม่ซ้ำได้ กรุณาลองใหม่', 'INCIDENT_CODE_CONFLICT')
  }

  async updateIncident(id: string, input: UpdateIncidentInput): Promise<IncidentDetail> {
    const detail = await this.getIncident(id)
    const incident = { ...detail.incident }
    if (incident.status === 'RESOLVED')
      throw new ConflictError('เหตุการณ์นี้ปิดแล้วและไม่สามารถแก้ไขได้', 'INCIDENT_ALREADY_RESOLVED')

    const events: NewTimelineEvent[] = []
    const actorName = input.actorName.trim()
    if (input.assignedTo !== undefined && input.assignedTo.trim() !== incident.assignedTo) {
      const previous = incident.assignedTo ?? 'ยังไม่ระบุ'
      incident.assignedTo = input.assignedTo.trim()
      events.push(this.event(id, 'ASSIGNEE_CHANGED', actorName, `เปลี่ยนผู้รับผิดชอบจาก ${previous} เป็น ${incident.assignedTo}`))
    }
    if (input.confirmedPriority !== undefined && input.confirmedPriority !== incident.confirmedPriority) {
      const previous = incident.confirmedPriority ?? 'ยังไม่ยืนยัน'
      incident.confirmedPriority = input.confirmedPriority
      events.push(this.event(id, 'PRIORITY_CHANGED', actorName, `เปลี่ยนระดับความเร่งด่วนจาก ${previous} เป็น ${input.confirmedPriority}`))
    }
    if (input.status !== undefined && input.status !== incident.status) {
      if (!canTransitionStatus(incident.status, input.status))
        throw new ConflictError(`ไม่สามารถเปลี่ยนสถานะจาก ${incident.status} เป็น ${input.status} ได้`)
      if (input.status === 'ACKNOWLEDGED' && (!incident.assignedTo || !incident.confirmedPriority))
        throw new ValidationError('กรุณาระบุผู้รับผิดชอบและยืนยันระดับความเร่งด่วนก่อนรับทราบเหตุ')
      if (input.status === 'RESOLVED')
        throw new ConflictError('กรุณาปิดเหตุผ่านแบบฟอร์มปิดเหตุ')
      const previous = incident.status
      incident.status = input.status
      events.push(this.event(id, 'STATUS_CHANGED', actorName, `เปลี่ยนสถานะจาก ${previous} เป็น ${input.status}`))
    }
    if (events.length === 0) return detail
    incident.updatedAt = new Date().toISOString()
    return await this.repository.saveWithTimeline(incident, events) ?? this.notFound()
  }

  async addNote(id: string, input: AddIncidentNoteInput): Promise<IncidentDetail> {
    const detail = await this.getIncident(id)
    if (detail.incident.status === 'RESOLVED')
      throw new ConflictError('เหตุการณ์นี้ปิดแล้วและไม่สามารถเพิ่มบันทึกได้', 'INCIDENT_ALREADY_RESOLVED')
    if (detail.incident.status !== 'IN_PROGRESS')
      throw new ValidationError('เพิ่มบันทึกได้เมื่อเหตุอยู่ระหว่างดำเนินการเท่านั้น')
    const incident = { ...detail.incident, updatedAt: new Date().toISOString() }
    return await this.repository.saveWithTimeline(incident, [
      this.event(id, 'NOTE_ADDED', input.actorName.trim(), input.message.trim()),
    ]) ?? this.notFound()
  }

  async resolveIncident(id: string, input: ResolveIncidentInput): Promise<IncidentDetail> {
    const detail = await this.getIncident(id)
    if (detail.incident.status === 'RESOLVED')
      throw new ConflictError('เหตุการณ์นี้ถูกปิดแล้ว', 'INCIDENT_ALREADY_RESOLVED')
    if (detail.incident.status !== 'IN_PROGRESS')
      throw new ConflictError('ปิดเหตุได้เฉพาะสถานะ IN_PROGRESS')
    if (!detail.incident.assignedTo)
      throw new ValidationError('กรุณาระบุผู้รับผิดชอบก่อนปิดเหตุ')
    const resolvedAt = new Date().toISOString()
    const resolutionAction = input.resolutionAction.trim()
    const resolutionResult = input.resolutionResult.trim()
    const resolutionNote = input.resolutionNote?.trim() || undefined
    const incident: Incident = {
      ...detail.incident,
      status: 'RESOLVED',
      resolutionAction,
      resolutionResult,
      resolutionNote,
      closureSummary: createClosureSummary(detail.incident, resolutionAction, resolutionResult, resolutionNote),
      resolvedAt,
      updatedAt: resolvedAt,
    }
    return await this.repository.saveWithTimeline(incident, [
      this.event(id, 'INCIDENT_RESOLVED', input.actorName.trim(), `ปิดเหตุสำเร็จ: ${resolutionResult}`),
    ]) ?? this.notFound()
  }

  private event(
    incidentId: string,
    eventType: NewTimelineEvent['eventType'],
    actorName: string,
    message: string
  ): NewTimelineEvent {
    return { incidentId, eventType, actorName, message }
  }

  private notFound(): never {
    throw new NotFoundError()
  }
}
