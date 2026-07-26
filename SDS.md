# Software Design Specification

# School SOS

**Document ID:** SDS-SCHOOL-SOS-001
**Version:** 1.0
**Document Status:** Approved for Development
**System Type:** Functional Full-Stack MVP
**Primary Language:** Thai UI / English Source Code
**Primary Development Assistant:** Codex
**Development Support:** OpenClaw Agent Team และทีม Dev
**Target Development Time:** 4–5 ชั่วโมงสำหรับ MVP

---

# 1. วัตถุประสงค์ของเอกสาร

เอกสาร Software Design Specification ฉบับนี้กำหนดรายละเอียดทางเทคนิคของระบบ School SOS เพื่อให้:

* Codex สามารถสร้างระบบส่วนหลักได้ตรงตามขอบเขต
* OpenClaw Agent สามารถรับช่วงพัฒนาได้โดยไม่ต้องวิเคราะห์ระบบใหม่ทั้งหมด
* Frontend และ Backend ใช้ Data Model และ API Contract เดียวกัน
* ทีม Dev สามารถตรวจสอบ แก้ไข และพัฒนาต่อได้ง่าย
* QA สามารถทดสอบระบบจาก Acceptance Criteria ที่ชัดเจน
* ลดความเสี่ยงจากการตีความ Scope ไม่ตรงกัน
* ป้องกันการเพิ่มฟีเจอร์เกินขอบเขตของ MVP

เอกสารนี้ถือเป็น Source of Truth สำหรับการพัฒนา School SOS

หากข้อมูลในเอกสารอื่นขัดแย้งกับเอกสารนี้ ให้ยึดเอกสารนี้เป็นหลัก เว้นแต่ทีม PM และ Tech Lead จะอนุมัติการเปลี่ยนแปลงอย่างชัดเจน

---

# 2. ภาพรวมระบบ

School SOS เป็น Web Application สำหรับแจ้ง ติดตาม และจัดการปัญหาหรือเหตุการณ์ภายในโรงเรียน

ระบบรองรับกระบวนการตั้งแต่:

```text
แจ้งเหตุ
→ สร้าง Incident
→ แสดงบน Dashboard
→ ระบุผู้รับผิดชอบ
→ กำหนด Priority
→ เปลี่ยนสถานะ
→ บันทึกการดำเนินงาน
→ ปิดเหตุ
→ สร้าง Timeline และ Closure Summary
```

ระบบเป็น Full-Stack Application ประกอบด้วย:

* Frontend Web Application
* Backend REST API
* Database
* Database Migration
* Local Development Environment
* Deployment Configuration

---

# 3. เป้าหมายของระบบ

ระบบต้องสามารถ:

1. รับข้อมูลการแจ้งเหตุจากผู้ใช้งาน
2. ตรวจสอบความถูกต้องของข้อมูล
3. สร้างรหัส Incident ที่ไม่ซ้ำ
4. บันทึก Incident ลงฐานข้อมูล
5. แสดง Incident บน Dashboard
6. แสดงรายละเอียด Incident
7. ระบุผู้รับผิดชอบ
8. กำหนดและเปลี่ยน Priority
9. เปลี่ยน Status ตามลำดับที่กำหนด
10. บันทึก Timeline ของทุกการเปลี่ยนแปลง
11. เพิ่ม Operational Note
12. ปิดเหตุพร้อมผลการดำเนินงาน
13. สร้าง Closure Summary แบบ Template
14. รองรับการใช้งานบนคอมพิวเตอร์และโทรศัพท์มือถือ
15. เตรียมโครงสร้างให้ทีมสามารถพัฒนาต่อได้

---

# 4. ขอบเขตระบบ

## 4.1 ฟีเจอร์หลัก P0

ระบบต้องมี:

* หน้าแจ้งเหตุ
* Dashboard
* Incident Detail
* สร้าง Incident
* แนบรูปภาพได้ไม่เกิน 1 ภาพ
* สร้าง Incident Code
* ระบุผู้รับผิดชอบ
* กำหนด Priority
* เปลี่ยน Status
* ตรวจสอบ Status Transition
* เพิ่ม Operational Note
* บันทึก Timeline
* Resolve Incident
* สร้าง Closure Summary
* Form Validation
* Loading State
* Empty State
* Error State
* Toast หรือ Snackbar
* Frontend เชื่อม Backend จริง
* Backend เชื่อม Database จริง
* Database Migration
* Seed Data สำหรับทดสอบ
* README
* API Contract
* QA Checklist
* Developer Handoff

## 4.2 ฟีเจอร์เสริม P1

พัฒนาได้หลัง P0 เสร็จสมบูรณ์:

* Filter ตาม Status
* Filter ตาม Priority
* Search จาก Incident Code
* Search จาก Title
* Confirmation Dialog ก่อน Resolve
* Copy Closure Summary
* Pagination
* Timeline UI แบบละเอียด
* Dashboard UI เพิ่มเติม
* Seed Data สำหรับ Demo หลายสถานะ

## 4.3 Out of Scope

ห้ามเพิ่มฟีเจอร์ต่อไปนี้ใน MVP:

* AI Runtime
* Chatbot
* AI Summary
* AI Suggested Priority
* AI Image Analysis
* Login
* Role-Based Access Control
* OAuth
* LINE Bot
* Email Notification
* SMS
* Push Notification
* WebSocket
* Real-time Synchronization
* GPS
* Maps
* Native Mobile Application
* Multi-school System
* PDF Export
* Advanced Analytics
* Approval Workflow
* Procurement Workflow
* Microservices
* GraphQL
* Cloudflare R2 หากระบบเดิมยังไม่มี
* API ภายนอกที่ไม่จำเป็น

---

# 5. ผู้ใช้งานระบบ

## 5.1 Reporter

Reporter คือผู้แจ้งเหตุ เช่น:

* นักเรียน
* ครู
* เจ้าหน้าที่
* บุคลากรในโรงเรียน

Reporter สามารถ:

* เปิดหน้าแจ้งเหตุ
* กรอกข้อมูล
* แนบรูปภาพ
* ส่ง Incident

Reporter ไม่ต้อง Login

## 5.2 Incident Manager

Incident Manager คือผู้ดำเนินการ เช่น:

* ครูเวร
* ฝ่ายอาคารสถานที่
* ฝ่ายความปลอดภัย
* เจ้าหน้าที่ไอที
* งานอนามัย
* ผู้ที่ได้รับมอบหมาย

Incident Manager สามารถ:

* ดู Dashboard
* เปิด Incident Detail
* ระบุผู้รับผิดชอบ
* กำหนด Priority
* เปลี่ยน Status
* เพิ่ม Operational Note
* Resolve Incident

