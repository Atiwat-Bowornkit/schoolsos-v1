<script setup lang="ts">
import type { TimelineEvent } from '../types'
import { formatThaiDate } from '../utils'
defineProps<{ events: TimelineEvent[] }>()
</script>
<template>
  <ol class="timeline">
    <li v-for="event in events" :key="event.id">
      <span class="dot" />
      <div><strong>{{ event.message }}</strong><small>{{ event.actorName || 'ระบบ' }} · {{ formatThaiDate(event.createdAt) }}</small></div>
    </li>
  </ol>
</template>
<style scoped>
.timeline { list-style: none; padding: 0; margin: 0; }
li { display: grid; grid-template-columns: 18px 1fr; gap: 12px; position: relative; padding-bottom: 24px; }
li:not(:last-child)::before { content: ""; width: 2px; background: #D8E4E8; position: absolute; top: 14px; bottom: 0; left: 6px; }
.dot { width: 14px; height: 14px; margin-top: 3px; border-radius: 50%; border: 3px solid white; background: var(--sos-teal); box-shadow: 0 0 0 2px #BFD7DA; z-index: 1; }
strong, small { display: block; } strong { font-size: .92rem; } small { margin-top: 5px; color: var(--sos-muted); }
</style>
