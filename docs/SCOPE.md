# School SOS MVP Scope

## P0

- แจ้งเหตุพร้อมข้อมูลพื้นฐาน Priority ผู้แจ้ง และรูปหนึ่งรูป
- Dashboard แสดงยอด 4 สถานะและรายการล่าสุดก่อน
- Detail แสดงข้อมูล รูป และ Timeline
- กำหนดผู้รับผิดชอบ ยืนยัน Priority และเปลี่ยนสถานะตามลำดับ
- เพิ่ม Operational Note ขณะ IN_PROGRESS
- Resolve ผ่าน confirmation พร้อม action/result/note และ Closure Summary
- รองรับ desktop/mobile, loading, empty, error, retry และ not-found
- REST API, OpenAPI, D1 migration/seed, automated tests และ CI

## Out of scope

Search, filter, pagination, copy closure summary, AI, login, RBAC, user management, KV, R2, notification, real-time, map และ Lambda

## Acceptance flow

Create → List → Detail → Assign + Confirm Priority → ACKNOWLEDGED → IN_PROGRESS → Note → Resolve → RESOLVED/read-only พร้อม Timeline ครบ
