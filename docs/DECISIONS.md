# Architecture Decisions

## D1 is the single persistence boundary

ภาพถูกเก็บใน `incidents.image_data` เพื่อให้ MVP มี transaction boundary เดียวและไม่ต้องดูแล KV orphan การแก้ Incident และเพิ่ม Timeline ใช้ D1 `batch` เดียวกัน

## Strict forward-only workflow

รองรับเฉพาะ `NEW → ACKNOWLEDGED → IN_PROGRESS → RESOLVED` เพื่อลด state ambiguity ACK ต้องมี assignee/confirmed priority, note เฉพาะ IN_PROGRESS และ RESOLVED immutable

## Client-supplied actor in MVP

ไม่มี authentication ตาม scope จึงรับ `actorName` ทุก manager mutation และบันทึกใน Timeline ต้องเปลี่ยนเป็น identity จาก server เมื่อเพิ่ม auth

## Deterministic closure

Closure Summary สร้างจาก pure function และ template เดียวกันทุก runtime ไม่มี AI dependency หรือ nondeterministic output

## Explicit frontend

ใช้ Vue Router route table, Pinia incident store และ API service เดียว ไม่ใช้ file-based routing, demo resources หรือ persistence ใน local storage

## Append-only migration

checkout ที่ใช้งานจริงมี `0001_create_school_sos.sql` แบบ AI-first อยู่แล้ว จึงคงไฟล์นั้นโดยไม่ rewrite history และใช้ `0002_create_school_sos.sql` ลบ demo/AI-first schema (รวม `users` หากมีจาก foundation อีก variant) แล้วสร้าง product-first schema