เนื่องจาก MVP ไม่มี Login ผู้ดำเนินการต้องกรอกชื่อของตนเองในช่อง `actorName`

---

# 6. Golden Flow

Golden Flow ที่ระบบต้องรองรับ:

```text
1. ผู้ใช้เปิดหน้า /report
2. ผู้ใช้กรอกข้อมูล Incident
3. ผู้ใช้แนบรูปภาพได้ไม่เกิน 1 ภาพ
4. Frontend ตรวจสอบข้อมูล
5. Frontend ส่งข้อมูลไป Backend
6. Backend ตรวจสอบข้อมูลด้วย Zod
7. Backend สร้าง Incident Code
8. Backend บันทึก Incident
9. Backend สร้าง Timeline Event: INCIDENT_CREATED
10. Frontend Redirect ไป Incident Detail
11. Incident แสดงบน Dashboard
12. ผู้ดำเนินการระบุผู้รับผิดชอบ
13. Backend สร้าง Timeline Event: ASSIGNEE_CHANGED
14. ผู้ดำเนินการกำหนด Priority
15. Backend สร้าง Timeline Event: PRIORITY_CHANGED
16. ผู้ดำเนินการเปลี่ยน NEW → ACKNOWLEDGED
17. ผู้ดำเนินการเปลี่ยน ACKNOWLEDGED → IN_PROGRESS
18. ผู้ดำเนินการเพิ่ม Operational Note
19. Backend สร้าง Timeline Event: NOTE_ADDED
20. ผู้ดำเนินการกรอก Resolution
21. Backend เปลี่ยน IN_PROGRESS → RESOLVED
22. Backend สร้าง Closure Summary
23. Backend สร้าง Timeline Event: INCIDENT_RESOLVED
24. Frontend แสดง Timeline และ Closure Summary
```

---

# 7. Technology Stack

## 7.1 Frontend

```text
Vue 3
TypeScript
Vuetify
Pinia
Vue Router
Vite
```

## 7.2 Backend

```text
Hono
TypeScript
Zod
Cloudflare Workers
```

## 7.3 Database

```text
Cloudflare D1
SQLite
```

## 7.4 Deployment

```text
Cloudflare Workers
Cloudflare Pages หรือ Deployment Pattern ของ Starter Template
GitHub Actions
```

## 7.5 Development Tools

```text
Codex
OpenClaw Agent Team
Git
Node.js
Package Manager ตาม Lockfile ของ Repository
Wrangler CLI
```

---

# 8. High-Level Architecture

```text
┌───────────────────────────────┐
│          Web Browser          │
│                               │
│ Report / Dashboard / Detail   │
└───────────────┬───────────────┘
                │ HTTPS / REST
                ▼
┌───────────────────────────────┐
│       Frontend Application    │
│                               │
│ Vue 3 + Vuetify + Pinia       │
│ Router + API Client           │
└───────────────┬───────────────┘
                │ JSON API
                ▼
┌───────────────────────────────┐
│        Backend API            │
│                               │
│ Hono + Zod                    │
│ Business Rules                │
│ Status Validation             │
│ Timeline Generation           │
│ Closure Summary               │
└───────────────┬───────────────┘
                │ SQL
                ▼
┌───────────────────────────────┐
│        Cloudflare D1          │
│                               │
│ incidents                     │
│ incident_timeline             │
└───────────────────────────────┘
```

---

# 9. Architectural Principles

ระบบต้องพัฒนาตามหลักต่อไปนี้:

1. Frontend ห้ามเชื่อม Database โดยตรง
2. Business Rule ต้องอยู่ที่ Backend
3. Frontend Validation มีไว้เพื่อช่วยผู้ใช้
4. Backend Validation เป็นแหล่งตัดสินสุดท้าย
5. Timeline ต้องสร้างจาก Backend
6. Incident Code ต้องสร้างจาก Backend
7. Status Transition ต้องตรวจสอบจาก Backend
8. Closure Summary ต้องสร้างจาก Backend
9. API Client ต้องรวมอยู่ในตำแหน่งเดียว
10. ห้ามกระจาย `fetch` ไปหลาย Component
11. SQL ต้องเป็น Parameterized Query
12. ห้ามเก็บ Secret ใน Repository
13. ห้ามเพิ่ม Abstraction ที่ไม่จำเป็น
14. ต้องใช้ Convention ของ Starter Template ให้มากที่สุด
15. P0 สำคัญกว่า UI Decoration
16. ระบบต้อง Build และใช้งานได้จริง ไม่ใช่ Mock-only

---

# 10. Frontend Design

## 10.1 Frontend Responsibilities

Frontend รับผิดชอบ:

* แสดง UI
* รับข้อมูลจากผู้ใช้
* Client-side Validation
* Image Preview
* เรียก Backend API
* จัดการ Loading State
* จัดการ Error State
* แสดง Toast
* จัดการข้อมูลผ่าน Pinia Store
* แสดงวันที่ในรูปแบบที่อ่านง่าย
* รองรับ Responsive UI

Frontend ไม่รับผิดชอบ:

* สร้าง Incident Code
* ตรวจสอบ Status Transition ขั้นสุดท้าย
* สร้าง Timeline
* สร้าง Closure Summary
* เชื่อม Database โดยตรง

---

# 11. Frontend Routes

| Route              | Page               | Description                  |
| ------------------ | ------------------ | ---------------------------- |
| `/`                | Redirect           | Redirect ไป `/dashboard`     |
| `/report`          | Report Incident    | หน้าแจ้งเหตุ                 |
| `/dashboard`       | Incident Dashboard | รายการและสรุป Incident       |
| `/incidents/:id`   | Incident Detail    | รายละเอียดและจัดการ Incident |
| `/:pathMatch(.*)*` | Not Found          | หน้าไม่พบข้อมูล              |

---

# 12. Frontend Page Specification

## 12.1 Report Incident Page

Route:

```text
/report
```

### Fields

| Field              | Type     | Required | Validation                      |
| ------------------ | -------- | -------: | ------------------------------- |
| `title`            | Text     |      Yes | 3–150 ตัวอักษร                  |
| `description`      | Textarea |      Yes | 10–2,000 ตัวอักษร               |
| `category`         | Select   |      Yes | ต้องเป็นค่าที่ระบบรองรับ        |
| `location`         | Text     |      Yes | 2–200 ตัวอักษร                  |
| `reportedPriority` | Select   |      Yes | LOW, MEDIUM, HIGH, CRITICAL     |
| `reporterName`     | Text     |       No | ไม่เกิน 100 ตัวอักษร            |
| `image`            | File     |       No | JPEG, PNG, WebP และไม่เกิน 1 MB |

### UI States

* Initial
* Invalid Form
* Image Selected
* Submitting
* Submit Success
* Submit Error

### Successful Flow

