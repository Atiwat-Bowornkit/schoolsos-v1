# Repository Audit

## Baseline

ฐานที่ร้องขอคือ `updoc@6ad98e0`; workspace manager คืน worktree ไปยัง branch ปัจจุบันระหว่างการสลับ จึงพัฒนาบน technical foundation ที่ checkout ได้จริงโดยไม่แก้ Git history MASTERPROMPT มีลำดับเหนือเอกสารและ UX เดิม

ก่อน rebuild:

- Backend/frontend typecheck และ build ผ่าน
- Frontend lint มี 5 errors ใน Users demo
- Local D1 migration ล้มเพราะ script ใช้ `starter-db` แต่ Wrangler ผูก `school-sos-db`
- Build ทำ generated declarations 3 ไฟล์เป็น modified
- Product เดิมมี AI/DeepSeek, KV image, Lambda/memory runtime และ template/demo navigation

## Reused

- Vue 3, TypeScript, Vuetify, Pinia, Vite
- Hono, Zod, OpenAPI, Cloudflare Workers/D1
- Clean Architecture dependency direction
- GitHub Actions และ Cloudflare Pages deployment foundation
- immutable migration history (`0001_create_school_sos.sql` ใน checkout ที่ใช้งานจริง)

## Replaced or removed

- AI handlers/services/adapters/schemas และ DeepSeek configuration
- KV cache/image repository/binding และ Lambda entry/build
- separate Timeline repository; mutation contract เป็น atomic repository operation
- old report/store/model and demo-oriented app shell/routing
- obsolete AI/API/domain/QA documents

Frontend template filesที่ไม่อยู่ใน new build graph ยังอาจคงอยู่เป็น inert technical assets; `tsconfig`, Vite และ lint scope ชี้เฉพาะ School SOS implementation ใหม่

## Database

`0002_create_school_sos.sql` ลบ schema เก่าและ Users demo table (หากมี) แล้วสร้าง `incidents`, `incident_timeline` และ indexes Seed มี 3 records พร้อม timeline/assignee/resolution แบบ idempotent

## Commands

ดูคำสั่ง canonical ที่ `README.md` และผลจริงที่ `QA_REPORT.md`

## Risks

- ไม่มี auth/RBAC; actorName เชื่อถือจาก request
- Data URL ใน D1 เหมาะกับภาพ <=1 MB และ MVP เท่านั้น
- Vuetify bundle มี chunk warning >500 kB
- Production ยังไม่ยืนยัน Cloudflare IDs/secrets/URLs
