<template>
  <VApp>
    <AppLayout>
      <RouterView />
    </AppLayout>
    <ToastHost />
  </VApp>
</template>

<script setup lang="ts">
import AppLayout from './school-sos/components/AppLayout.vue'
import ToastHost from './school-sos/components/ToastHost.vue'
</script>