```text
Submit
→ API Success
→ Toast Success
→ Redirect /incidents/:id
```

---

## 12.2 Dashboard Page

Route:

```text
/dashboard
```

### Summary Cards

* NEW
* IN_PROGRESS
* RESOLVED

`ACKNOWLEDGED` สามารถแสดงรวมในรายการโดยไม่ต้องมี Summary Card แยกใน P0

### Incident List Fields

* Code
* Title
* Category
* Location
* Effective Priority
* Status
* Assigned To
* Created At

### Effective Priority

Frontend แสดง:

```text
confirmedPriority ?? reportedPriority
```

### UI States

* Loading
* Loaded
* Empty
* Error

### Sorting

```text
createdAt DESC
```

---

## 12.3 Incident Detail Page

Route:

```text
/incidents/:id
```

### Sections

1. Incident Header
2. Incident Information
3. Image
4. Assignment and Priority
5. Status Control
6. Operational Note
7. Resolution
8. Timeline
9. Closure Summary

### Actions

* Update Assignee
* Update Confirmed Priority
* Update Status
* Add Note
* Resolve Incident

### Actor Name

`actorName` ต้องกรอกก่อนดำเนินการต่อไปนี้:

* เปลี่ยนผู้รับผิดชอบ
* เปลี่ยน Priority
* เปลี่ยน Status
* เพิ่ม Note
* Resolve Incident

---

# 13. Frontend State Management

ใช้ Pinia Store สำหรับ Incident Domain

โครงสร้างแนะนำ:

```text
frontend/src/stores/incidents.ts
```

## State

```ts
interface IncidentState {
  incidents: IncidentSummary[]
  currentIncident: IncidentDetail | null
  summary: IncidentSummaryCounts | null
  loading: boolean
  submitting: boolean
  error: string | null
}
```

## Actions

```text
fetchIncidents()
fetchIncidentById(id)
createIncident(payload)
updateIncident(id, payload)
addIncidentNote(id, payload)
resolveIncident(id, payload)
clearCurrentIncident()
clearError()
```

Frontend Agent สามารถปรับชื่อให้ตรงกับ Convention ของ Repository ได้ แต่ต้องคงความรับผิดชอบเทียบเท่ากัน

---

# 14. Frontend File Structure

โครงสร้างแนะนำ:

```text
frontend/src/
├── api/
│   └── incidents.ts
├── components/
│   └── incidents/
│       ├── IncidentCard.vue
│       ├── IncidentStatusBadge.vue
│       ├── IncidentPriorityBadge.vue
│       ├── IncidentTimeline.vue
│       ├── IncidentAssignmentForm.vue
│       ├── IncidentNoteForm.vue
│       └── IncidentResolveForm.vue
├── constants/
│   └── incidents.ts
├── pages/
│   ├── ReportIncidentPage.vue
│   ├── IncidentDashboardPage.vue
│   └── IncidentDetailPage.vue
├── stores/
│   └── incidents.ts
├── types/
│   └── incident.ts
└── utils/
    ├── image.ts
    └── date.ts
```

หาก Repository ใช้ `views` แทน `pages` ให้ใช้ Convention เดิม

---

# 15. Backend Design

## 15.1 Backend Responsibilities

Backend รับผิดชอบ:

* Request Validation
* Business Rules
* Incident Code Generation
* Database Operations
* Status Transition Validation
* Timeline Generation
* Closure Summary Generation
* Standard API Response
* Error Handling

---

# 16. Backend Module Structure

โครงสร้างแนะนำ:

```text
backend/src/
├── routes/
│   └── incidents.ts
├── schemas/
│   └── incidents.ts
├── services/
│   └── incident-service.ts
├── repositories/
│   └── incident-repository.ts
├── domain/
│   └── incident.ts
├── utils/
│   ├── incident-code.ts
│   ├── closure-summary.ts
│   └── api-response.ts
└── types/
    └── incident.ts
```

ไม่จำเป็นต้องสร้างทุก Layer หาก Codebase เดิมมีโครงสร้างที่ง่ายกว่า

กฎสำคัญ:

* ห้ามใส่ Business Logic จำนวนมากใน Route
* ห้ามสร้าง Layer ที่ไม่มีประโยชน์
* ใช้โครงสร้างเดิมของ Starter Template เป็นหลัก

---

# 17. Domain Model

## 17.1 Incident Status

```ts
export type IncidentStatus =
  | 'NEW'
  | 'ACKNOWLEDGED'
  | 'IN_PROGRESS'
  | 'RESOLVED'
```

## 17.2 Incident Priority

```ts
export type IncidentPriority =
  | 'LOW'
  | 'MEDIUM'
  | 'HIGH'
  | 'CRITICAL'
```

## 17.3 Incident Category

```ts
export type IncidentCategory =
  | 'BUILDING_AND_FACILITIES'
  | 'GENERAL_SAFETY'
  | 'UTILITIES'
  | 'HEALTH_AND_ACCIDENT'
  | 'EQUIPMENT_AND_TECHNOLOGY'
  | 'CLEANLINESS_AND_HYGIENE'
  | 'OTHER'
```

## 17.4 Timeline Event Type

```ts
export type IncidentTimelineEventType =
  | 'INCIDENT_CREATED'
  | 'ASSIGNEE_CHANGED'
  | 'PRIORITY_CHANGED'
  | 'STATUS_CHANGED'
  | 'NOTE_ADDED'
  | 'INCIDENT_RESOLVED'
```

---

# 18. Status Transition Rules

Allowed Transition:

```text
NEW → ACKNOWLEDGED
ACKNOWLEDGED → IN_PROGRESS
IN_PROGRESS → RESOLVED
```

Forbidden Transition ตัวอย่าง:

```text
NEW → IN_PROGRESS
NEW → RESOLVED
ACKNOWLEDGED → RESOLVED
RESOLVED → IN_PROGRESS
RESOLVED → NEW
```

Backend ต้องปฏิเสธ Invalid Transition

ตัวอย่าง Error:

```json
{
  "success": false,
  "error": {
    "code": "INVALID_STATUS_TRANSITION",
    "message": "ไม่สามารถเปลี่ยนสถานะจาก NEW ไปเป็น IN_PROGRESS ได้",
    "details": {
      "currentStatus": "NEW",
      "requestedStatus": "IN_PROGRESS"
    }
  }
}
```

HTTP Status ที่แนะนำ:

```text
409 Conflict
```

---

# 19. Database Design

## 19.1 Table: incidents

```sql
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
```

## 19.2 Table: incident_timeline

```sql
CREATE TABLE incident_timeline (
  id TEXT PRIMARY KEY,
  incident_id TEXT NOT NULL,
  event_type TEXT NOT NULL,
  actor_name TEXT,
  message TEXT NOT NULL,
  metadata_json TEXT,
  created_at TEXT NOT NULL,
  FOREIGN KEY (incident_id)
    REFERENCES incidents(id)
    ON DELETE CASCADE
);
```

