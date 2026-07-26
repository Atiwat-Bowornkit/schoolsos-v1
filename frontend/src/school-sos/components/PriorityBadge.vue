<script setup lang="ts">
import { priorityLabels } from '../constants'
import type { IncidentPriority } from '../types'
defineProps<{ priority: IncidentPriority }>()
</script>
<template><span class="badge" :class="priority.toLowerCase()">{{ priorityLabels[priority] }}</span></template>
<style scoped>
.badge { display: inline-flex; padding: 5px 9px; border-radius: 8px; font-size: .76rem; font-weight: 800; color: #536672; background: #EEF1F3; }
.medium { color: #155A91; background: #EAF3FB; }
.high { color: #A44D00; background: #FFF1E5; }
.critical { color: #B42318; background: #FDECEA; }
</style>
