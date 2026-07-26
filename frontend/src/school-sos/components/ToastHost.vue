<script setup lang="ts">
import { storeToRefs } from 'pinia'
import { useToast } from '../toast'
const toast = useToast()
const { message, color, visible } = storeToRefs(toast)
</script>

<template>
  <VSnackbar v-model="visible" :color="color" location="top end" :timeout="3500">
    {{ message }}
    <template #actions><VBtn variant="text" @click="visible = false">ปิด</VBtn></template>
  </VSnackbar>
</template>