## 19.3 Indexes

```sql
CREATE UNIQUE INDEX idx_incidents_code
ON incidents(code);

CREATE INDEX idx_incidents_status
ON incidents(status);

CREATE INDEX idx_incidents_created_at
ON incidents(created_at);

CREATE INDEX idx_incident_timeline_incident_id
ON incident_timeline(incident_id);

CREATE INDEX idx_incident_timeline_created_at
ON incident_timeline(created_at);
```

ชื่อ Migration ต้องเป็นไปตาม Convention ของ Repository

---

# 20. Incident Entity

```ts
export interface Incident {
  id: string
  code: string
  title: string
  description: string
  category: IncidentCategory
  location: string
  reporterName: string | null
  imageData: string | null
  imageMimeType: string | null
  reportedPriority: IncidentPriority
  confirmedPriority: IncidentPriority | null
  assignedTo: string | null
  status: IncidentStatus
  resolutionAction: string | null
  resolutionResult: string | null
  resolutionNote: string | null
  closureSummary: string | null
  createdAt: string
  updatedAt: string
  resolvedAt: string | null
}
```

---

# 21. Timeline Entity

```ts
export interface IncidentTimelineEntry {
  id: string
  incidentId: string
  eventType: IncidentTimelineEventType
  actorName: string | null
  message: string
  metadata: Record<string, unknown> | null
  createdAt: string
}
```

---

# 22. Incident Code Generation

Incident Code ต้องสร้างจาก Backend

รูปแบบ:

```text
SOS-YYYYMMDD-XXXX
```

ตัวอย่าง:

```text
SOS-20260726-A4F9
```

ข้อกำหนด:

* `SOS` เป็น Prefix
* ใช้วันที่สร้าง
* ส่วนท้ายเป็น Random Code
* ต้องตรวจ Unique Constraint
* หาก Code ซ้ำให้ Generate ใหม่
* ห้ามใช้ Incident Code เป็น Primary Key

Pseudo Logic:

```text
generate code
→ check collision
→ insert
→ retry when unique constraint fails
```

---

# 23. Image Handling

MVP รองรับรูปภาพสูงสุด 1 ภาพ

## Supported MIME Types

```text
image/jpeg
image/png
image/webp
```

## Maximum Size

```text
1 MB
```

## Storage

หาก Starter Template ไม่มี Object Storage:

```text
File
→ Frontend converts to Data URL
→ Backend validates MIME type and estimated size
→ Save image data in incidents.image_data
```

ข้อกำหนด:

* แยก Image Utility ออกจาก Component
* ห้าม Log Image Data
* ห้ามส่ง Image Data ใน List API
* ส่ง Image Data เฉพาะ Incident Detail API
* ออกแบบให้ย้ายไป Cloudflare R2 ภายหลังได้

---

# 24. API Design

Base Path:

```text
/api/v1
```

## 24.1 Standard Success Response

```json
{
  "success": true,
  "data": {}
}
```

## 24.2 Standard Error Response

```json
{
  "success": false,
  "error": {
    "code": "ERROR_CODE",
    "message": "ข้อความอธิบาย",
    "details": {}
  }
}
```

---

# 25. API Endpoint Summary

| Method  | Endpoint                        | Description                            |
| ------- | ------------------------------- | -------------------------------------- |
| `POST`  | `/api/v1/incidents`             | สร้าง Incident                         |
| `GET`   | `/api/v1/incidents`             | ดูรายการ Incident                      |
| `GET`   | `/api/v1/incidents/:id`         | ดูรายละเอียด Incident                  |
| `PATCH` | `/api/v1/incidents/:id`         | เปลี่ยน Assignee, Priority หรือ Status |
| `POST`  | `/api/v1/incidents/:id/notes`   | เพิ่ม Operational Note                 |
| `POST`  | `/api/v1/incidents/:id/resolve` | ปิด Incident                           |

---

# 26. Create Incident API

## Endpoint

```text
POST /api/v1/incidents
```

## Request

```json
{
  "title": "น้ำรั่วบริเวณบันไดอาคารเรียน",
  "description": "พบน้ำรั่วบริเวณบันไดและยังมีนักเรียนเดินผ่าน",
  "category": "BUILDING_AND_FACILITIES",
  "location": "บันไดอาคารเรียน 1",
  "reportedPriority": "HIGH",
  "reporterName": "ครูตัวอย่าง",
  "imageData": "data:image/jpeg;base64,...",
  "imageMimeType": "image/jpeg"
}
```

## Backend Process

```text
Validate Request
→ Validate Image
→ Generate ID
→ Generate Incident Code
→ Insert Incident
→ Insert INCIDENT_CREATED Timeline
→ Return Incident Detail
```

## Success Response

```json
{
  "success": true,
  "data": {
    "incident": {
      "id": "incident-id",
      "code": "SOS-20260726-A4F9",
      "title": "น้ำรั่วบริเวณบันไดอาคารเรียน",
      "status": "NEW"
    },
    "timeline": []
  }
}
```

---

# 27. List Incidents API

## Endpoint

```text
GET /api/v1/incidents
```

## Optional Query Parameters

```text
status
priority
search
limit
offset
```

P0 ไม่บังคับให้รองรับทุก Query Parameter

## Response

```json
{
  "success": true,
  "data": {
    "summary": {
      "new": 3,
      "acknowledged": 1,
      "inProgress": 2,
      "resolved": 8
    },
    "items": [
      {
        "id": "incident-id",
        "code": "SOS-20260726-A4F9",
        "title": "น้ำรั่วบริเวณบันไดอาคารเรียน",
        "category": "BUILDING_AND_FACILITIES",
        "location": "บันไดอาคารเรียน 1",
        "reportedPriority": "HIGH",
        "confirmedPriority": null,
        "assignedTo": null,
        "status": "NEW",
        "createdAt": "2026-07-26T08:00:00.000Z"
      }
    ]
  }
}
```

List API ไม่ควรส่ง:

* `imageData`
* `closureSummary`
* Timeline ทั้งหมด

---

# 28. Incident Detail API

## Endpoint

```text
GET /api/v1/incidents/:id
```

## Response

```json
{
  "success": true,
  "data": {
    "incident": {},
    "timeline": []
  }
}
```

Timeline เรียง:

```text
createdAt ASC
```

หากไม่พบ Incident:

```text
404 Not Found
```

Error Code:

```text
INCIDENT_NOT_FOUND
```

---

# 29. Update Incident API

## Endpoint

```text
PATCH /api/v1/incidents/:id
```

## Request

