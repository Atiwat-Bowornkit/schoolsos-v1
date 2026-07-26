<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { computed, onMounted, reactive, ref, watch } from 'vue'
import { useRoute } from 'vue-router'
import { categoryLabels, priorities, statusLabels } from '../constants'
import IncidentTimeline from '../components/IncidentTimeline.vue'
import PriorityBadge from '../components/PriorityBadge.vue'
import StatePanel from '../components/StatePanel.vue'
import StatusBadge from '../components/StatusBadge.vue'
import { useIncidentStore } from '../store'
import { useToast } from '../toast'
import type { IncidentPriority, IncidentStatus } from '../types'
import { formatThaiDate } from '../utils'

const route = useRoute()
const store = useIncidentStore()
const toast = useToast()
const { current, currentIncident: incident, loading, submitting, error } = storeToRefs(store)
const actorName = ref('')
const management = reactive({ assignedTo: '', confirmedPriority: 'MEDIUM' as IncidentPriority })
const note = ref('')
const resolveOpen = ref(false)
const resolution = reactive({ action: '', result: '', note: '' })
const id = computed(() => String(route.params.id ?? ''))

watch(incident, value => {
  if (!value) return
  management.assignedTo = value.assignedTo ?? ''
  management.confirmedPriority = value.confirmedPriority ?? value.reportedPriority
}, { immediate: true })

const nextStatus = computed<IncidentStatus | null>(() => {
  if (incident.value?.status === 'NEW') return 'ACKNOWLEDGED'
  if (incident.value?.status === 'ACKNOWLEDGED') return 'IN_PROGRESS'
  return null
})
const nextLabel = computed(() => nextStatus.value === 'ACKNOWLEDGED' ? 'รับทราบเหตุ' : 'เริ่มดำเนินการ')
const actorValid = computed(() => actorName.value.trim().length >= 2)
const canAdvance = computed(() => {
  if (!actorValid.value || !nextStatus.value) return false
  if (nextStatus.value === 'ACKNOWLEDGED')
    return Boolean(incident.value?.assignedTo && incident.value.confirmedPriority)
  return true
})

async function load() {
  try { await store.fetchIncident(id.value) } catch { /* visible error state */ }
}

async function run(action: () => Promise<unknown>, message: string) {
  if (!actorValid.value) { toast.show('กรุณากรอกชื่อผู้ดำเนินการอย่างน้อย 2 ตัวอักษร', 'error'); return }
  try { await action(); toast.show(message) }
  catch { toast.show(store.error ?? 'บันทึกข้อมูลไม่สำเร็จ', 'error') }
}

function saveManagement() {
  return run(() => store.update(id.value, {
    actorName: actorName.value,
    assignedTo: management.assignedTo,
    confirmedPriority: management.confirmedPriority,
  }), 'บันทึกผู้รับผิดชอบและความเร่งด่วนแล้ว')
}
function advance() {
  if (!nextStatus.value) return
  return run(() => store.update(id.value, { actorName: actorName.value, status: nextStatus.value }), `เปลี่ยนสถานะเป็น ${statusLabels[nextStatus.value]}`)
}
async function addNote() {
  if (note.value.trim().length < 3) { toast.show('กรุณากรอกบันทึกอย่างน้อย 3 ตัวอักษร', 'error'); return }
  await run(() => store.addNote(id.value, { actorName: actorName.value, message: note.value }), 'เพิ่มบันทึกการดำเนินงานแล้ว')
  if (!store.error) note.value = ''
}
async function resolveIncident() {
  if (resolution.action.trim().length < 3 || resolution.result.trim().length < 3) {
    toast.show('กรุณากรอกการดำเนินการและผลลัพธ์ให้ครบ', 'error'); return
  }
  await run(() => store.resolve(id.value, {
    actorName: actorName.value,
    resolutionAction: resolution.action,
    resolutionResult: resolution.result,
    resolutionNote: resolution.note || undefined,
  }), 'ปิดเหตุสำเร็จ')
  if (!store.error) resolveOpen.value = false
}

