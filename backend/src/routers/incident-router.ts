import { Hono, type Context } from 'hono'
import { describeRoute, resolver, validator } from 'hono-openapi'
import {
  addNoteSchema,
  createIncidentSchema,
  detailResponseSchema,
  errorResponseSchema,
  idParamSchema,
  listResponseSchema,
  resolveIncidentSchema,
  updateIncidentSchema,
} from '../schemas/incident-schemas'
import type { AppEnv } from '../types'

const content = (schema: Parameters<typeof resolver>[0]) => ({
  'application/json': { schema: resolver(schema) },
})

type ValidationResult = {
  success: boolean
  error?: readonly unknown[]
}

const validationHook = (result: ValidationResult, c: Context<AppEnv>) => {
  if (!result.success) {
    return c.json({
      success: false as const,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'ข้อมูลที่ส่งมาไม่ถูกต้อง',
        details: result.error,
      },
    }, 400)
  }
}

export function createIncidentRouter() {
  const router = new Hono<AppEnv>()
  router.get('/', describeRoute({
    tags: ['Incidents'], summary: 'List incidents',
    responses: { 200: { description: 'Incident list and summary', content: content(listResponseSchema) } },
  }), c => c.get('container').incidentHandler.list(c))
  router.post('/', describeRoute({
    tags: ['Incidents'], summary: 'Create incident',
    responses: {
      201: { description: 'Created', content: content(detailResponseSchema) },
      400: { description: 'Invalid input', content: content(errorResponseSchema) },
    },
  }), validator('json', createIncidentSchema, validationHook), c => c.get('container').incidentHandler.create(c))
  router.get('/:id', describeRoute({
    tags: ['Incidents'], summary: 'Get incident detail',
    responses: {
      200: { description: 'Detail', content: content(detailResponseSchema) },
      404: { description: 'Not found', content: content(errorResponseSchema) },
    },
  }), validator('param', idParamSchema, validationHook), c => c.get('container').incidentHandler.get(c))
  router.patch('/:id', validator('param', idParamSchema, validationHook), validator('json', updateIncidentSchema, validationHook),
    c => c.get('container').incidentHandler.update(c))
  router.post('/:id/notes', validator('param', idParamSchema, validationHook), validator('json', addNoteSchema, validationHook),
    c => c.get('container').incidentHandler.note(c))
  router.post('/:id/resolve', validator('param', idParamSchema, validationHook), validator('json', resolveIncidentSchema, validationHook),
    c => c.get('container').incidentHandler.resolve(c))
  return router
}