```json
{
  "actorName": "ครูเวร",
  "assignedTo": "ฝ่ายอาคารสถานที่",
  "confirmedPriority": "HIGH",
  "status": "ACKNOWLEDGED"
}
```

ทุก Field ยกเว้น `actorName` เป็น Optional แต่ต้องมีอย่างน้อยหนึ่ง Field ที่ต้องการเปลี่ยน

Backend ต้อง:

1. โหลด Incident ปัจจุบัน
2. ตรวจว่า Incident มีอยู่
3. ตรวจค่าที่เปลี่ยน
4. ตรวจ Status Transition
5. Update Incident
6. สร้าง Timeline แยกตาม Field ที่เปลี่ยนจริง
7. Return Incident ล่าสุด

ห้ามสร้าง Timeline หากค่าใหม่เท่ากับค่าเดิม

---

# 30. Add Operational Note API

## Endpoint

```text
POST /api/v1/incidents/:id/notes
```

## Request

```json
{
  "actorName": "ฝ่ายอาคารสถานที่",
  "message": "ปิดพื้นที่ชั่วคราวและติดป้ายเตือนแล้ว"
}
```

## Validation

* `actorName` บังคับ
* `message` บังคับ
* `message` 3–1,000 ตัวอักษร

Backend สร้าง:

```text
NOTE_ADDED
```

---

# 31. Resolve Incident API

## Endpoint

```text
POST /api/v1/incidents/:id/resolve
```

## Request

```json
{
  "actorName": "ฝ่ายอาคารสถานที่",
  "resolutionAction": "ปิดพื้นที่ ตรวจสอบท่อน้ำ และเปลี่ยนข้อต่อ",
  "resolutionResult": "หยุดการรั่วและทำความสะอาดพื้นที่เรียบร้อย",
  "resolutionNote": "ติดตามอาการรั่วซ้ำในวันถัดไป"
}
```

## Rules

* Incident ต้องอยู่ในสถานะ `IN_PROGRESS`
* `actorName` บังคับ
* `resolutionAction` บังคับ
* `resolutionResult` บังคับ
* `resolutionNote` ไม่บังคับ
* เปลี่ยน Status เป็น `RESOLVED`
* ตั้ง `resolvedAt`
* สร้าง Closure Summary
* สร้าง `INCIDENT_RESOLVED` Timeline
* ห้าม Resolve ซ้ำ

---

# 32. Closure Summary Template

รูปแบบ:

```text
เหตุการณ์:
{title}

สถานที่:
{location}

ผู้รับผิดชอบ:
{assignedTo หรือ "ไม่ได้ระบุ"}

การดำเนินการ:
{resolutionAction}

ผลลัพธ์:
{resolutionResult}

หมายเหตุ:
{resolutionNote หรือ "-"}

สถานะสุดท้าย:
แก้ไขแล้ว
```

Closure Summary ต้องสร้างจาก Pure Function เพื่อให้ Test ได้

---

# 33. Validation Rules

## Create Incident

| Field            | Rule                  |
| ---------------- | --------------------- |
| title            | Required, 3–150       |
| description      | Required, 10–2,000    |
| category         | Valid Enum            |
| location         | Required, 2–200       |
| reportedPriority | Valid Enum            |
| reporterName     | Optional, max 100     |
| imageMimeType    | Optional, Valid MIME  |
| imageData        | Optional, Size ≤ 1 MB |

## Update Incident

| Field             | Rule                 |
| ----------------- | -------------------- |
| actorName         | Required, 2–100      |
| assignedTo        | Optional, 2–150      |
| confirmedPriority | Optional, Valid Enum |
| status            | Optional, Valid Enum |

## Add Note

| Field     | Rule              |
| --------- | ----------------- |
| actorName | Required, 2–100   |
| message   | Required, 3–1,000 |

## Resolve Incident

| Field            | Rule                |
| ---------------- | ------------------- |
| actorName        | Required, 2–100     |
| resolutionAction | Required, 3–2,000   |
| resolutionResult | Required, 3–2,000   |
| resolutionNote   | Optional, max 2,000 |

---

# 34. Error Codes

| Error Code                  |  HTTP Status | Description                 |
| --------------------------- | -----------: | --------------------------- |
| `VALIDATION_ERROR`          | 400 หรือ 422 | ข้อมูลไม่ถูกต้อง            |
| `INCIDENT_NOT_FOUND`        |          404 | ไม่พบ Incident              |
| `INVALID_STATUS_TRANSITION` |          409 | เปลี่ยนสถานะไม่ถูกต้อง      |
| `INCIDENT_ALREADY_RESOLVED` |          409 | Incident ถูกปิดแล้ว         |
| `INVALID_IMAGE_TYPE`        |          400 | ชนิดรูปภาพไม่รองรับ         |
| `IMAGE_TOO_LARGE`           |          400 | รูปภาพเกินขนาด              |
| `INCIDENT_CODE_CONFLICT`    |          409 | Incident Code ซ้ำหลัง Retry |
| `DATABASE_ERROR`            |          500 | Database Error              |
| `INTERNAL_SERVER_ERROR`     |          500 | Error ที่ไม่คาดคิด          |

ห้ามส่ง Stack Trace ไป Client

---

# 35. Timeline Message Specification

## INCIDENT_CREATED

```text
สร้างรายการแจ้งเหตุ {code}
```

## ASSIGNEE_CHANGED

```text
เปลี่ยนผู้รับผิดชอบจาก {oldValue} เป็น {newValue}
```

## PRIORITY_CHANGED

```text
เปลี่ยนระดับความสำคัญจาก {oldValue} เป็น {newValue}
```

## STATUS_CHANGED

```text
เปลี่ยนสถานะจาก {oldStatus} เป็น {newStatus}
```

## NOTE_ADDED

ใช้ข้อความ Note เป็น Timeline Message

## INCIDENT_RESOLVED

```text
ปิดเหตุและบันทึกผลการดำเนินงานเรียบร้อยแล้ว
```

---

# 36. Security Requirements

แม้เป็น MVP ระบบต้องมีข้อกำหนดพื้นฐาน:

* Validate ทุก Request
* ใช้ Parameterized SQL
* จำกัดขนาด Request
* จำกัดขนาด Image
* จำกัด MIME Type
* ห้ามส่ง Stack Trace
* ห้าม Log Secret
* ห้าม Log Image Data
* ห้าม Commit `.env`
* ห้าม Hard-code Production Secret
* กำหนด CORS ตาม Environment
* Escape หรือ Sanitize Output ตามกลไกของ Framework
* ห้ามใช้ HTML จากผู้ใช้โดยตรง
* ห้ามใช้ `v-html` กับข้อมูลจากผู้ใช้
* Error Message ต้องไม่เปิดเผยโครงสร้างภายในระบบ

