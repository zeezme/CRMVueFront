import { defineStore } from 'pinia'
import { computed, toRefs, unref } from 'vue'
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
      // console.log(`🍍 "${storeName}" não encontrada, criando...`)
      store = defineStore(storeName, {
        state: () => ({ ...this.initialData }),
      })

      this.store = store()
    } else if (store && !store.setState) {
      // Se a store já existe, reutiliza.
      // console.log(`🍍 "${storeName}" encontrada, reutilizando...`)

      this.store = store
    }

    if (this.store && !this.store.setState) {
      // Se a store ainda não tem as actions padrões, adiciona.
      // console.log(`🍍 "${storeName}" não possui actions definidas, inserindo...`)

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

  getRawState() {
    return Object.fromEntries(
      Object.entries(this.store.$state).map(([key, value]) => [key, unref(value)]),
    )
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

  clearState() {
    this.store.setState(this.getInitialState())
  }

  setFieldsValue(fields: Partial<T>) {
    Object.entries(fields).forEach(([key, value]) => {
      if (key in this.store.$state) {
        this.store.setState({ [key]: value } as unknown as Partial<T>)
      } else {
        const errorMessage = `Key ${key} not found in "${this.storeName}" state`
        console.error(errorMessage)
        this.store.addError(errorMessage)
      }
    })
  }

  addError(error: string) {
    this.store.addError(error)
  }

  clearErrors() {
    this.store.clearErrors()
  }

  /**
   * Fetches data from a specified endpoint and loads it into the store.
   *
   * This method is meant to be used for loading initial data for a store.
   *
   * @param {string} endpoint - The API endpoint (index route) to fetch data from
   *
   * @throws {Error} If the data received from the API endpoint is in an invalid format
   * @throws {Error} If there is an error while fetching the data
   */
  async loadDataFromId(endpoint: string) {
    if (this.initialData !== undefined) {
      try {
        const response = await api({ endpoint, method: 'GET', useAuthToken: true })

        const data = await response.data

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
