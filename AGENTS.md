# School SOS Repository Guide

MASTERPROMPT และ `docs/SCOPE.md` เป็น product source of truth; repository เดิมเป็น technical foundation เท่านั้น

## Boundaries

- ไม่มี AI, Login, RBAC, Users resource, KV, R2, Lambda, notification หรือ real-time
- ใช้ D1 binding `DB`; ห้ามเพิ่ม persistence ฝั่ง browser
- รักษา response envelope `{ success, data | error }`
- ห้ามส่ง `imageData` ใน List API
- ห้ามเปลี่ยน workflow `NEW → ACKNOWLEDGED → IN_PROGRESS → RESOLVED`
- migration history ห้ามแก้ `0001`; เพิ่ม migration ใหม่เท่านั้น
- ใช้ npm ใน `backend` และ pnpm 8.6.2 ใน `frontend`

ก่อนส่งมอบให้รันคำสั่งใน `README.md` และอัปเดต `docs/QA_REPORT.md` ด้วยผลจริง