---

# 37. Performance Requirements

สำหรับ MVP:

* Dashboard ควรโหลดรายการภายในเวลาที่เหมาะสม
* List API ไม่ส่ง Image Data
* Timeline โหลดเฉพาะ Incident ที่เปิดดู
* Database มี Index ตาม Status และ Created At
* หลีกเลี่ยง Query แบบ N+1
* จำกัดรายการเมื่อจำนวนข้อมูลเพิ่มขึ้น
* เตรียมรองรับ Pagination ใน P1
* Image จำกัดขนาดไม่เกิน 1 MB

---

# 38. Responsive Design Requirements

รองรับขั้นต่ำ:

* Desktop 1280px ขึ้นไป
* Tablet 768px ขึ้นไป
* Mobile 360px ขึ้นไป

บน Mobile:

* Form ต้องไม่ล้นหน้าจอ
* Dashboard เปลี่ยนจาก Table เป็น Card ได้
* ปุ่ม Action ต้องกดง่าย
* Timeline ต้องอ่านได้
* Modal หรือ Dialog ต้องไม่กว้างเกินหน้าจอ

---

# 39. Accessibility Requirements

* Form Field ต้องมี Label
* Error Message ต้องอยู่ใกล้ Field
* สี Status ไม่ควรเป็นข้อมูลเพียงอย่างเดียว
* ปุ่มต้องมีข้อความชัดเจน
* รูปภาพต้องมี Alternative Text
* Keyboard Navigation ควรใช้งานได้ในระดับพื้นฐาน
* Contrast ต้องเหมาะสมกับการอ่าน

---

# 40. Seed Data

สร้าง Seed Data อย่างน้อย 3 รายการ

## Incident 1

```text
Title: น้ำรั่วบริเวณบันไดอาคารเรียน
Status: NEW
Priority: HIGH
Category: BUILDING_AND_FACILITIES
```

## Incident 2

```text
Title: หลอดไฟทางเดินชำรุด
Status: IN_PROGRESS
Priority: MEDIUM
Category: UTILITIES
Assigned To: ฝ่ายอาคารสถานที่
```

## Incident 3

```text
Title: พัดลมห้องเรียนไม่ทำงาน
Status: RESOLVED
Priority: MEDIUM
Category: EQUIPMENT_AND_TECHNOLOGY
Assigned To: เจ้าหน้าที่อาคาร
```

ห้ามใช้ข้อมูลบุคคลจริง

---

# 41. Testing Requirements

## 41.1 Unit Test หรือ Pure Function Test

ทดสอบ:

* Status Transition
* Invalid Status Transition
* Closure Summary
* Incident Code Format
* Zod Schema
* Image Validation Utility

## 41.2 API Test หรือ Smoke Test

ทดสอบ:

* Create Incident
* Create Validation Error
* List Incidents
* Get Incident
* Incident Not Found
* Assign Incident
* Update Priority
* Valid Status Transition
* Invalid Status Transition
* Add Note
* Resolve Incident
* Resolve จากสถานะไม่ถูกต้อง
* Invalid Image Type
* Image Too Large

## 41.3 Frontend Manual Test

ทดสอบ:

* Form Validation
* Image Preview
* Submit Loading
* Submit Success
* Submit Error
* Dashboard Loading
* Dashboard Empty
* Dashboard Error
* Incident Detail
* Assignment
* Priority
* Status
* Note
* Resolve
* Mobile Layout

---

# 42. Definition of Done

งานถือว่าเสร็จเมื่อ:

* [ ] Migration ถูกสร้าง
* [ ] Migration Apply ได้
* [ ] Incident API ทำงาน
* [ ] Report Page ทำงาน
* [ ] Dashboard ทำงาน
* [ ] Incident Detail ทำงาน
* [ ] Incident บันทึกลง D1
* [ ] Incident Code ไม่ซ้ำ
* [ ] รูปภาพผ่าน Validation
* [ ] Assignment ทำงาน
* [ ] Priority Update ทำงาน
* [ ] Status Transition ทำงาน
* [ ] Invalid Transition ถูกปฏิเสธ
* [ ] Operational Note ทำงาน
* [ ] Timeline ถูกสร้างจาก Backend
* [ ] Resolve Incident ทำงาน
* [ ] Closure Summary ถูกสร้าง
* [ ] Loading State มีครบ
* [ ] Empty State มีครบ
* [ ] Error State มีครบ
* [ ] Frontend Typecheck ผ่าน
* [ ] Backend Typecheck ผ่าน
* [ ] Frontend Build ผ่าน
* [ ] Backend Build ผ่าน
* [ ] Lint ผ่าน หรือมีรายงานข้อจำกัด
* [ ] Test ผ่าน หรือมีผล Smoke Test
* [ ] ไม่มี Secret ใน Repository
* [ ] README อัปเดต
* [ ] QA Checklist ถูกสร้าง
* [ ] Developer Handoff ถูกสร้าง
* [ ] Golden Flow ผ่าน
* [ ] ไม่มี P0 Bug ที่ยังไม่รายงาน

---

# 43. OpenClaw Development Model

OpenClaw ใช้สำหรับช่วยพัฒนาระบบ ไม่ใช่ Runtime ของ Web Application

ลำดับ Agent:

```text
PM Agent
→ Solution Designer Agent
→ Backend Agent + Frontend Agent
→ QA Agent
→ Tech Lead Agent
```

Frontend Agent และ Backend Agent สามารถทำงานคู่ขนานได้หลังจาก API Contract และ Data Model ถูกล็อก

---

# 44. OpenClaw Agent Read Order

ทุก Agent ต้องอ่านเอกสารตามลำดับ:

```text
1. AGENTS.md
2. docs/SCOPE.md
3. docs/SDS.md
4. docs/API_CONTRACT.md
5. README.md
6. Source Code ที่เกี่ยวข้อง
7. Handoff จาก Agent ก่อนหน้า
```

ห้ามเริ่มแก้โค้ดก่อนอ่านอย่างน้อย:

```text
AGENTS.md
docs/SDS.md
ไฟล์ใน Module ที่รับผิดชอบ
```

---

# 45. OpenClaw Shared Rules

ทุก Agent ต้องปฏิบัติตาม:

1. ห้ามเพิ่มฟีเจอร์นอก Scope
2. ห้ามเพิ่ม AI Runtime
3. ห้ามสร้าง Project ใหม่ซ้อน Repository
4. ห้ามแก้ `.git`
5. ห้ามลบโครงสร้างที่ยังใช้งานได้
6. ห้าม Commit Secret
7. ห้ามแก้ไฟล์นอก Ownership โดยไม่จำเป็น
8. ต้องตรวจ Typecheck และ Build หลังแก้
9. ต้องรายงาน File Changed
10. ต้องรายงานสิ่งที่ยังไม่เสร็จ
11. ห้ามกล่าวว่า Test ผ่านหากไม่ได้รัน
12. ต้องส่ง Handoff ที่ Agent ถัดไปใช้ทำงานต่อได้
13. P0 มาก่อน P1
14. Source Code เป็นหลักเมื่อเอกสารเดิมไม่ตรงกับระบบจริง
15. ต้องรักษา API Contract