onMounted(load)
</script>

<template>
  <div class="page">
    <div v-if="loading && !incident" class="panel panel-body"><VSkeletonLoader type="heading, paragraph, card, card" /></div>
    <StatePanel v-else-if="error && !incident" title="ไม่พบหรือโหลดเหตุการณ์ไม่สำเร็จ" :message="error" tone="error" @retry="load" />
    <template v-else-if="incident && current">
      <header class="page-header detail-header">
        <div>
          <RouterLink to="/dashboard" class="back">← กลับรายการแจ้งเหตุ</RouterLink>
          <span class="eyebrow">{{ incident.code }}</span><h1>{{ incident.title }}</h1>
          <div class="headline-meta"><StatusBadge :status="incident.status" /><PriorityBadge :priority="incident.effectivePriority" /><span>แจ้งเมื่อ {{ formatThaiDate(incident.createdAt) }}</span></div>
        </div>
      </header>

      <div class="two-col">
        <div class="stack">
          <section class="panel"><div class="panel-title">ข้อมูลเหตุการณ์</div><div class="panel-body detail-grid">
            <div class="wide"><label>รายละเอียด</label><p>{{ incident.description }}</p></div>
            <div><label>หมวด</label><p>{{ categoryLabels[incident.category] }}</p></div>
            <div><label>สถานที่</label><p>{{ incident.location }}</p></div>
            <div><label>ผู้แจ้ง</label><p>{{ incident.reporterName || 'ไม่ระบุ' }}</p></div>
            <div><label>ความเร่งด่วนที่แจ้ง</label><PriorityBadge :priority="incident.reportedPriority" /></div>
            <div v-if="incident.imageData" class="wide"><label>ภาพประกอบ</label><img :src="incident.imageData" :alt="`ภาพประกอบ ${incident.title}`"></div>
          </div></section>

          <section v-if="incident.status === 'IN_PROGRESS'" class="panel">
            <div class="panel-title">บันทึกการดำเนินงาน</div>
            <div class="panel-body stack"><VTextarea v-model="note" label="สิ่งที่ดำเนินการหรือความคืบหน้า *" rows="3" maxlength="1000" counter /><div class="actions end"><VBtn color="secondary" :loading="submitting" @click="addNote">เพิ่มบันทึก</VBtn></div></div>
          </section>

          <section v-if="incident.status === 'RESOLVED'" class="panel closure">
            <div class="panel-title">สรุปการปิดเหตุ</div>
            <div class="panel-body"><div class="resolved-banner">แก้ไขแล้วเมื่อ {{ formatThaiDate(incident.resolvedAt) }}</div><pre>{{ incident.closureSummary }}</pre></div>
          </section>

          <section class="panel"><div class="panel-title">ลำดับเหตุการณ์</div><div class="panel-body"><IncidentTimeline :events="current.timeline" /></div></section>
        </div>

        <aside class="stack">
          <section v-if="incident.status !== 'RESOLVED'" class="panel action-panel">
            <div class="panel-title">การจัดการเหตุ</div>
            <div class="panel-body stack">
              <div class="actor-callout"><strong>ชื่อผู้ดำเนินการ</strong><span>ระบบจะบันทึกชื่อนี้ใน Timeline ทุกครั้ง</span></div>
              <VTextField v-model="actorName" label="ชื่อผู้ดำเนินการ *" maxlength="100" />
              <VTextField v-model="management.assignedTo" label="ผู้รับผิดชอบ *" maxlength="150" />
              <VSelect v-model="management.confirmedPriority" :items="priorities" label="ยืนยันระดับความเร่งด่วน *" />
              <VBtn variant="outlined" :disabled="!actorValid || !management.assignedTo.trim()" :loading="submitting" @click="saveManagement">บันทึกข้อมูลจัดการ</VBtn>
              <div class="workflow">
                <div v-for="(status, index) in ['NEW','ACKNOWLEDGED','IN_PROGRESS','RESOLVED']" :key="status" :class="{ active: ['NEW','ACKNOWLEDGED','IN_PROGRESS','RESOLVED'].indexOf(incident.status) >= index }"><i />{{ statusLabels[status as IncidentStatus] }}</div>
              </div>
              <VBtn v-if="nextStatus" color="primary" size="large" :disabled="!canAdvance" :loading="submitting" @click="advance">{{ nextLabel }}</VBtn>
              <VBtn v-if="incident.status === 'IN_PROGRESS'" color="success" size="large" :disabled="!actorValid" @click="resolveOpen = true">ปิดเหตุ</VBtn>
            </div>
          </section>
          <section v-else class="panel panel-body"><StatusBadge status="RESOLVED" /><p class="helper">เหตุนี้ปิดแล้วและเป็นข้อมูลแบบอ่านอย่างเดียวใน MVP</p></section>
        </aside>
      </div>
    </template>

    <VDialog v-model="resolveOpen" max-width="620">
      <VCard>
        <VCardTitle class="pa-6">ยืนยันการปิดเหตุ</VCardTitle>
        <VCardText class="stack px-6">
          <VAlert type="warning" variant="tonal">หลังปิดเหตุแล้วจะไม่สามารถแก้ Workflow ต่อได้ใน MVP</VAlert>
          <p class="helper">ผู้ดำเนินการ: <strong>{{ actorName || '-' }}</strong></p>
          <VTextarea v-model="resolution.action" label="สิ่งที่ดำเนินการ *" rows="3" maxlength="2000" />
          <VTextarea v-model="resolution.result" label="ผลลัพธ์ *" rows="3" maxlength="2000" />
          <VTextarea v-model="resolution.note" label="หมายเหตุ (ไม่บังคับ)" rows="2" maxlength="2000" />
        </VCardText>
        <VCardActions class="pa-6 pt-2"><VSpacer /><VBtn variant="text" @click="resolveOpen = false">ยกเลิก</VBtn><VBtn color="success" :loading="submitting" @click="resolveIncident">ยืนยันปิดเหตุ</VBtn></VCardActions>
      </VCard>
    </VDialog>
  </div>
