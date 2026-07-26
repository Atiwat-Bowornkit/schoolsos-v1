# QA Checklist

## Automated

- [x] Backend install/test/typecheck/Worker dry-run build
- [x] Frontend frozen install/test/typecheck/lint/production build
- [x] Empty local D1 migration and idempotent seed
- [x] Unit coverage: status transition, code format/retry, closure summary, schema/image validation
- [x] API smoke: create/list/detail/not-found/mutation/note/resolve/error envelope/no image in list

## Golden Flow

- [ ] Create incident through UI
- [ ] Dashboard latest-first + summary
- [ ] Detail image/timeline
- [ ] Assign + confirmed priority
- [ ] ACKNOWLEDGED → IN_PROGRESS
- [ ] Add note
- [ ] Resolve confirmation
- [ ] RESOLVED read-only + closure

## Responsive and accessibility

- [ ] Desktop table
- [ ] Mobile cards
- [ ] Keyboard focus and first invalid field
- [ ] Labels, status text, contrast, loading/empty/error/not-found

รายการ browser จะถูกติ๊กและบันทึกหลักฐานใน `QA_REPORT.md` หลังทดสอบ local UI
