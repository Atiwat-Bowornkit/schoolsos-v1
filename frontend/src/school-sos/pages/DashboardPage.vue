<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { onMounted } from 'vue'
import { categoryLabels } from '../constants'
import { useIncidentStore } from '../store'
import { formatThaiDate } from '../utils'
import PriorityBadge from '../components/PriorityBadge.vue'
import StatePanel from '../components/StatePanel.vue'
import StatusBadge from '../components/StatusBadge.vue'

const store = useIncidentStore()
const { incidents, summary, loading, error } = storeToRefs(store)
onMounted(store.fetchIncidents)
</script>

<template>
  <div class="page">
    <header class="page-header">
      <div><span class="eyebrow">Incident management</span><h1>รายการแจ้งเหตุ</h1><p class="lead">เห็นงานเร่งด่วน ผู้รับผิดชอบ และสถานะล่าสุดในที่เดียว</p></div>
      <VBtn color="primary" size="large" to="/report">แจ้งเหตุใหม่</VBtn>
    </header>

    <section class="summary" aria-label="สรุปจำนวนเหตุ">
      <article><span>เหตุใหม่</span><strong>{{ summary.new }}</strong><i class="new" /></article>
      <article><span>รับทราบแล้ว</span><strong>{{ summary.acknowledged }}</strong><i class="ack" /></article>
      <article><span>กำลังดำเนินการ</span><strong>{{ summary.inProgress }}</strong><i class="progress" /></article>
      <article><span>แก้ไขแล้ว</span><strong>{{ summary.resolved }}</strong><i class="done" /></article>
    </section>

    <section class="panel incidents">
      <div class="panel-title">เหตุล่าสุด <span>{{ incidents.length }} รายการ</span></div>
      <div v-if="loading" class="loading"><VSkeletonLoader type="table-row-divider@5" /></div>
      <StatePanel v-else-if="error" title="โหลดรายการไม่สำเร็จ" :message="error" tone="error" @retry="store.fetchIncidents" />
      <StatePanel v-else-if="incidents.length === 0" title="ยังไม่มีรายการแจ้งเหตุ" message="เมื่อมีการแจ้งเหตุ รายการจะแสดงที่หน้านี้" />
      <template v-else>
        <div class="desktop-table">
          <table>
            <thead><tr><th>รหัส / เหตุการณ์</th><th>สถานที่</th><th>ความเร่งด่วน</th><th>สถานะ</th><th>ผู้รับผิดชอบ</th><th>เวลาที่แจ้ง</th></tr></thead>
            <tbody>
              <tr v-for="item in incidents" :key="item.id" :class="{ critical: item.effectivePriority === 'CRITICAL' }" @click="$router.push(`/incidents/${item.id}`)">
                <td><small>{{ item.code }}</small><strong>{{ item.title }}</strong><span>{{ categoryLabels[item.category] }}</span></td>
                <td>{{ item.location }}</td><td><PriorityBadge :priority="item.effectivePriority" /></td>
                <td><StatusBadge :status="item.status" /></td><td>{{ item.assignedTo || 'ยังไม่ระบุ' }}</td><td>{{ formatThaiDate(item.createdAt) }}</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div class="mobile-list">
          <RouterLink v-for="item in incidents" :key="item.id" :to="`/incidents/${item.id}`" class="incident-card" :class="{ critical: item.effectivePriority === 'CRITICAL' }">
            <div><small>{{ item.code }}</small><strong>{{ item.title }}</strong></div>
            <p>{{ item.location }} · {{ formatThaiDate(item.createdAt) }}</p>
            <div class="card-meta"><PriorityBadge :priority="item.effectivePriority" /><StatusBadge :status="item.status" /></div>
            <span class="owner">{{ item.assignedTo || 'ยังไม่ระบุผู้รับผิดชอบ' }}</span>
          </RouterLink>
        </div>
      </template>
    </section>
  </div>
</template>

<style scoped>
.summary { display: grid; grid-template-columns: repeat(4, 1fr); gap: 14px; margin-bottom: 22px; }
.summary article { position: relative; padding: 20px; border: 1px solid var(--sos-border); border-radius: 14px; background: white; box-shadow: 0 4px 16px rgba(23,59,87,.05); overflow: hidden; }
.summary span, .summary strong { display: block; }.summary span { color: var(--sos-muted); font-size: .85rem; }.summary strong { margin-top: 6px; font-size: 1.8rem; }
.summary i { position: absolute; right: -8px; bottom: -14px; width: 54px; height: 54px; border-radius: 50%; background: #DCECF7; }.summary .ack{background:#E9E2F7}.summary .progress{background:#FDE5D0}.summary .done{background:#DCEFE5}
.panel-title { display:flex; justify-content:space-between; }.panel-title span { color: var(--sos-muted); font-size: .8rem; font-weight: 500; }
.loading { padding: 12px 22px 24px; } table { width: 100%; border-collapse: collapse; } th { text-align: left; padding: 13px 16px; font-size: .76rem; color: var(--sos-muted); background:#F7F9FA; } td { padding: 16px; border-top: 1px solid #E7ECEF; font-size: .86rem; } tbody tr { cursor: pointer; } tbody tr:hover { background: #F6FAFB; } tr.critical { box-shadow: inset 4px 0 #B42318; }
td small, td strong, td span { display:block; } td small { color:var(--sos-teal); font-weight:800; } td strong { margin:4px 0; } td span { color:var(--sos-muted); font-size:.77rem; }
.mobile-list { display:none; }.incident-card { display:block; padding:18px; border-top:1px solid #E7ECEF; }.incident-card.critical { border-left:4px solid #B42318; }.incident-card small,.incident-card strong {display:block}.incident-card small{color:var(--sos-teal);font-weight:800}.incident-card strong{margin-top:4px}.incident-card p,.owner{color:var(--sos-muted);font-size:.82rem}.card-meta{display:flex;gap:8px;margin:12px 0}
@media(max-width:900px){.summary{grid-template-columns:repeat(2,1fr)}.desktop-table{display:none}.mobile-list{display:block}}
</style>
