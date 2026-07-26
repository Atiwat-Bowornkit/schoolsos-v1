# Software Design Specification — School SOS

Version 2.0 · Product-first MVP

## Architecture

```text
Vue Page → Pinia Store → Incident API Service
                            ↓ HTTP
Hono Router → Handler → IncidentService → IncidentRepository
                                           ├─ D1 (Worker runtime)
                                           └─ Memory (tests)
```

Domain และ service ไม่ import Hono/D1 Repository contract รวม Incident mutation และ Timeline insert เป็น atomic operation; D1 implementation ใช้ `DB.batch`

## Runtime

- Frontend: Vue 3, TypeScript, Vuetify, Pinia, Vue Router, Vite
- Backend: Hono, Zod/hono-openapi, Cloudflare Workers
- Persistence: Cloudflare D1 binding `DB`
- Deploy: Worker + Pages ผ่าน GitHub Actions

## Domain

Incident เก็บ code, title, description, category, location, reporter, optional image Data URL/MIME, reported/confirmed priority, assignee, status, resolution fields, Closure Summary และ timestamps

Timeline เก็บ incident ID, event type, actor, message, optional metadata และ timestamp เรียงเก่าไปใหม่

Workflow เดียว:

```text
NEW → ACKNOWLEDGED → IN_PROGRESS → RESOLVED
```

- ACK ต้องมี assignee และ confirmed priority
- Note ทำได้เฉพาะ IN_PROGRESS
- Resolve ต้องผ่าน endpoint เฉพาะและมี action/result
- RESOLVED เป็น immutable
- ทุก manager mutation บังคับ actorName

## Incident code

รูปแบบ `SOS-YYYYMMDD-XXXX` โดยวันที่เป็น UTC และ suffix เป็น uppercase hexadecimal ระบบ retry unique collision สูงสุด 5 ครั้ง จากนั้นคืน `INCIDENT_CODE_CONFLICT`

## Image

Create รองรับภาพเดียวแบบ Data URL:

- JPEG/PNG/WebP เท่านั้น
- MIME ใน payload ต้องตรง Data URL
- magic signature ต้องตรงชนิด
- decoded bytes ไม่เกิน 1 MB
- Detail ส่ง image; List ไม่ส่ง image

## Closure Summary

pure deterministic function รวมเหตุ สถานที่ ผู้รับผิดชอบ การดำเนินการ ผลลัพธ์ optional note และสถานะสุดท้าย ไม่มี AI

## Frontend

- Explicit routes: `/dashboard`, `/report`, `/incidents/:id`, catch-all
- Dashboard มี status summary, desktop table/mobile cards, latest-first
- Report เป็น single page 3 sections พร้อม Thai validation/focus/image preview
- Detail มี contextual action panel, shared actorName, timeline, resolve confirmation และ read-only closure
- API calls อยู่ใน `school-sos/api.ts`; Pinia sync list/detail หลัง mutation

## Operational controls

- CORS ใช้ comma-separated `ALLOWED_ORIGINS`
- ไม่ log request body, image Data URL หรือ stack trace
- Error response ไม่เปิดเผย internal stack
- Migration เป็น append-only; seed local idempotent และไม่ deploy อัตโนมัติ
- CI gate: tests, lint, typecheck, build; migrate D1 ก่อน Worker deploy

## Exclusions

AI, login, RBAC, users, KV, R2, notification, real-time, Lambda, search, filter, pagination และ copy closure summary
