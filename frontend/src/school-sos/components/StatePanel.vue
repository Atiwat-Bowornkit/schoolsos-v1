<script setup lang="ts">
defineProps<{ title: string, message: string, tone?: 'empty' | 'error' }>()
defineEmits<{ retry: [] }>()
</script>
<template>
  <div class="state" :class="tone">
    <div class="symbol">{{ tone === 'error' ? '!' : '✓' }}</div>
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <div class="actions">
      <VBtn v-if="tone === 'error'" variant="outlined" @click="$emit('retry')">ลองใหม่</VBtn>
      <VBtn color="primary" to="/report">แจ้งเหตุใหม่</VBtn>
    </div>
  </div>
</template>
<style scoped>
.state { padding: 56px 24px; text-align: center; }
.symbol { width: 48px; height: 48px; margin: 0 auto 14px; display: grid; place-items: center; border-radius: 50%; color: var(--sos-teal); background: #E8F5F5; font-weight: 900; }
.error .symbol { color: #B42318; background: #FDECEA; }
h2 { margin: 0; font-size: 1.2rem; } p { margin: 7px auto 18px; color: var(--sos-muted); }
.actions { justify-content: center; }
</style>
