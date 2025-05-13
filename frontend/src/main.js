import { createApp } from 'vue'
import App from './App.vue'

import { createPinia } from 'pinia'

// Vuetify
import 'vuetify/styles'
import '@mdi/font/css/materialdesignicons.css'
import { createVuetify } from 'vuetify'
import * as components from 'vuetify/components'
import * as directives from 'vuetify/directives'

// ApexCharts
import VueApexCharts from 'vue3-apexcharts'

// CSS base
import './style.css'

const vuetify = createVuetify({
  components,
  directives,
  theme: {
    defaultTheme: 'aawzTheme',
    themes: {
      aawzTheme: {
        dark: true,
        colors: {
          background: '#121212',
          surface: '#1E1E1E',
          primary: '#FFFFFF',
          secondary: '#B0BEC5',
          accent: '#FF4081'
        }
      }
    }
  }
})


const app = createApp(App)
app.use(createPinia())
app.use(vuetify)
app.component('apexchart', VueApexCharts)
app.mount('#app')
