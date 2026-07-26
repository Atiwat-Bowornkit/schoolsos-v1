<script setup lang="ts">
import { reactive, ref } from 'vue'
import { useRouter } from 'vue-router'
import { categories, priorities, priorityHelp } from '../constants'
import { useIncidentStore } from '../store'
import { useToast } from '../toast'
import type { IncidentCategory, IncidentPriority } from '../types'
import { fileToDataUrl } from '../utils'

const router = useRouter()
const store = useIncidentStore()
const toast = useToast()
const form = reactive({
  title: '', description: '', category: '' as IncidentCategory | '',
  location: '', reportedPriority: 'MEDIUM' as IncidentPriority, reporterName: '',
})
const errors = reactive<Record<string, string>>({})
const imageData = ref<string>()
const imageMimeType = ref<string>()
const imageName = ref('')
const imageSize = ref('')

function validate(): boolean {
  Object.keys(errors).forEach(key => delete errors[key])
  if (form.title.trim().length < 3) errors.title = 'กรุณากรอกหัวข้ออย่างน้อย 3 ตัวอักษร'
  if (form.description.trim().length < 10) errors.description = 'กรุณากรอกรายละเอียดอย่างน้อย 10 ตัวอักษร'
  if (!form.category) errors.category = 'กรุณาเลือกหมวดเหตุการณ์'
  if (form.location.trim().length < 2) errors.location = 'กรุณาระบุสถานที่อย่างน้อย 2 ตัวอักษร'
  if (form.reporterName.length > 100) errors.reporterName = 'ชื่อผู้แจ้งต้องไม่เกิน 100 ตัวอักษร'
  if (Object.keys(errors).length) {
    requestAnimationFrame(() => document.querySelector<HTMLElement>('[data-invalid="true"] input, [data-invalid="true"] textarea')?.focus())
    return false
  }
  return true
}

async function selectImage(value: File | File[] | null) {
  const file = Array.isArray(value) ? value[0] : value
  if (!file) return
  try {
    imageData.value = await fileToDataUrl(file)
    imageMimeType.value = file.type
    imageName.value = file.name
    imageSize.value = `${(file.size / 1024).toFixed(0)} KB`
    delete errors.image
  }
  catch (caught) {
    removeImage()
    errors.image = caught instanceof Error ? caught.message : 'ไม่สามารถอ่านรูปภาพได้'
  }
}

function removeImage() {
  imageData.value = undefined
  imageMimeType.value = undefined
  imageName.value = ''
  imageSize.value = ''
}

async function submit() {
  if (!validate() || !form.category) return
  try {
    const detail = await store.create({
      title: form.title,
      description: form.description,
      category: form.category,
      location: form.location,
      reportedPriority: form.reportedPriority,
      reporterName: form.reporterName.trim() || undefined,
      imageData: imageData.value,
      imageMimeType: imageMimeType.value,
    })
    toast.show(`รับแจ้งเหตุ ${detail.incident.code} แล้ว`)
    await router.push(`/incidents/${detail.incident.id}`)
  }
  catch { toast.show(store.error ?? 'ส่งแจ้งเหตุไม่สำเร็จ', 'error') }
}
</script>

