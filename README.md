# School SOS

School SOS คือ Full-stack MVP สำหรับแจ้งเหตุ ติดตามผู้รับผิดชอบ บันทึกการดำเนินงาน และปิดเหตุภายในโรงเรียน โดยใช้ Backend API และ Cloudflare D1 เป็นแหล่งข้อมูลหลัก

## Product flow

```text
แจ้งเหตุ → NEW → กำหนดผู้รับผิดชอบและยืนยัน Priority
→ ACKNOWLEDGED → IN_PROGRESS → เพิ่มบันทึก → RESOLVED
```

ทุก mutation ฝั่งผู้จัดการต้องระบุ `actorName` และบันทึก Timeline ใน D1 transaction เดียวกับข้อมูล Incident เมื่อปิดเหตุ ระบบสร้าง Closure Summary ด้วย deterministic template โดยไม่ใช้ AI

## Stack

- Frontend: Vue 3, TypeScript, Vuetify, Pinia, Vue Router, Vite
- Backend: TypeScript, Hono, Zod, OpenAPI, Cloudflare Workers
- Database: Cloudflare D1
- Delivery: GitHub Actions, Cloudflare Workers และ Cloudflare Pages

ไม่มี Login, RBAC, AI, KV, R2, notification, real-time หรือ AWS Lambda ใน MVP นี้

## Local development

ต้องมี Node.js 22+, npm และ pnpm 8.6.2

Backend:

```powershell
cd backend
npm ci
npm run db:migrate:local
npm run db:seed:local
npm run dev
```

Frontend (อีก terminal):

```powershell
cd frontend
pnpm install --frozen-lockfile --ignore-scripts
$env:VITE_BACKEND_URL = "http://localhost:8787"
pnpm dev
```

- Frontend: `http://localhost:5173`
- Backend: `http://localhost:8787`
- OpenAPI UI: `http://localhost:8787/docs`
- OpenAPI JSON: `http://localhost:8787/openapi.json`

## Verification

```powershell
cd backend
npm test
npm run typecheck
npm run build
npm run db:migrate:local
npm run db:seed:local

cd ..\frontend
pnpm install --frozen-lockfile --ignore-scripts
pnpm test
pnpm typecheck
pnpm lint
pnpm build
```

## Configuration

Frontend:

- `VITE_BACKEND_URL`: public Worker URL หรือ `http://localhost:8787`

Backend Wrangler vars:

- `ENVIRONMENT`
- `ALLOWED_ORIGINS`: comma-separated allowlist
- D1 binding ชื่อ `DB`, database name `school-sos-db`

Production deploy ต้องมี `CLOUDFLARE_API_TOKEN`, `CLOUDFLARE_ACCOUNT_ID`, `D1_DATABASE_ID`, `PAGES_PROJECT_NAME` และ `VITE_BACKEND_URL` ใน GitHub Secrets ไม่มี seed อัตโนมัติใน production

## Documentation

- [Repository audit](docs/REPOSITORY_AUDIT.md)
- [Scope](docs/SCOPE.md)
- [Software design](docs/SDS.md)
- [API contract](docs/API_CONTRACT.md)
- [Architecture decisions](docs/DECISIONS.md)
- [QA checklist](docs/QA_CHECKLIST.md)
- [QA report](docs/QA_REPORT.md)
- [Developer handoff](docs/DEVELOPER_HANDOFF.md)
- [Deployment plan](deploy-plan.md)

## Security boundary

MVP นี้ไม่มีระบบยืนยันตัวตน จึงห้ามใช้กับข้อมูลนักเรียนหรือข้อมูลอ่อนไหวจริงก่อนเพิ่ม authentication, authorization, rate limiting, retention/backup, audit policy และ security review ภาพถูกจำกัดเป็น JPEG/PNG/WebP ขนาด decoded ไม่เกิน 1 MB และจัดเก็บใน D1
