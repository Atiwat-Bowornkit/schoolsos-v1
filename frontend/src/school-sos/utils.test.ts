import { describe, expect, it } from 'vitest'
import { categoryLabels, priorityHelp, statusLabels } from './constants'

describe('School SOS labels', () => {
  it('covers critical priority and all primary statuses', () => {
    expect(priorityHelp.CRITICAL).toContain('อันตราย')
    expect(statusLabels.RESOLVED).toBe('แก้ไขแล้ว')
    expect(categoryLabels.BUILDING_AND_FACILITIES).toBe('อาคารและสถานที่')
  })
})