---

# 46. File Ownership

## PM Agent

Primary Files:

```text
docs/SCOPE.md
docs/BUILD_PLAN.md
docs/DECISIONS.md
docs/HANDOFFS/**
```

ห้ามแก้ Source Code เว้นแต่จำเป็นเพื่อแก้เอกสารหรือ Config เล็กน้อย

## Solution Designer Agent

Primary Files:

```text
docs/SDS.md
docs/API_CONTRACT.md
docs/ARCHITECTURE.md
backend/migrations/**
shared types หรือ constants ที่ตกลงร่วมกัน
```

## Backend Agent

Primary Files:

```text
backend/**
backend/migrations/**
```

Backend Agent สามารถแก้ Shared Type ได้ตาม Contract แต่ต้องรายงานให้ Frontend Agent ทราบ

## Frontend Agent

Primary Files:

```text
frontend/**
```

Frontend Agent ห้ามแก้ Backend API Contract โดยพลการ

## QA Agent

Primary Files:

```text
docs/QA_CHECKLIST.md
docs/QA_REPORT.md
tests/**
```

QA Agent แก้ Source Code ได้เฉพาะ Bug เล็กน้อยเมื่อได้รับมอบหมาย

## Tech Lead Agent

Primary Responsibility:

```text
ทั้ง Repository
```

Tech Lead มีสิทธิ์แก้ Integration, Config, Build และ Deployment

---

# 47. Agent Task Format

ทุก Task ที่ส่งให้ OpenClaw Agent ต้องใช้รูปแบบ:

```text
Task ID:
Agent:
Objective:
Context:
Files Allowed:
Files Restricted:
Inputs:
Expected Outputs:
Acceptance Criteria:
Commands to Run:
Dependencies:
Handoff Recipient:
```

ตัวอย่าง:

```text
Task ID: BE-001
Agent: Backend Agent

Objective:
สร้าง Incident API และ Database Migration ตาม SDS

Files Allowed:
backend/**
backend/migrations/**
docs/API_CONTRACT.md

Files Restricted:
frontend/**

Expected Outputs:
- Migration
- Create Incident API
- List Incident API
- Detail API
- Update API
- Notes API
- Resolve API

Acceptance Criteria:
- Backend Typecheck ผ่าน
- Migration Apply ได้
- Golden Flow API ทำงาน
```

---

# 48. Agent Handoff Format

ทุก Agent ต้องส่ง Handoff ตามรูปแบบ:

```text
# Agent Handoff

Agent:
Task ID:
Status:

## Completed

## Files Added

## Files Modified

## Files Deleted

## Commands Run

## Verification Results

## API or Contract Changes

## Known Issues

## Risks

## Assumptions

## Recommended Next Task

## Handoff To
```

ห้ามส่งเพียงข้อความว่า “เสร็จแล้ว”

---

# 49. PM Agent Responsibilities

PM Agent ต้อง:

* ล็อก Scope
* แตก Task
* กำหนด Priority
* ระบุ Dependency
* กำหนด Agent Owner
* ติดตาม P0
* ตัด P1 เมื่อเวลาไม่พอ
* ป้องกัน Scope Creep
* เก็บ Handoff
* สรุปสถานะให้ทีมมนุษย์

PM Agent ไม่ควร:

* แก้ Architecture เองโดยไม่มี Solution Designer
* เพิ่มฟีเจอร์
* เปลี่ยน API Contract โดยไม่แจ้ง Agent ที่เกี่ยวข้อง

---

# 50. Solution Designer Responsibilities

Solution Designer ต้อง:

* ตรวจ Repository
* ตรวจ Starter Template
* ล็อก Architecture
* ล็อก Data Model
* ล็อก API Contract
* ระบุ Shared Types
* สร้าง Migration Plan
* กำหนด File Ownership
* ระบุ Integration Risk
* ส่ง Handoff ให้ Frontend และ Backend

---

# 51. Backend Agent Responsibilities

Backend Agent ต้อง:

* สร้าง Migration
* สร้าง Incident API
* สร้าง Validation
* สร้าง Status Transition
* สร้าง Timeline
* สร้าง Closure Summary
* สร้าง Error Handling
* รัน Backend Typecheck
* รัน Backend Build
* รัน API Smoke Test
* อัปเดต API Contract เมื่อมีการเปลี่ยนแปลงที่ได้รับอนุมัติ

---

# 52. Frontend Agent Responsibilities

Frontend Agent ต้อง:

* สร้าง Routes
* สร้าง Report Page
* สร้าง Dashboard
* สร้าง Incident Detail
* สร้าง API Client
* สร้าง Pinia Store
* สร้าง Loading State
* สร้าง Error State
* สร้าง Empty State
* สร้าง Toast
* สร้าง Responsive UI
* รัน Frontend Typecheck
* รัน Frontend Build

---

# 53. QA Agent Responsibilities

QA Agent ต้อง:

* อ่าน Golden Flow
* สร้าง Test Cases
* รัน API Test
* รัน Frontend Manual Test
* บันทึก Bug
* ระบุ Severity
* Retest หลังแก้
* ยืนยัน P0
* สร้าง QA Report

Bug Severity:

```text
P0 — ระบบหลักใช้งานไม่ได้
P1 — ฟีเจอร์หลักผิดพลาดแต่มีทางเลี่ยง
P2 — UI หรือปัญหารอง
```

---

# 54. Tech Lead Responsibilities

Tech Lead ต้อง:

* ตรวจ Frontend และ Backend Integration
* ตรวจ API Contract
* ตรวจ Database Migration
* ตรวจ Environment Variables
* ตรวจ CORS
* ตรวจ Build
* ตรวจ Deployment Config
* แก้ Contract Mismatch
* ตรวจ Secret
* ตรวจ Dead Code
* ตรวจ P0 Bug
* สร้าง Developer Handoff
* สรุป Release Readiness

---

# 55. OpenClaw Parallel Work Rules

สามารถทำคู่ขนานได้:

```text
Frontend Agent
Backend Agent
```

เงื่อนไข:

* Data Model ล็อกแล้ว
* API Contract ล็อกแล้ว
* Enum ล็อกแล้ว
* Endpoint ล็อกแล้ว
* Response Shape ล็อกแล้ว

