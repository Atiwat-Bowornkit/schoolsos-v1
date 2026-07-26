import type { Incident } from '../domain/entities/incident'

export function createClosureSummary(
  incident: Incident,
  resolutionAction: string,
  resolutionResult: string,
  resolutionNote?: string
): string {
  return [
    'เหตุการณ์:', incident.title, '',
    'สถานที่:', incident.location, '',
    'ผู้รับผิดชอบ:', incident.assignedTo ?? 'ไม่ได้ระบุ', '',
    'การดำเนินการ:', resolutionAction, '',
    'ผลลัพธ์:', resolutionResult, '',
    'หมายเหตุ:', resolutionNote ?? '-', '',
    'สถานะสุดท้าย:', 'แก้ไขแล้ว',
  ].join('\n')
}
