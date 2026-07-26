<script setup lang="ts">
import { statusLabels } from '../constants'
import type { IncidentStatus } from '../types'
defineProps<{ status: IncidentStatus }>()
</script>
<template><span class="badge" :class="status.toLowerCase()"><i />{{ statusLabels[status] }}</span></template>
<style scoped>
.badge { display: inline-flex; align-items: center; gap: 7px; padding: 6px 10px; border-radius: 999px; font-size: .78rem; font-weight: 750; background: #EDF4FA; color: #135A88; }
i { width: 7px; height: 7px; border-radius: 50%; background: currentColor; }
.acknowledged { background: #F0EDFA; color: #6246A8; }
.in_progress { background: #FFF1E5; color: #A44D00; }
.resolved { background: #E9F6EF; color: #16794A; }
</style>
