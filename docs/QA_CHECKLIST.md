# QA Checklist

## Automated

- [x] Backend install/test/typecheck/Worker dry-run build
- [x] Frontend frozen install/test/typecheck/lint/production build
- [x] Empty local D1 migration and idempotent seed
- [x] Unit coverage: status transition, code format/retry, closure summary, schema/image validation
- [x] API smoke: create/list/detail/not-found/mutation/note/resolve/error envelope/no image in list

## Golden Flow

- [x] Create incident through UI
- [x] Dashboard latest-first + summary
- [x] Detail image/timeline
- [x] Assign + confirmed priority
- [x] ACKNOWLEDGED → IN_PROGRESS
- [x] Add note
- [x] Resolve confirmation
- [x] RESOLVED read-only + closure

## Responsive and accessibility

- [x] Desktop table
- [x] Mobile cards
- [x] Keyboard focus and first invalid field
- [x] Labels, status text, no horizontal overflow, loading/error/not-found
- [x] Browser console ไม่มี warning/error ระหว่าง final responsive check

Empty state ครอบคลุมด้วย component branch/code review และ automated store response; seeded live session ใช้ตรวจรายการจริง
