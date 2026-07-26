# Backend Guide

Dependency direction:

```text
router → handler → service → domain repository contract
                              ↑
                       D1 / memory implementation
```

- Domain/service ห้าม import Hono หรือ D1
- Service เป็นเจ้าของ workflow, validation เชิงธุรกิจ และ deterministic summary
- D1 repository ต้องทำ Incident mutation และ Timeline insert ด้วย `DB.batch`
- Router ใช้ Zod validator และคืน validation error envelope มาตรฐาน
- `app.ts` ควบคุม CORS และ error mapping; ห้าม log request body, Data URL หรือ stack trace
- Production runtime มี Cloudflare Worker + D1 เท่านั้น

Required checks:

```powershell
npm test
npm run typecheck
npm run build
npm run db:migrate:local
npm run db:seed:local
```
