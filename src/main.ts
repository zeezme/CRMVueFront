import './common/assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import lara from '@primevue/themes/lara'
import { zxcvbnOptions } from '@zxcvbn-ts/core'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-pt-br'
import { definePreset } from '@primevue/themes'

import App from './App.vue'
import router from './router'
import { initializeGlobalStore } from './common/config/globalStore'

import { OhVueIcon, addIcons } from 'oh-vue-icons'
import { HiSolidCursorClick } from 'oh-vue-icons/icons'

const app = createApp(App)

addIcons(HiSolidCursorClick)
app.component('v-icon', OhVueIcon)

const Dark = definePreset(lara, {
  semantic: {
    colorScheme: {
      primary: {
        50: '{slate.50}',
        100: '{slate.100}',
        200: '{slate.200}',
        300: '{slate.300}',
        400: '{slate.400}',
        500: '{slate.500}',
        600: '{slate.600}',
        700: '{slate.700}',
        800: '{slate.800}',
        900: '{slate.900}',
        950: '{slate.950}',
      },
      light: {
        surface: {
          0: '#ffffff',
          50: '{zinc.50}',
          100: '{zinc.100}',
          200: '{zinc.200}',
          300: '{zinc.300}',
          400: '{zinc.400}',
          500: '{zinc.500}',
          600: '{zinc.600}',
          700: '{zinc.700}',
          800: '{zinc.800}',
          900: '{zinc.900}',
          950: '{zinc.950}',
        },
      },
      dark: {
        surface: {
          0: '#ffffff',
          50: '{slate.0}',
          100: '{slate.50}',
          200: '{slate.100}',
          300: '{slate.200}',
          400: '{slate.300}',
          500: '{slate.400}',
          600: '{slate.500}',
          700: '{slate.600}',
          800: '{slate.700}',
          900: '{slate.800}',
          950: '{slate.900}',
        },
      },
    },
  },
})

app.use(PrimeVue, {
  theme: {
    preset: Dark,
    options: {
      prefix: 'p',
      darkModeSelector: 'system',
      cssLayer: false,
    },
  },
})

const options = {
  translations: zxcvbnEnPackage.translations,
  graphs: zxcvbnCommonPackage.adjacencyGraphs,
  dictionary: {
    ...zxcvbnCommonPackage.dictionary,
    ...zxcvbnEnPackage.dictionary,
  },
}

zxcvbnOptions.setOptions(options)

const pinia = createPinia()

app.use(router)

pinia.use(piniaPluginPersistedstate)

app.use(pinia)

initializeGlobalStore()

app.mount('#app')
