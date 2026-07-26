# Public API Contract

Base path: `/api/v1`

Success:

```json
{ "success": true, "data": {} }
```

Error:

```json
{ "success": false, "error": { "code": "VALIDATION_ERROR", "message": "...", "details": [] } }
```

Validation ใช้ 400, not found ใช้ 404 และ workflow conflict ใช้ 409

| Method | Path | Purpose |
| --- | --- | --- |
| GET | `/health` | Health check |
| GET | `/docs` | OpenAPI UI |
| GET | `/openapi.json` | OpenAPI document |
| POST | `/api/v1/incidents` | Create |
| GET | `/api/v1/incidents` | List + summary |
| GET | `/api/v1/incidents/:id` | Detail + timeline |
| PATCH | `/api/v1/incidents/:id` | Assign, confirm priority, status |
| POST | `/api/v1/incidents/:id/notes` | Add IN_PROGRESS note |
| POST | `/api/v1/incidents/:id/resolve` | Resolve |

`PATCH` body ต้องมี `actorName` และอย่างน้อยหนึ่งใน `assignedTo`, `confirmedPriority`, `status` Timeline จะเกิดเฉพาะ field ที่เปลี่ยน

`POST /notes` body: `actorName`, `message`

`POST /resolve` body: `actorName`, `resolutionAction`, `resolutionResult`, optional `resolutionNote`

Create รองรับ `imageData` คู่กับ `imageMimeType` (`image/jpeg`, `image/png`, `image/webp`) decoded ไม่เกิน 1 MB List response ส่ง `{ summary: { new, acknowledged, inProgress, resolved }, items }` และไม่ส่ง image/timeline Detail ส่ง `{ incident, timeline }` โดย timeline เรียงเก่าไปใหม่

Enums:

- Status: `NEW | ACKNOWLEDGED | IN_PROGRESS | RESOLVED`
- Priority: `LOW | MEDIUM | HIGH | CRITICAL`
- Category: `BUILDING_AND_FACILITIES | GENERAL_SAFETY | UTILITIES | HEALTH_AND_ACCIDENT | EQUIPMENT_AND_TECHNOLOGY | CLEANLINESS_AND_HYGIENE | OTHER`
