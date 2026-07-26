# School SOS Backend

Hono API บน Cloudflare Workers ใช้ D1 เป็น persistence เดียว

```text
Router → Handler → IncidentService → IncidentRepository
                                      ├─ D1 (runtime)
                                      └─ Memory (tests)
```

## Local

```powershell
npm ci
npm run db:migrate:local
npm run db:seed:local
npm run dev
```

- Health: `http://localhost:8787/health`
- Docs: `http://localhost:8787/docs`
- OpenAPI: `http://localhost:8787/openapi.json`

## Checks

```powershell
npm test
npm run typecheck
npm run build
```

## Rules

- Workflow: `NEW → ACKNOWLEDGED → IN_PROGRESS → RESOLVED`
- ทุก manager mutation ต้องมี `actorName`
- ACK ต้องมี assignee และ confirmed priority
- Note เฉพาะ IN_PROGRESS; RESOLVED read-only
- Mutation และ Timeline ใช้ D1 batch เดียวกัน
- JPEG/PNG/WebP Data URL decoded ไม่เกิน 1 MB; List API ไม่ส่งภาพ
- ไม่มี AI, KV, Lambda, login หรือ RBAC

ดู public contract ที่ `../docs/API_CONTRACT.md`
