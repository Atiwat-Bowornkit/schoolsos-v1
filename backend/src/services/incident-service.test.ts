import { describe, expect, it } from 'vitest'
import type { CreateIncidentInput } from '../domain/entities/incident'
import { canTransitionStatus } from '../domain/status-transition'
import { MemoryIncidentRepository } from '../infrastructure/memory/memory-incident-repository'
import { createClosureSummary } from '../utils/closure-summary'
import { validateImage } from '../utils/image-validation'
import { generateIncidentCode } from '../utils/incident-code'
import { createIncidentSchema } from '../schemas/incident-schemas'
import { IncidentService } from './incident-service'

const base: CreateIncidentInput = {
  title: 'น้ำรั่วบริเวณบันไดอาคารเรียน',
  description: 'พบน้ำรั่วบริเวณบันไดและยังมีนักเรียนเดินผ่าน',
  category: 'BUILDING_AND_FACILITIES',
  location: 'บันไดอาคารเรียน 1',
  reportedPriority: 'HIGH',
}

describe('School SOS pure rules', () => {
  it('allows only forward status transitions', () => {
    expect(canTransitionStatus('NEW', 'ACKNOWLEDGED')).toBe(true)
    expect(canTransitionStatus('ACKNOWLEDGED', 'IN_PROGRESS')).toBe(true)
    expect(canTransitionStatus('IN_PROGRESS', 'RESOLVED')).toBe(true)
    expect(canTransitionStatus('NEW', 'IN_PROGRESS')).toBe(false)
    expect(canTransitionStatus('IN_PROGRESS', 'ACKNOWLEDGED')).toBe(false)
  })

  it('generates the required incident code format', () => {
    expect(generateIncidentCode(new Date('2026-07-26T00:00:00Z'), () => 0.039)).toMatch(/^SOS-20260726-[0-9A-F]{4}$/)
  })

  it('creates a deterministic closure summary', () => {
    const summary = createClosureSummary({
      id: 'id', code: 'code', ...base, assignedTo: 'ฝ่ายอาคารสถานที่',
      status: 'IN_PROGRESS', createdAt: 'now', updatedAt: 'now',
    }, 'ปิดพื้นที่และเปลี่ยนข้อต่อ', 'หยุดน้ำรั่วแล้ว')
    expect(summary).toContain('ผู้รับผิดชอบ:\nฝ่ายอาคารสถานที่')
    expect(summary).toContain('สถานะสุดท้าย:\nแก้ไขแล้ว')
  })

  it('validates request limits and image signatures', () => {
    expect(createIncidentSchema.safeParse({ ...base, title: 'x' }).success).toBe(false)
    expect(() => validateImage('data:image/png;base64,SGVsbG8=', 'image/png')).toThrow('ไม่ตรงกับประเภทไฟล์')
  })
})

describe('IncidentService golden flow', () => {
  it('creates, assigns, advances, notes and resolves', async () => {
    const service = new IncidentService(new MemoryIncidentRepository(), () => 'SOS-20260726-A4F9')
    const created = await service.createIncident(base)
    expect(created.incident.status).toBe('NEW')
    expect(created.timeline[0]?.eventType).toBe('INCIDENT_CREATED')

    await expect(service.updateIncident(created.incident.id, {
      actorName: 'ครูเวร', status: 'IN_PROGRESS',
    })).rejects.toMatchObject({ code: 'INVALID_STATUS_TRANSITION' })

    let detail = await service.updateIncident(created.incident.id, {
      actorName: 'ครูเวร',
      assignedTo: 'ฝ่ายอาคารสถานที่',
      confirmedPriority: 'HIGH',
      status: 'ACKNOWLEDGED',
    })
    expect(detail.incident.status).toBe('ACKNOWLEDGED')
    detail = await service.updateIncident(created.incident.id, {
      actorName: 'ฝ่ายอาคารสถานที่', status: 'IN_PROGRESS',
    })
    await service.addNote(created.incident.id, {
      actorName: 'ฝ่ายอาคารสถานที่', message: 'ปิดพื้นที่และติดป้ายเตือนแล้ว',
    })
    detail = await service.resolveIncident(created.incident.id, {
      actorName: 'ฝ่ายอาคารสถานที่',
      resolutionAction: 'เปลี่ยนข้อต่อท่อน้ำ',
      resolutionResult: 'หยุดการรั่วและทำความสะอาดแล้ว',
    })
    expect(detail.incident.status).toBe('RESOLVED')
    expect(detail.incident.resolvedAt).toBeTruthy()
    expect(detail.timeline.at(-1)?.eventType).toBe('INCIDENT_RESOLVED')
    await expect(service.resolveIncident(created.incident.id, {
      actorName: 'ฝ่ายอาคารสถานที่',
      resolutionAction: 'ทำซ้ำ',
      resolutionResult: 'ทำซ้ำ',
    })).rejects.toMatchObject({ code: 'INCIDENT_ALREADY_RESOLVED' })
  })

  it('retries incident code collisions', async () => {
    const repository = new MemoryIncidentRepository()
    const codes = ['SOS-20260726-AAAA', 'SOS-20260726-AAAA', 'SOS-20260726-BBBB']
    const service = new IncidentService(repository, () => codes.shift() ?? 'SOS-20260726-CCCC')
    await service.createIncident(base)
    const second = await service.createIncident({ ...base, title: 'ไฟทางเดินดับ' })
    expect(second.incident.code).toBe('SOS-20260726-BBBB')
  })
})
