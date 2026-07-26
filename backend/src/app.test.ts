import { describe, expect, it } from 'vitest'
import { createApp } from './app'
import { createContainer } from './di/container'
import { MemoryIncidentRepository } from './infrastructure/memory/memory-incident-repository'

function testApp() {
  const container = createContainer(new MemoryIncidentRepository())
  return createApp(() => container)
}

const createBody = {
  title: 'น้ำรั่วบริเวณบันได',
  description: 'พบน้ำรั่วและมีนักเรียนเดินผ่านบริเวณนี้',
  category: 'BUILDING_AND_FACILITIES',
  location: 'บันไดอาคาร 1',
  reportedPriority: 'HIGH',
}

async function jsonRequest(app: ReturnType<typeof testApp>, path: string, method = 'GET', body?: object) {
  const response = await app.request(path, {
    method,
    headers: body ? { 'Content-Type': 'application/json' } : undefined,
    body: body ? JSON.stringify(body) : undefined,
  })
  return { response, body: await response.json() as any }
}

function toBase64(bytes: Uint8Array): string {
  let binary = ''
  for (let offset = 0; offset < bytes.length; offset += 0x8000)
    binary += String.fromCharCode(...bytes.subarray(offset, offset + 0x8000))
  return btoa(binary)
}

describe('Incident API smoke', () => {
  it('uses standard envelopes and excludes images from list', async () => {
    const app = testApp()
    const createResponse = await app.request('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        ...createBody,
        imageData: 'data:image/png;base64,iVBORw0KGgo=',
        imageMimeType: 'image/png',
      }),
    })
    expect(createResponse.status).toBe(201)
    const created = await createResponse.json() as any
    expect(created.success).toBe(true)

    const listResponse = await app.request('/api/v1/incidents')
    const list = await listResponse.json() as any
    expect(list.success).toBe(true)
    expect(list.data.summary.new).toBe(1)
    expect(list.data.items[0].imageData).toBeUndefined()
    expect(list.data.items[0].imageMimeType).toBeUndefined()

    const detail = await jsonRequest(app, `/api/v1/incidents/${created.data.incident.id}`)
    expect(detail.response.status).toBe(200)
    expect(detail.body.success).toBe(true)
    expect(detail.body.data.incident.imageData).toContain('data:image/png')
    expect(detail.body.data.timeline).toHaveLength(1)

    const missing = await app.request('/api/v1/incidents/00000000-0000-4000-8000-000000000000')
    const missingBody = await missing.json() as any
    expect(missing.status).toBe(404)
    expect(missingBody.error.code).toBe('INCIDENT_NOT_FOUND')
  })

  it('rejects invalid input', async () => {
    const response = await testApp().request('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ title: 'x' }),
    })
    expect(response.status).toBe(400)
    const body = await response.json() as any
    expect(body.success).toBe(false)
    expect(body.error.code).toBe('VALIDATION_ERROR')
  })

  it('covers manager workflow, conflicts, notes and immutable resolution', async () => {
    const app = testApp()
    const created = await jsonRequest(app, '/api/v1/incidents', 'POST', createBody)
    const id = created.body.data.incident.id as string
    expect(created.response.status).toBe(201)

    const skipped = await jsonRequest(app, `/api/v1/incidents/${id}`, 'PATCH', {
      actorName: 'ครูเวร',
      status: 'IN_PROGRESS',
    })
    expect(skipped.response.status).toBe(409)
    expect(skipped.body).toMatchObject({ success: false, error: { code: 'INVALID_STATUS_TRANSITION' } })

    const earlyNote = await jsonRequest(app, `/api/v1/incidents/${id}/notes`, 'POST', {
      actorName: 'ครูเวร',
      message: 'ยังไม่ควรบันทึก',
    })
    expect(earlyNote.response.status).toBe(400)
    expect(earlyNote.body.success).toBe(false)

    const earlyResolve = await jsonRequest(app, `/api/v1/incidents/${id}/resolve`, 'POST', {
      actorName: 'ครูเวร',
      resolutionAction: 'ตรวจสอบแล้ว',
      resolutionResult: 'เรียบร้อยแล้ว',
    })
    expect(earlyResolve.response.status).toBe(409)

    const acknowledged = await jsonRequest(app, `/api/v1/incidents/${id}`, 'PATCH', {
      actorName: 'ครูเวร',
      assignedTo: 'ฝ่ายอาคารสถานที่',
      confirmedPriority: 'CRITICAL',
      status: 'ACKNOWLEDGED',
    })
    expect(acknowledged.response.status).toBe(200)
    expect(acknowledged.body.data.incident).toMatchObject({
      assignedTo: 'ฝ่ายอาคารสถานที่',
      confirmedPriority: 'CRITICAL',
      status: 'ACKNOWLEDGED',
    })

    const inProgress = await jsonRequest(app, `/api/v1/incidents/${id}`, 'PATCH', {
      actorName: 'ฝ่ายอาคารสถานที่',
      status: 'IN_PROGRESS',
    })
    expect(inProgress.body.data.incident.status).toBe('IN_PROGRESS')

    const note = await jsonRequest(app, `/api/v1/incidents/${id}/notes`, 'POST', {
      actorName: 'ฝ่ายอาคารสถานที่',
      message: 'ปิดพื้นที่และเปลี่ยนข้อต่อแล้ว',
    })
    expect(note.response.status).toBe(200)
    expect(note.body.data.timeline.at(-1).eventType).toBe('NOTE_ADDED')

    const resolved = await jsonRequest(app, `/api/v1/incidents/${id}/resolve`, 'POST', {
      actorName: 'ฝ่ายอาคารสถานที่',
      resolutionAction: 'เปลี่ยนข้อต่อท่อน้ำ',
      resolutionResult: 'หยุดน้ำรั่วและเปิดพื้นที่แล้ว',
      resolutionNote: 'ตรวจซ้ำไม่พบการรั่ว',
    })
    expect(resolved.response.status).toBe(200)
    expect(resolved.body.data.incident.status).toBe('RESOLVED')
    expect(resolved.body.data.incident.closureSummary).toContain('สถานะสุดท้าย')

    const resolvedAgain = await jsonRequest(app, `/api/v1/incidents/${id}/resolve`, 'POST', {
      actorName: 'ฝ่ายอาคารสถานที่',
      resolutionAction: 'ทำซ้ำอีกครั้ง',
      resolutionResult: 'ทำซ้ำอีกครั้ง',
    })
    expect(resolvedAgain.response.status).toBe(409)
    expect(resolvedAgain.body.error.code).toBe('INCIDENT_ALREADY_RESOLVED')

    const editResolved = await jsonRequest(app, `/api/v1/incidents/${id}`, 'PATCH', {
      actorName: 'ครูเวร',
      assignedTo: 'ฝ่ายอื่น',
    })
    expect(editResolved.response.status).toBe(409)
    expect(editResolved.body.error.code).toBe('INCIDENT_ALREADY_RESOLVED')
  })

  it('rejects unchanged patches and invalid or oversized images', async () => {
    const app = testApp()
    const created = await jsonRequest(app, '/api/v1/incidents', 'POST', createBody)
    const id = created.body.data.incident.id as string

    const emptyPatch = await jsonRequest(app, `/api/v1/incidents/${id}`, 'PATCH', {
      actorName: 'ครูเวร',
    })
    expect(emptyPatch.response.status).toBe(400)
    expect(emptyPatch.body.error.code).toBe('VALIDATION_ERROR')

    const invalidImage = await jsonRequest(app, '/api/v1/incidents', 'POST', {
      ...createBody,
      imageData: 'data:image/png;base64,SGVsbG8=',
      imageMimeType: 'image/png',
    })
    expect(invalidImage.response.status).toBe(400)
    expect(invalidImage.body.error.code).toBe('INVALID_IMAGE_TYPE')

    const oversizedBytes = new Uint8Array(1024 * 1024 + 1)
    oversizedBytes.set([0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A])
    const oversizedImage = await jsonRequest(app, '/api/v1/incidents', 'POST', {
      ...createBody,
      imageData: `data:image/png;base64,${toBase64(oversizedBytes)}`,
      imageMimeType: 'image/png',
    })
    expect(oversizedImage.response.status).toBe(400)
    expect(oversizedImage.body.error.code).toBe('IMAGE_TOO_LARGE')
  })
})
