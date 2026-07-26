# Developer Handoff

## Current state

School SOS P0 ถูก rebuild เป็น Vue SPA + Hono Worker + D1 มี strict workflow, atomic timeline, deterministic closure และ responsive UI ไม่มี production deployment หรือ Git commit

## Entry points

- Backend: `backend/src/server.ts`, app wiring `backend/src/app.ts`
- Domain rules: `backend/src/services/incident-service.ts`
- D1: `backend/src/infrastructure/d1/d1-incident-repository.ts`
- Schema: `backend/migrations/0002_create_school_sos.sql`
- Frontend: `frontend/src/main.ts`, routes `frontend/src/router.ts`
- UI: `frontend/src/school-sos`
- CI: `.github/workflows/deploy.yml`

## Run locally

รัน migration/seed/backend และ frontend ตาม `README.md` Seed ทำซ้ำได้โดยไม่สร้าง record ซ้ำ

## Invariants

- ห้าม transition ย้อน/ข้าม
- ACK ต้องมี assignedTo และ confirmedPriority
- Note เฉพาะ IN_PROGRESS
- Resolve เฉพาะ IN_PROGRESS; หลัง RESOLVED ห้าม mutation
- Incident update กับ Timeline ต้อง atomic
- List ห้ามส่ง imageData

## Deployment handoff

ต้องรับ Cloudflare Account ID/API token, production D1 ID, Pages project และ public Worker URL ก่อน deploy จากนั้นตั้ง GitHub Secrets ตาม `deploy-plan.md` CI migrate ก่อน Worker deploy และไม่ seed production

## Follow-up before real users

เพิ่ม authentication/authorization, server-derived actor, rate limiting, retention/backup, security/PII review, observability และ integration tests บน Cloudflare environment จริง

ผลตรวจล่าสุดและ known limitation อยู่ใน `QA_REPORT.md`
