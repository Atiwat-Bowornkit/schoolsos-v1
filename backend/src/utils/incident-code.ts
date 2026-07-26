export function generateIncidentCode(now = new Date(), random = Math.random): string {
  const date = now.toISOString().slice(0, 10).replace(/-/g, '')
  const suffix = Math.floor(random() * 0x10000).toString(16).padStart(4, '0').toUpperCase()
  return `SOS-${date}-${suffix}`
}
