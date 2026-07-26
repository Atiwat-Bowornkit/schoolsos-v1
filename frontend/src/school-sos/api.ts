import type { ApiSuccess, CreateIncidentBody, IncidentDetail, Summary, Incident } from './types'

const backend = (import.meta.env.VITE_BACKEND_URL || 'http://localhost:8787').replace(/\/$/, '')
const base = `${backend}/api/v1/incidents`

export class ApiError extends Error {
  constructor(message: string, public status: number, public code?: string) {
    super(message)
  }
}

async function request<T>(url: string, init?: Parameters<typeof fetch>[1]): Promise<T> {
  let response: Response
  try {
    response = await fetch(url, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    })
  }
  catch {
    throw new ApiError('ไม่สามารถเชื่อมต่อระบบได้ กรุณาตรวจสอบอินเทอร์เน็ตแล้วลองใหม่', 0)
  }
  const body = await response.json().catch(() => null) as any
  if (!response.ok)
    throw new ApiError(body?.error?.message ?? 'ระบบไม่สามารถดำเนินการได้', response.status, body?.error?.code)
  return body as T
}

export const incidentApi = {
  list: () => request<ApiSuccess<{ summary: Summary, items: Incident[] }>>(base),
  get: (id: string) => request<ApiSuccess<IncidentDetail>>(`${base}/${id}`),
  create: (body: CreateIncidentBody) => request<ApiSuccess<IncidentDetail>>(base, {
    method: 'POST', body: JSON.stringify(body),
  }),
  update: (id: string, body: object) => request<ApiSuccess<IncidentDetail>>(`${base}/${id}`, {
    method: 'PATCH', body: JSON.stringify(body),
  }),
  note: (id: string, body: object) => request<ApiSuccess<IncidentDetail>>(`${base}/${id}/notes`, {
    method: 'POST', body: JSON.stringify(body),
  }),
  resolve: (id: string, body: object) => request<ApiSuccess<IncidentDetail>>(`${base}/${id}/resolve`, {
    method: 'POST', body: JSON.stringify(body),
  }),
}