</template>

<style scoped>
.back{display:block;color:var(--sos-muted);font-size:.84rem;margin-bottom:18px}.headline-meta{display:flex;flex-wrap:wrap;align-items:center;gap:9px;margin-top:13px}.headline-meta>span:last-child{color:var(--sos-muted);font-size:.82rem}
.detail-grid{display:grid;grid-template-columns:1fr 1fr;gap:22px}.wide{grid-column:1/-1}label{display:block;color:var(--sos-muted);font-size:.76rem;font-weight:700;margin-bottom:5px}p{margin:0;line-height:1.65}.detail-grid img{width:100%;max-height:440px;object-fit:cover;border-radius:12px;border:1px solid var(--sos-border)}.actions.end{justify-content:flex-end}
.action-panel{position:sticky;top:96px}.actor-callout{padding:13px;border-radius:10px;background:#EEF7F7}.actor-callout strong,.actor-callout span{display:block}.actor-callout span{font-size:.76rem;color:var(--sos-muted);margin-top:3px}
.workflow{display:grid;gap:0;padding:8px 4px}.workflow div{position:relative;display:flex;align-items:center;gap:10px;color:#91A0A8;padding:9px 0}.workflow div:not(:last-child)::after{content:"";position:absolute;left:5px;top:23px;height:14px;width:2px;background:#D8E1E5}.workflow i{width:12px;height:12px;border:2px solid currentColor;border-radius:50%}.workflow .active{color:var(--sos-teal);font-weight:750}.workflow .active i{background:currentColor}
.resolved-banner{padding:12px 14px;border-radius:10px;color:#12653D;background:#E9F6EF;font-weight:750;margin-bottom:18px}.closure pre{margin:0;white-space:pre-wrap;font:inherit;line-height:1.7}
@media(max-width:640px){.detail-grid{grid-template-columns:1fr}.wide{grid-column:auto}.action-panel{position:static}}
</style>
