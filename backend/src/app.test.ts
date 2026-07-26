import { describe, expect, it } from 'vitest'
import { createApp } from './app'
import { createContainer } from './di/container'
import { MemoryIncidentRepository } from './infrastructure/memory/memory-incident-repository'

function testApp() {
  const container = createContainer(new MemoryIncidentRepository())
  return createApp(() => container)
}

describe('Incident API smoke', () => {
  it('uses standard envelopes and excludes images from list', async () => {
    const app = testApp()
    const createResponse = await app.request('/api/v1/incidents', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title: 'น้ำรั่วบริเวณบันได',
        description: 'พบน้ำรั่วและมีนักเรียนเดินผ่านบริเวณนี้',
        category: 'BUILDING_AND_FACILITIES',
        location: 'บันไดอาคาร 1',
        reportedPriority: 'HIGH',
      }),
    })
    expect(createResponse.status).toBe(201)
    const created = await createResponse.json() as any
    expect(created.success).toBe(true)

    const listResponse = await app.request('/api/v1/incidents')
    const list = await listResponse.json() as any
    expect(list.data.summary.new).toBe(1)
    expect(list.data.items[0].imageData).toBeUndefined()

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
})
