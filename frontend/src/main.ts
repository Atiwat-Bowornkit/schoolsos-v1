import { createPinia } from 'pinia'
import { createApp } from 'vue'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'
import 'vuetify/styles'
import App from './App.vue'
import router from './router'
import './school-sos/styles/tokens.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'schoolSos',
    themes: {
      schoolSos: {
        dark: false,
        colors: {
          primary: '#173B57',
          secondary: '#147D89',
          success: '#16794A',
          warning: '#C66A13',
          error: '#B42318',
          background: '#F4F7F9',
          surface: '#FFFFFF',
        },
      },
    },
  },
})

createApp(App).use(createPinia()).use(router).use(vuetify).mount('#app')
