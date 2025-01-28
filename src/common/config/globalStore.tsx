import { defineStore } from 'pinia'
import { StateManager } from '@/common/helpers/StateManager'

export interface IToast {
  id: string
  type: string
  message: string
  username?: string
}

interface GlobalStoreState {
  token: string
  permissions: string[]
  username: string
  toasts: IToast[]
  errors: string[]
  loading: boolean
  [key: string]: unknown
}

export const useGlobalStore = defineStore('globalStore', {
  state: () => ({
    token: '',
    permissions: [],
    username: '',
    toasts: [],
    errors: [],
    loading: false,
  }),
  persist: true,
})

export let globalStore: StateManager<GlobalStoreState>

export function initializeGlobalStore() {
  const store = useGlobalStore()

  globalStore = new StateManager<GlobalStoreState>({
    storeName: 'globalStore',
    store,
  })

  return globalStore
}
