-- Replace the AI-first demo schema with the product-first School SOS model.
DROP TABLE IF EXISTS users;
DROP TABLE IF EXISTS incident_timeline;
DROP TABLE IF EXISTS incidents;

CREATE TABLE incidents (
  id TEXT PRIMARY KEY,
  code TEXT NOT NULL UNIQUE,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  category TEXT NOT NULL,
  location TEXT NOT NULL,
  reporter_name TEXT,
  image_data TEXT,
  image_mime_type TEXT,
  reported_priority TEXT NOT NULL,
  confirmed_priority TEXT,
  assigned_to TEXT,
  status TEXT NOT NULL DEFAULT 'NEW',
  resolution_action TEXT,
  resolution_result TEXT,
  resolution_note TEXT,
  closure_summary TEXT,
  created_at TEXT NOT NULL,
  updated_at TEXT NOT NULL,
  resolved_at TEXT
);

CREATE TABLE incident_timeline (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  actor_name TEXT,
  message TEXT NOT NULL,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (incident_id) REFERENCES incidents(id) ON DELETE CASCADE
);

CREATE UNIQUE INDEX idx_incidents_code ON incidents(code);
CREATE INDEX idx_incidents_status ON incidents(status);
CREATE INDEX idx_incidents_created_at ON incidents(created_at);
CREATE INDEX idx_incident_timeline_incident_id ON incident_timeline(incident_id);
CREATE INDEX idx_incident_timeline_created_at ON incident_timeline(created_at);
