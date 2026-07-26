import { defineStore } from 'pinia'
import { computed, ref } from 'vue'
import { incidentApi } from './api'
import type { CreateIncidentBody, Incident, IncidentDetail, Summary } from './types'

export const useIncidentStore = defineStore('school-sos-incidents', () => {
  const incidents = ref<Incident[]>([])
  const summary = ref<Summary>({ new: 0, acknowledged: 0, inProgress: 0, resolved: 0 })
  const current = ref<IncidentDetail | null>(null)
  const loading = ref(false)
  const submitting = ref(false)
  const error = ref<string | null>(null)
  const currentIncident = computed(() => current.value?.incident ?? null)

  function syncIncident(incident: Incident) {
    const index = incidents.value.findIndex(item => item.id === incident.id)
    if (index >= 0) incidents.value[index] = incident
    else incidents.value.unshift(incident)
    incidents.value.sort((left, right) => right.createdAt.localeCompare(left.createdAt))
    summary.value = {
      new: incidents.value.filter(item => item.status === 'NEW').length,
      acknowledged: incidents.value.filter(item => item.status === 'ACKNOWLEDGED').length,
      inProgress: incidents.value.filter(item => item.status === 'IN_PROGRESS').length,
      resolved: incidents.value.filter(item => item.status === 'RESOLVED').length,
    }
  }

  async function fetchIncidents() {
    loading.value = true
    error.value = null
    try {
      const response = await incidentApi.list()
      incidents.value = response.data.items
      summary.value = response.data.summary
    }
    catch (caught) { error.value = caught instanceof Error ? caught.message : 'โหลดข้อมูลไม่สำเร็จ' }
    finally { loading.value = false }
  }

  async function fetchIncident(id: string) {
    loading.value = true
    error.value = null
    try {
      current.value = (await incidentApi.get(id)).data
      return current.value
    }
    catch (caught) {
      error.value = caught instanceof Error ? caught.message : 'โหลดข้อมูลไม่สำเร็จ'
      throw caught
    }
    finally { loading.value = false }
  }

  async function mutate(call: () => Promise<{ data: IncidentDetail }>) {
    submitting.value = true
    error.value = null
    try {
      current.value = (await call()).data
      syncIncident(current.value.incident)
      return current.value
    }
    catch (caught) {
      error.value = caught instanceof Error ? caught.message : 'บันทึกข้อมูลไม่สำเร็จ'
      throw caught
    }
    finally { submitting.value = false }
  }

  const create = (body: CreateIncidentBody) => mutate(() => incidentApi.create(body))
  const update = (id: string, body: object) => mutate(() => incidentApi.update(id, body))
  const addNote = (id: string, body: object) => mutate(() => incidentApi.note(id, body))
  const resolve = (id: string, body: object) => mutate(() => incidentApi.resolve(id, body))

  return {
    incidents, summary, current, currentIncident, loading, submitting, error,
    fetchIncidents, fetchIncident, create, update, addNote, resolve,
  }
})
