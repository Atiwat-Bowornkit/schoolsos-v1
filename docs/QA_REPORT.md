# QA Report

วันที่: 2026-07-26 (Asia/Bangkok)

## Automated results

| Working directory | Command | Exit | Result |
| --- | --- | ---: | --- |
| `backend` | `npm test` | 0 | 2 files, 10 tests passed |
| `backend` | `npm run typecheck` | 0 | Passed |
| `backend` | `npm run build` | 0 | Worker dry-run passed |
| `backend` | `npm run db:migrate:local` | 0 | Product-first migration applied |
| `backend` | `npm run db:seed:local` | 0 | Seed executed |
| `frontend` | `pnpm test` | 0 | 1 test passed |
| `frontend` | `pnpm typecheck` | 0 | Passed |
| `frontend` | `pnpm lint` | 0 | Passed, check-only |
| `frontend` | `pnpm build` | 0 | Production build passed; Vuetify chunk warning |

## Covered in tests

Status transition, incident code UTC format/collision retry, deterministic closure summary, Zod validation, MIME/signature/size image validation, response envelope, create/list/detail/not-found, assign/priority/transitions, notes, resolve/wrong state/resolve twice และ no image leakage in list

## Local D1 evidence

- ลบเฉพาะ local Wrangler D1 state แล้วรัน migration จากฐานว่าง: `0001_create_school_sos.sql` และ `0002_create_school_sos.sql` ผ่าน
- Seed รันสองครั้งแล้วยังคง 3 incidents และ 7 timeline events
- Distribution หลัง seed: NEW 1, IN_PROGRESS 1, RESOLVED 1; resolved seed มี Closure Summary

## Live API Golden Flow

รันกับ Worker ที่ `127.0.0.1:8787`:

- health success
- Create ได้ `SOS-20260726-5B2A`
- Assign + Confirm Priority → ACKNOWLEDGED → IN_PROGRESS → Note → Resolve
- final status RESOLVED, timeline 7 events, Closure Summary present
- List response ไม่พบ `imageData`

## Browser QA

รันผ่าน in-app browser กับ Vue dev server:

- Dashboard desktop แสดง table ล่าสุดก่อนและ summary ตรง API
- Report empty submit แสดง validation ภาษาไทยและ focus input แรก
- แนบ PNG แสดง preview, filename, size และปุ่มลบ
- Submit สร้าง Incident จริง; Detail แสดงภาพและ Timeline
- บันทึก actor/assignee/confirmed priority, ACK, IN_PROGRESS และ Note สำเร็จ
- Resolve แสดง confirmation dialog; หลังยืนยันมี Closure Summary และ action panel เป็น read-only
- Incident not found และ catch-all 404 แสดง state ที่เหมาะสม
- Mobile viewport แสดง cards, summary 2 columns, ซ่อน desktop table และไม่มี horizontal overflow
- Desktop viewport แสดง table 5 rows, ซ่อน mobile list และไม่มี horizontal overflow
- ไม่พบ browser console warning/error ใน final responsive check

Vite dev ทำ dependency optimization reload ระหว่างเปิด lazy page ครั้งแรก แต่ production build และการทดสอบหลัง optimize ผ่าน

## Production

ไม่ได้ deploy เพราะยังไม่มี Cloudflare IDs/token, Pages project และ public backend URL ที่ยืนยัน
