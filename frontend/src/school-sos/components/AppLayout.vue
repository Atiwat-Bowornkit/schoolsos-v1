<script setup lang="ts">
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<template>
  <div>
    <header class="topbar">
      <RouterLink to="/dashboard" class="brand" aria-label="School SOS หน้าหลัก">
        <span class="brand-mark">SOS</span>
        <span><strong>School SOS</strong><small>ศูนย์ประสานงานเหตุในโรงเรียน</small></span>
      </RouterLink>
      <nav aria-label="เมนูหลัก">
        <RouterLink to="/dashboard" :class="{ active: route.path === '/dashboard' }">รายการแจ้งเหตุ</RouterLink>
        <VBtn color="primary" to="/report">แจ้งเหตุใหม่</VBtn>
      </nav>
    </header>
    <main><slot /></main>
    <footer>School SOS · ข้อมูลเหตุการณ์รวมอยู่ในระบบกลางเพื่อการติดตามที่ชัดเจน</footer>
  </div>
</template>

<style scoped>
.topbar { min-height: 74px; padding: 12px max(16px, calc((100vw - 1180px) / 2)); display: flex; align-items: center; justify-content: space-between; gap: 20px; background: white; border-bottom: 1px solid var(--sos-border); position: sticky; top: 0; z-index: 10; }
.brand { display: flex; align-items: center; gap: 12px; }
.brand-mark { width: 44px; height: 44px; display: grid; place-items: center; border-radius: 12px; color: white; background: var(--sos-navy); font-size: .8rem; font-weight: 900; letter-spacing: .05em; }
.brand strong, .brand small { display: block; }
.brand small { color: var(--sos-muted); font-size: .72rem; margin-top: 2px; }
nav { display: flex; align-items: center; gap: 20px; font-weight: 650; }
nav a.active { color: var(--sos-teal); }
footer { padding: 26px 16px; border-top: 1px solid var(--sos-border); color: var(--sos-muted); text-align: center; font-size: .8rem; background: white; }
@media (max-width: 640px) {
  .brand small, nav > a:first-child { display: none; }
  .topbar { min-height: 64px; }
}
</style>
