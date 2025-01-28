import { defineStore } from 'pinia'
import { computed, toRefs } from 'vue'
import api from './api'

export type StateManagerOptions<T> = {
  storeName: string
  initialData?: T & { error?: string }
  store?: any
}

export class StateManager<T extends Record<string, unknown>> {
  private static stores: Record<string, any> = {}
  private store: any
  private initialData?: T & { errors?: string[] }
  private storeName: string

  constructor({ storeName, initialData, store }: StateManagerOptions<T>) {
    this.initialData = initialData || ({} as T & { errors?: string[] })
    this.storeName = storeName

    // Se a store ainda não foi criada, cria.
    if (store === undefined) {
      console.log(`🍍 "${storeName}" não encontrada, criando...`)
      store = defineStore(storeName, {
        state: () => ({ ...this.initialData }),
      })

      this.store = store()
    } else if (store && !store.setState) {
      // Se a store já existe, reutiliza.
      console.log(`🍍 "${storeName}" encontrada, reutilizando...`)

      this.store = store
    }

    if (this.store && !this.store.setState) {
      // Se a store ainda não tem as actions padrões, adiciona.
      console.log(`🍍 "${storeName}" não possui actions definidas, inserindo...`)

      this.store.setState = (data: Partial<T>) => {
        Object.assign(this.store.$state, data)
      }

      this.store.addError = (error: string) => {
        if (this.store.$state.errors && Array.isArray(this.store.$state.errors)) {
          this.store.$state.errors.push(error)
        } else {
          this.store.$state.errors = [error]
        }
      }

      this.store.clearErrors = () => {
        this.store.$state.errors = []
      }
    }

    StateManager.stores[storeName] = this.store

    Object.entries(this.initialData).forEach(([key, value]) => {
      this.store.$state[key] = value
    })
  }

  getInitialState() {
    return this.initialData
  }

  getState() {
    return toRefs(this.store.$state)
  }

  getErrors() {
    return computed(() => this.store.$state.errors ?? [])
  }

  setFieldValue<K extends keyof T>(key: K, value: T[K]) {
    if (key in this.store.$state) {
      this.store.setState({ [key]: value } as unknown as Partial<T>)
    } else {
      const errorMessage = `Key ${key.toString()} not found in "${this.storeName}" state`
      console.error(errorMessage)
      this.store.addError(errorMessage)
      throw new Error(errorMessage)
    }
  }

  addError(error: string) {
    this.store.addError(error)
  }

  clearErrors() {
    this.store.clearErrors()
  }

  async fetchIndex(endpoint: string) {
    if (this.initialData !== undefined) {
      try {
        const response = await api({ endpoint, method: 'GET' })

        if (response === false) {
          throw new Error(`Failed to fetch data from ${endpoint}`)
        }

        const data = await response.data.toJSON()

        if (typeof data !== 'object' || data === null) {
          throw new Error('Invalid data format received')
        }

        const filteredData: Partial<T> = Object.keys(this.initialData)
          .filter((key) => key in data)
          .reduce((acc, key) => {
            acc[key as keyof T] = data[key]
            return acc
          }, {} as Partial<T>)

        this.store.setState(filteredData)
      } catch (error: any) {
        const errorMessage = `Error fetching data: ${error.message}`
        console.error(errorMessage)
        this.store.addError(errorMessage)
      }
    }
  }
}
