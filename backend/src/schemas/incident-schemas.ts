import z from 'zod'
import { INCIDENT_CATEGORIES, INCIDENT_PRIORITIES, INCIDENT_STATUSES } from '../domain/entities/incident'
import { TIMELINE_EVENT_TYPES } from '../domain/entities/incident-timeline'

export const incidentStatusSchema = z.enum(INCIDENT_STATUSES)
export const incidentPrioritySchema = z.enum(INCIDENT_PRIORITIES)
export const incidentCategorySchema = z.enum(INCIDENT_CATEGORIES)

export const incidentSchema = z.object({
  id: z.uuid(),
  code: z.string(),
  title: z.string(),
  description: z.string(),
  category: incidentCategorySchema,
  location: z.string(),
  reporterName: z.string().optional(),
  imageData: z.string().optional(),
  imageMimeType: z.string().optional(),
  reportedPriority: incidentPrioritySchema,
  confirmedPriority: incidentPrioritySchema.optional(),
  effectivePriority: incidentPrioritySchema,
  assignedTo: z.string().optional(),
  status: incidentStatusSchema,
  resolutionAction: z.string().optional(),
  resolutionResult: z.string().optional(),
  resolutionNote: z.string().optional(),
  closureSummary: z.string().optional(),
  createdAt: z.iso.datetime(),
  updatedAt: z.iso.datetime(),
  resolvedAt: z.iso.datetime().optional(),
})

export const timelineSchema = z.object({
  id: z.uuid(),
  incidentId: z.uuid(),
  eventType: z.enum(TIMELINE_EVENT_TYPES),
  actorName: z.string().optional(),
  message: z.string(),
  metadataJson: z.string().optional(),
  createdAt: z.iso.datetime(),
})

export const createIncidentSchema = z.object({
  title: z.string().trim().min(3).max(150),
  description: z.string().trim().min(10).max(2000),
  category: incidentCategorySchema,
  location: z.string().trim().min(2).max(200),
  reportedPriority: incidentPrioritySchema,
  reporterName: z.string().trim().max(100).optional(),
  imageData: z.string().max(1_500_000).optional(),
  imageMimeType: z.enum(['image/jpeg', 'image/png', 'image/webp']).optional(),
}).superRefine((value, context) => {
  if (Boolean(value.imageData) !== Boolean(value.imageMimeType))
    context.addIssue({ code: 'custom', message: 'กรุณาส่ง imageData และ imageMimeType คู่กัน' })
})

export const updateIncidentSchema = z.object({
  actorName: z.string().trim().min(2).max(100),
  assignedTo: z.string().trim().min(2).max(150).optional(),
  confirmedPriority: incidentPrioritySchema.optional(),
  status: incidentStatusSchema.optional(),
}).refine(
  value => value.assignedTo !== undefined || value.confirmedPriority !== undefined || value.status !== undefined,
  { message: 'กรุณาระบุข้อมูลที่ต้องการเปลี่ยน' }
)

export const addNoteSchema = z.object({
  actorName: z.string().trim().min(2).max(100),
  message: z.string().trim().min(3).max(1000),
})

export const resolveIncidentSchema = z.object({
  actorName: z.string().trim().min(2).max(100),
  resolutionAction: z.string().trim().min(3).max(2000),
  resolutionResult: z.string().trim().min(3).max(2000),
  resolutionNote: z.string().trim().max(2000).optional(),
})

export const idParamSchema = z.object({ id: z.uuid('รหัสเหตุการณ์ไม่ถูกต้อง') })
export const detailResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({ incident: incidentSchema, timeline: z.array(timelineSchema) }),
})
export const listResponseSchema = z.object({
  success: z.literal(true),
  data: z.object({
    summary: z.object({
      new: z.number(),
      acknowledged: z.number(),
      inProgress: z.number(),
      resolved: z.number(),
    }),
    items: z.array(incidentSchema.omit({ imageData: true, imageMimeType: true })),
  }),
})
export const errorResponseSchema = z.object({
  success: z.literal(false),
  error: z.object({ code: z.string(), message: z.string(), details: z.unknown().optional() }),
})
