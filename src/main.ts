import './common/assets/main.css'
import 'primeicons/primeicons.css'

import { createApp } from 'vue'
import { createPinia } from 'pinia'
import PrimeVue from 'primevue/config'
import Aura from '@primevue/themes/aura'
import { zxcvbnOptions } from '@zxcvbn-ts/core'
import piniaPluginPersistedstate from 'pinia-plugin-persistedstate'
import * as zxcvbnCommonPackage from '@zxcvbn-ts/language-common'
import * as zxcvbnEnPackage from '@zxcvbn-ts/language-pt-br'

import App from './App.vue'
import router from './router'
import { initializeGlobalStore } from './common/config/globalStore'

const app = createApp(App)

app.use(PrimeVue, {
  theme: {
    preset: Aura,
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