<template>
  <div class="page report">
    <header class="page-header">
      <div><span class="eyebrow">Report an incident</span><h1>แจ้งเหตุใหม่</h1><p class="lead">กรอกข้อมูลให้ชัดเจนเพื่อให้ผู้รับผิดชอบประเมินและดำเนินการได้เร็ว</p></div>
      <VBtn variant="text" to="/dashboard">กลับรายการแจ้งเหตุ</VBtn>
    </header>

    <form class="stack" novalidate @submit.prevent="submit">
      <section class="panel">
        <div class="section-heading"><span>1</span><div><h2>เกิดเหตุอะไร</h2><p>อธิบายสิ่งที่พบและผลกระทบที่เกิดขึ้น</p></div></div>
        <div class="panel-body stack">
          <VTextField v-model="form.title" label="หัวข้อ *" maxlength="150" counter :error-messages="errors.title" :data-invalid="Boolean(errors.title)" />
          <VTextarea v-model="form.description" label="รายละเอียด *" rows="4" maxlength="2000" counter auto-grow :error-messages="errors.description" :data-invalid="Boolean(errors.description)" />
          <VSelect v-model="form.category" :items="categories" label="หมวดเหตุการณ์ *" :error-messages="errors.category" :data-invalid="Boolean(errors.category)" />
        </div>
      </section>

      <section class="panel">
        <div class="section-heading"><span>2</span><div><h2>เกิดที่ไหนและเร่งด่วนเพียงใด</h2><p>ระบุตำแหน่งที่ค้นหาได้ง่ายและเลือกระดับตามความเสี่ยง</p></div></div>
        <div class="panel-body stack">
          <VTextField v-model="form.location" label="สถานที่ *" maxlength="200" counter placeholder="เช่น บันไดอาคารเรียน 1" :error-messages="errors.location" :data-invalid="Boolean(errors.location)" />
          <VSelect v-model="form.reportedPriority" :items="priorities" label="ระดับความเร่งด่วน *" />
          <div class="priority-guide">
            <div v-for="item in priorities" :key="item.value" :class="{ selected: form.reportedPriority === item.value }">
              <strong>{{ item.title }}</strong><span>{{ priorityHelp[item.value as IncidentPriority] }}</span>
            </div>
          </div>
        </div>
      </section>

      <section class="panel">
        <div class="section-heading"><span>3</span><div><h2>ข้อมูลเพิ่มเติม</h2><p>ชื่อผู้แจ้งและรูปภาพเป็นข้อมูลเสริม ไม่จำเป็นต้องกรอก</p></div></div>
        <div class="panel-body stack">
          <VTextField v-model="form.reporterName" label="ชื่อผู้แจ้ง (ไม่บังคับ)" maxlength="100" :error-messages="errors.reporterName" />
          <VFileInput label="ภาพประกอบ 1 ภาพ (JPEG, PNG, WebP ไม่เกิน 1 MB)" accept="image/jpeg,image/png,image/webp" :error-messages="errors.image" show-size @update:model-value="selectImage" />
          <div v-if="imageData" class="preview">
            <img :src="imageData" alt="ตัวอย่างภาพประกอบเหตุการณ์">
            <div><strong>{{ imageName }}</strong><span>{{ imageSize }}</span></div>
            <VBtn color="error" variant="text" @click="removeImage">ลบภาพ</VBtn>
          </div>
        </div>
      </section>

      <div class="submit-bar">
        <p>เมื่อส่งแล้ว ระบบจะสร้างรหัสติดตามและแสดงเหตุใน Dashboard ทันที</p>
        <div class="actions"><VBtn variant="text" to="/dashboard">ยกเลิก</VBtn><VBtn color="primary" size="large" type="submit" :loading="store.submitting">ส่งแจ้งเหตุ</VBtn></div>
      </div>
    </form>
  </div>
</template>

<style scoped>
.report{max-width:900px}.section-heading{display:flex;gap:14px;align-items:center;padding:20px 22px 0}.section-heading>span{width:36px;height:36px;display:grid;place-items:center;border-radius:10px;color:white;background:var(--sos-navy);font-weight:900}.section-heading h2,.section-heading p{margin:0}.section-heading h2{font-size:1.08rem}.section-heading p{font-size:.82rem;color:var(--sos-muted);margin-top:3px}
.priority-guide{display:grid;grid-template-columns:repeat(4,1fr);gap:8px}.priority-guide div{padding:12px;border:1px solid var(--sos-border);border-radius:10px}.priority-guide div.selected{border-color:var(--sos-teal);background:#F0F9F9}.priority-guide strong,.priority-guide span{display:block}.priority-guide strong{font-size:.8rem}.priority-guide span{font-size:.7rem;color:var(--sos-muted);margin-top:3px}
.preview{display:grid;grid-template-columns:90px 1fr auto;align-items:center;gap:14px;padding:12px;border:1px solid var(--sos-border);border-radius:12px}.preview img{width:90px;height:68px;object-fit:cover;border-radius:8px}.preview strong,.preview span{display:block}.preview span{font-size:.8rem;color:var(--sos-muted)}
.submit-bar{position:sticky;bottom:12px;display:flex;justify-content:space-between;align-items:center;gap:18px;padding:16px 18px;border:1px solid #C7D8DF;border-radius:14px;background:rgba(255,255,255,.96);box-shadow:var(--sos-shadow)}.submit-bar p{margin:0;color:var(--sos-muted);font-size:.82rem}
@media(max-width:640px){.priority-guide{grid-template-columns:1fr 1fr}.submit-bar{align-items:stretch;flex-direction:column}.submit-bar .actions{justify-content:flex-end}.preview{grid-template-columns:70px 1fr}.preview img{width:70px}.preview button{grid-column:2}}
</style>