Frontend ใช้ Mock Data ได้ระหว่างรอ Backend แต่ต้องใช้ Shape เดียวกับ API Contract

ห้ามสร้าง Mock-only Flow เป็นผลลัพธ์สุดท้าย

---

# 56. Source of Truth Order

เมื่อข้อมูลขัดแย้ง ให้ใช้ลำดับ:

```text
1. Approved Scope
2. SDS
3. API Contract
4. Architecture Decision
5. Source Code
6. README
7. Agent Handoff
8. Agent Assumption
```

หาก Source Code ไม่ตรงกับ Approved SDS เพราะอยู่ระหว่างพัฒนา Agent ต้องรายงาน ไม่ควรแก้ SDS เพื่อให้ตรงกับโค้ดที่ผิด

---

# 57. Change Control

การเปลี่ยนแปลงต่อไปนี้ต้องได้รับอนุมัติจาก PM และ Tech Lead:

* เพิ่ม Table
* เปลี่ยน API Endpoint
* เปลี่ยน Response Shape
* เพิ่ม Status
* เพิ่ม Priority
* เพิ่ม User Role
* เพิ่ม Authentication
* เพิ่ม External Service
* เปลี่ยน Technology Stack
* เพิ่ม P0 Feature
* เพิ่ม Dependency ขนาดใหญ่
* เปลี่ยน Deployment Architecture

ทุกการเปลี่ยนต้องบันทึกใน:

```text
docs/DECISIONS.md
```

---

# 58. Recommended Development Sequence

## Phase 1 — Repository Audit

```text
อ่าน Repository
→ ตรวจ Stack
→ ตรวจ Scripts
→ ตรวจ Config
→ ตรวจ Migration
→ ตรวจ Resource เดิม
→ สร้าง Audit
```

## Phase 2 — Foundation

```text
Domain Types
→ Constants
→ Migration
→ Database Access
→ Validation
```

## Phase 3 — Backend

```text
Create
→ List
→ Detail
→ Update
→ Note
→ Resolve
```

## Phase 4 — Frontend

```text
Router
→ API Client
→ Store
→ Report
→ Dashboard
→ Detail
```

## Phase 5 — Integration

```text
Frontend + Backend
→ Database
→ Golden Flow
```

## Phase 6 — QA

```text
Typecheck
→ Lint
→ Test
→ Build
→ Migration
→ Manual Test
```

## Phase 7 — Handoff

```text
README
→ QA Report
→ Developer Handoff
→ Release Summary
```

---

# 59. OpenClaw Completion Requirements

ก่อน Agent ระบุว่างานเสร็จ ต้องรันคำสั่งตาม Repository จริง เช่น:

```text
install
typecheck
lint
test
build
migration
```

Agent ต้องรายงาน:

```text
Command:
Result:
Exit Code:
Important Output:
```

ห้ามใช้ข้อความ:

```text
น่าจะผ่าน
ควรทำงานได้
ดูเหมือนถูกต้อง
```

โดยไม่มีผลการรันจริง

---

# 60. Developer Handoff Requirements

เอกสารส่งต่อทีม Dev ต้องมี:

* System Overview
* Architecture
* File Map
* Local Setup
* Environment Variables
* Migration Commands
* Seed Commands
* Build Commands
* Test Commands
* API Summary
* Database Schema
* Known Limitations
* Technical Debt
* Deployment Instructions
* Next Recommended Tasks
* OpenClaw Agent Entry Points

---

# 61. Acceptance Scenario

สถานการณ์ทดสอบหลัก:

```text
มีน้ำรั่วบริเวณบันไดอาคารเรียน
```

ข้อมูล:

```text
Title:
น้ำรั่วบริเวณบันไดอาคารเรียน

Description:
พบน้ำรั่วบริเวณบันไดและยังมีนักเรียนเดินผ่าน

Category:
BUILDING_AND_FACILITIES

Location:
บันไดอาคารเรียน 1

Reported Priority:
HIGH

Assigned To:
ฝ่ายอาคารสถานที่
```

Expected Flow:

```text
Create
→ NEW
→ Assign
→ Confirm Priority
→ ACKNOWLEDGED
→ IN_PROGRESS
→ Add Note
→ Resolve
→ RESOLVED
```

Expected Result:

* Incident อยู่ในฐานข้อมูล
* Incident แสดงบน Dashboard
* Timeline ครบ
* Closure Summary แสดง
* Status เป็น RESOLVED
* Resolved At มีค่า

---

# 62. Final Release Checklist

## System

* [ ] Report Page ทำงาน
* [ ] Dashboard ทำงาน
* [ ] Incident Detail ทำงาน
* [ ] Database ทำงาน
* [ ] Timeline ทำงาน
* [ ] Resolve ทำงาน

## API

* [ ] Create
* [ ] List
* [ ] Detail
* [ ] Update
* [ ] Notes
* [ ] Resolve

## Quality

* [ ] Typecheck ผ่าน
* [ ] Build ผ่าน
* [ ] Migration ผ่าน
* [ ] Test หรือ Smoke Test ผ่าน
* [ ] Golden Flow ผ่าน
* [ ] ไม่มี P0 Bug

## Security

* [ ] ไม่มี Secret
* [ ] Request Validation
* [ ] SQL Parameterized
* [ ] Image จำกัดชนิดและขนาด
* [ ] ไม่มี Stack Trace ส่ง Client

## Documentation

* [ ] README
* [ ] Scope
* [ ] SDS
* [ ] API Contract
* [ ] QA Checklist
* [ ] QA Report
* [ ] Developer Handoff
* [ ] AGENTS.md

---

# 63. สรุปการออกแบบ

School SOS ใช้สถาปัตยกรรม Full-Stack แบบเรียบง่าย โดยมี Vue 3 เป็น Frontend, Hono บน Cloudflare Workers เป็น Backend และ Cloudflare D1 เป็นฐานข้อมูล

ระบบใช้ Incident เป็น Domain หลัก และใช้ Incident Timeline สำหรับเก็บประวัติการเปลี่ยนแปลง

Business Rule สำคัญทั้งหมดอยู่ที่ Backend ได้แก่:

* การสร้าง Incident Code
* การตรวจ Status Transition
* การสร้าง Timeline
* การสร้าง Closure Summary
* การตรวจสอบข้อมูล

เอกสารนี้ออกแบบให้ Codex, OpenClaw Agent และทีม Dev สามารถพัฒนาร่วมกันได้ โดยใช้ API Contract, File Ownership, Agent Task Format และ Handoff Format ที่ชัดเจน

เป้าหมายสูงสุดคือสร้าง Functional Full-Stack MVP ที่ใช้งานได้จริงตั้งแต่การแจ้งเหตุจนถึงการปิดเหตุ และมีโครงสร้างพร้อมสำหรับการพัฒนาต่อ