import type { Incident, IncidentCategory, IncidentPriority, IncidentStatus } from '../../domain/entities/incident'
import type { NewTimelineEvent, TimelineEvent, TimelineEventType } from '../../domain/entities/incident-timeline'
import type { IncidentDetail, IncidentRepository } from '../../domain/repositories/incident-repository'

interface IncidentRow {
  id: string
  code: string
  title: string
  description: string
  category: IncidentCategory
  location: string
  reporter_name: string | null
  image_data?: string | null
  image_mime_type?: string | null
  reported_priority: IncidentPriority
  confirmed_priority: IncidentPriority | null
  assigned_to: string | null
  status: IncidentStatus
  resolution_action?: string | null
  resolution_result?: string | null
  resolution_note?: string | null
  closure_summary?: string | null
  created_at: string
  updated_at: string
  resolved_at?: string | null
}

interface TimelineRow {
  id: string
  incident_id: string
  event_type: TimelineEventType
  actor_name: string | null
  message: string
  metadata_json: string | null
  created_at: string
}

const FULL_COLUMNS = `id, code, title, description, category, location, reporter_name, image_data,
 image_mime_type, reported_priority, confirmed_priority, assigned_to, status, resolution_action,
 resolution_result, resolution_note, closure_summary, created_at, updated_at, resolved_at`
const LIST_COLUMNS = `id, code, title, description, category, location, reporter_name,
 reported_priority, confirmed_priority, assigned_to, status, created_at, updated_at`

function toIncident(row: IncidentRow): Incident {
  return {
    id: row.id,
    code: row.code,
    title: row.title,
    description: row.description,
    category: row.category,
    location: row.location,
    reporterName: row.reporter_name ?? undefined,
    imageData: row.image_data ?? undefined,
    imageMimeType: row.image_mime_type ?? undefined,
    reportedPriority: row.reported_priority,
    confirmedPriority: row.confirmed_priority ?? undefined,
    assignedTo: row.assigned_to ?? undefined,
    status: row.status,
    resolutionAction: row.resolution_action ?? undefined,
    resolutionResult: row.resolution_result ?? undefined,
    resolutionNote: row.resolution_note ?? undefined,
    closureSummary: row.closure_summary ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    resolvedAt: row.resolved_at ?? undefined,
  }
}

function toTimeline(row: TimelineRow): TimelineEvent {
  return {
    id: row.id,
    incidentId: row.incident_id,
    eventType: row.event_type,
    actorName: row.actor_name ?? undefined,
    message: row.message,
    metadataJson: row.metadata_json ?? undefined,
    createdAt: row.created_at,
  }
}

export class D1IncidentRepository implements IncidentRepository {
  constructor(private readonly db: D1Database) {}

  async findAll(): Promise<Incident[]> {
    const { results } = await this.db.prepare(
      `SELECT ${LIST_COLUMNS} FROM incidents ORDER BY created_at DESC`
    ).all<IncidentRow>()
    return results.map(toIncident)
  }

  async findDetail(id: string): Promise<IncidentDetail | null> {
    const row = await this.db.prepare(`SELECT ${FULL_COLUMNS} FROM incidents WHERE id = ?`)
      .bind(id).first<IncidentRow>()
    if (!row) return null
    const { results } = await this.db.prepare(`
      SELECT id, incident_id, event_type, actor_name, message, metadata_json, created_at
      FROM incident_timeline WHERE incident_id = ? ORDER BY created_at ASC, id ASC
    `).bind(id).all<TimelineRow>()
    return { incident: toIncident(row), timeline: results.map(toTimeline) }
  }

  async createWithTimeline(incident: Incident, event: NewTimelineEvent): Promise<boolean> {
    try {
      await this.db.batch([
        this.db.prepare(`
          INSERT INTO incidents (
            id, code, title, description, category, location, reporter_name, image_data,
            image_mime_type, reported_priority, confirmed_priority, assigned_to, status,
            resolution_action, resolution_result, resolution_note, closure_summary,
            created_at, updated_at, resolved_at
          ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
        `).bind(...this.incidentValues(incident)),
        this.timelineStatement(event),
      ])
      return true
    }
    catch (error) {
      if (error instanceof Error && /unique|code/i.test(error.message)) return false
      throw error
    }
  }

  async saveWithTimeline(incident: Incident, events: NewTimelineEvent[]): Promise<IncidentDetail | null> {
    const update = this.db.prepare(`
      UPDATE incidents SET title = ?, description = ?, category = ?, location = ?, reporter_name = ?,
        image_data = ?, image_mime_type = ?, reported_priority = ?, confirmed_priority = ?,
        assigned_to = ?, status = ?, resolution_action = ?, resolution_result = ?,
        resolution_note = ?, closure_summary = ?, updated_at = ?, resolved_at = ?
      WHERE id = ?
    `).bind(
      incident.title, incident.description, incident.category, incident.location,
      incident.reporterName ?? null, incident.imageData ?? null, incident.imageMimeType ?? null,
      incident.reportedPriority, incident.confirmedPriority ?? null, incident.assignedTo ?? null,
      incident.status, incident.resolutionAction ?? null, incident.resolutionResult ?? null,
      incident.resolutionNote ?? null, incident.closureSummary ?? null, incident.updatedAt,
      incident.resolvedAt ?? null, incident.id
    )
    await this.db.batch([update, ...events.map(event => this.timelineStatement(event))])
    return this.findDetail(incident.id)
  }

  private incidentValues(incident: Incident): unknown[] {
    return [
      incident.id, incident.code, incident.title, incident.description, incident.category,
      incident.location, incident.reporterName ?? null, incident.imageData ?? null,
      incident.imageMimeType ?? null, incident.reportedPriority, incident.confirmedPriority ?? null,
      incident.assignedTo ?? null, incident.status, incident.resolutionAction ?? null,
      incident.resolutionResult ?? null, incident.resolutionNote ?? null,
      incident.closureSummary ?? null, incident.createdAt, incident.updatedAt,
      incident.resolvedAt ?? null,
    ]
  }

  private timelineStatement(event: NewTimelineEvent): D1PreparedStatement {
    return this.db.prepare(`
      INSERT INTO incident_timeline
        (id, incident_id, event_type, actor_name, message, metadata_json, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `).bind(
      crypto.randomUUID(), event.incidentId, event.eventType, event.actorName ?? null,
      event.message, event.metadataJson ?? null, new Date().toISOString()
    )
  }
}
