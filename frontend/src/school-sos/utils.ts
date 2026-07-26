export function formatThaiDate(value?: string): string {
  if (!value) return '-'
  return new Intl.DateTimeFormat('th-TH', {
    dateStyle: 'medium', timeStyle: 'short', timeZone: 'Asia/Bangkok',
  }).format(new Date(value))
}

export async function fileToDataUrl(file: File): Promise<string> {
  if (!['image/jpeg', 'image/png', 'image/webp'].includes(file.type))
    throw new Error('รองรับเฉพาะรูป JPEG, PNG หรือ WebP')
  if (file.size > 1024 * 1024)
    throw new Error('รูปภาพต้องมีขนาดไม่เกิน 1 MB')
  return await new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result))
    reader.onerror = () => reject(new Error('ไม่สามารถอ่านรูปภาพได้'))
    reader.readAsDataURL(file)
  })
}
