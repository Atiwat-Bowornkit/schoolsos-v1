import { Scalar } from '@scalar/hono-api-reference'
import { Hono } from 'hono'
import { cors } from 'hono/cors'
import { openAPIRouteHandler } from 'hono-openapi'
import type { Container } from './di/container'
import { AppError } from './domain/errors'
import { createApiRouter } from './routers'
import type { AppEnv, Bindings } from './types'

export function createApp(containerFactory: (env: Partial<Bindings>) => Container) {
  const app = new Hono<AppEnv>()
  app.use('*', cors({
    origin: (origin, c) => {
      const allowed = (c.env?.ALLOWED_ORIGINS ?? 'http://localhost:5173')
        .split(',').map((value: string) => value.trim())
      return allowed.includes(origin) ? origin : allowed[0] ?? ''
    },
  }))
  app.use('*', async (c, next) => {
    c.set('container', containerFactory(c.env ?? {}))
    await next()
  })
  app.get('/health', c => c.json({ success: true, data: { status: 'ok' } }))
  app.route('/api/v1', createApiRouter())
  app.get('/openapi.json', openAPIRouteHandler(app, {
    documentation: {
      info: {
        title: 'School SOS API',
        version: '1.0.0',
        description: 'ระบบแจ้ง ประสานงาน ติดตาม และปิดเหตุภายในโรงเรียน',
      },
      tags: [{ name: 'Incidents', description: 'Incident workflow and timeline' }],
    },
  }))
  app.get('/docs', Scalar({ url: '/openapi.json', pageTitle: 'School SOS API' }))
  app.notFound(c => c.json({
    success: false as const,
    error: { code: 'INCIDENT_NOT_FOUND', message: 'ไม่พบหน้าหรือข้อมูลที่ต้องการ' },
  }, 404))
  app.onError((error, c) => {
    if (error instanceof AppError) {
      return c.json({
        success: false as const,
        error: { code: error.code, message: error.message, ...(error.details ? { details: error.details } : {}) },
      }, error.status as 400)
    }
    console.error('Unhandled School SOS error')
    return c.json({
      success: false as const,
      error: { code: 'INTERNAL_SERVER_ERROR', message: 'ระบบไม่สามารถดำเนินการได้ กรุณาลองใหม่' },
    }, 500)
  })
  return app
}
