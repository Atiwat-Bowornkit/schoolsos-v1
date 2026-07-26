import { createRouter, createWebHistory } from 'vue-router'

export default createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', redirect: '/dashboard' },
    { path: '/dashboard', component: () => import('./school-sos/pages/DashboardPage.vue') },
    { path: '/report', component: () => import('./school-sos/pages/ReportIncidentPage.vue') },
    { path: '/incidents/:id', component: () => import('./school-sos/pages/IncidentDetailPage.vue') },
    { path: '/:pathMatch(.*)*', component: () => import('./school-sos/pages/NotFoundPage.vue') },
  ],
  scrollBehavior: () => ({ top: 0 }),
})
