# QA Report

วันที่: 2026-07-26 (Asia/Bangkok)

## Automated results

| Working directory | Command | Exit | Result |
| --- | --- | ---: | --- |
| `backend` | `npm test` | 0 | 2 files, 8 tests passed |
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

## Pending evidence

Local database query, live API Golden Flow และ browser desktop/mobile QA จะบันทึกเพิ่มในรอบตรวจสุดท้าย

## Production

ไม่ได้ deploy เพราะยังไม่มี Cloudflare IDs/token, Pages project และ public backend URL ที่ยืนยัน
