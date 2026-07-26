import type { IncidentCategory, IncidentPriority, IncidentStatus } from './types'

export const categoryLabels: Record<IncidentCategory, string> = {
  BUILDING_AND_FACILITIES: 'อาคารและสถานที่',
  GENERAL_SAFETY: 'ความปลอดภัยทั่วไป',
  UTILITIES: 'ไฟฟ้าและสาธารณูปโภค',
  HEALTH_AND_ACCIDENT: 'สุขภาพและอุบัติเหตุ',
  EQUIPMENT_AND_TECHNOLOGY: 'อุปกรณ์และเทคโนโลยี',
  CLEANLINESS_AND_HYGIENE: 'ความสะอาดและสุขอนามัย',
  OTHER: 'อื่น ๆ',
}
export const priorityLabels: Record<IncidentPriority, string> = {
  LOW: 'ต่ำ', MEDIUM: 'ปานกลาง', HIGH: 'สูง', CRITICAL: 'วิกฤต',
}
export const priorityHelp: Record<IncidentPriority, string> = {
  LOW: 'ไม่เร่งด่วน',
  MEDIUM: 'ควรดำเนินการตามลำดับ',
  HIGH: 'มีความเสี่ยงหรือกระทบการใช้งาน',
  CRITICAL: 'มีอันตรายหรือผลกระทบรุนแรง',
}
export const statusLabels: Record<IncidentStatus, string> = {
  NEW: 'เหตุใหม่', ACKNOWLEDGED: 'รับทราบแล้ว', IN_PROGRESS: 'กำลังดำเนินการ', RESOLVED: 'แก้ไขแล้ว',
}
export const categories = Object.entries(categoryLabels).map(([value, title]) => ({ value, title }))
export const priorities = Object.entries(priorityLabels).map(([value, title]) => ({ value, title }))
