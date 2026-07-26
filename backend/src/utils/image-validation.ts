import { ValidationError } from '../domain/errors'

const MAX_IMAGE_BYTES = 1024 * 1024
const ALLOWED = new Set(['image/jpeg', 'image/png', 'image/webp'])

export function validateImage(imageData?: string, imageMimeType?: string): void {
  if (!imageData && !imageMimeType) return
  if (!imageData || !imageMimeType || !ALLOWED.has(imageMimeType))
    throw new ValidationError('รองรับเฉพาะรูป JPEG, PNG หรือ WebP', 'INVALID_IMAGE_TYPE')

  const match = /^data:(image\/(?:jpeg|png|webp));base64,([A-Za-z0-9+/=\s]+)$/.exec(imageData)
  if (!match?.[1] || !match[2] || match[1] !== imageMimeType)
    throw new ValidationError('ข้อมูลรูปภาพไม่ตรงกับประเภทไฟล์', 'INVALID_IMAGE_TYPE')

  let bytes: Uint8Array
  try {
    const binary = atob(match[2].replace(/\s/g, ''))
    bytes = Uint8Array.from(binary, char => char.charCodeAt(0))
  }
  catch {
    throw new ValidationError('ข้อมูลรูปภาพไม่ถูกต้อง', 'INVALID_IMAGE_TYPE')
  }
  if (bytes.byteLength > MAX_IMAGE_BYTES)
    throw new ValidationError('รูปภาพต้องมีขนาดไม่เกิน 1 MB', 'IMAGE_TOO_LARGE')

  const valid = imageMimeType === 'image/jpeg'
    ? bytes.length >= 3 && bytes[0] === 0xFF && bytes[1] === 0xD8 && bytes[2] === 0xFF
    : imageMimeType === 'image/png'
      ? [0x89, 0x50, 0x4E, 0x47, 0x0D, 0x0A, 0x1A, 0x0A].every((value, index) => bytes[index] === value)
      : bytes.length >= 12
        && String.fromCharCode(...bytes.slice(0, 4)) === 'RIFF'
        && String.fromCharCode(...bytes.slice(8, 12)) === 'WEBP'
  if (!valid) throw new ValidationError('ข้อมูลรูปภาพไม่ตรงกับประเภทไฟล์', 'INVALID_IMAGE_TYPE')
}
