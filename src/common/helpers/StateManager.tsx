import { defineStore } from 'pinia'
import { computed, toRefs, unref, type Ref } from 'vue'
import api from './api'
import dottie from 'dottie'
import toast from './toast'

export type StateManagerOptions<T> = {
  storeName: string
  initialData?: T & { error?: string }
  store?: any
}

/**
 * A class to manage the state of a Pinia store, providing methods to interact with the store,
 * update state, handle errors, and fetch data from an API.
 *
 * @remarks
 * To ensure compatibility with Pinia plugins (e.g., `persist`), the store should be created
 * externally using `defineStore` and then passed to the `StateManager` constructor.
 * This allows plugins to hook into the store lifecycle correctly.
 *
 * @example
 * ```typescript
 * import { defineStore } from 'pinia'
 * import { StateManager } from '@/common/helpers/StateManager'
import * as dottie from 'dottie';
 *
 * // Defina a interface do estado da store
 * interface UserStoreState {
 *   id: string
 *   name: string
 *   email: string
 *   isAdmin: boolean
 *   errors: string[]
 * }
 *
 * // Crie a store externamente usando defineStore
 * const useUserStore = defineStore('userStore', {
 *   state: () => ({
 *     id: '',
 *     name: '',
 *     email: '',
 *     isAdmin: false,
 *     errors: [],
 *   }),
 *   persist: true, // Habilita o plugin de persistência
 * })
 *
 * // Crie uma instância da store
 * const userStoreInstance = useUserStore()
 *
 * // Passe a store para o StateManager
 * const userStore = new StateManager<UserStoreState>({
 *   storeName: 'userStore',
 *   store: userStoreInstance,
 * })
 *
 * // Agora você pode usar o userStore para interagir com a store
 * userStore.setFieldValue('name', 'John Doe')
 * userStore.setFieldValue('email', 'john.doe@example.com')
 *
 * console.log(userStore.getRawState()) // Exibe o estado bruto da store
 * ```
 */
export class StateManager<T extends Record<string, unknown>> {
  private static stores: Record<string, any> = {}
  private store: any
  private initialData: T & { errors?: string[] }
  private storeName: string

  /**
   * Creates a new StateManager instance.
   * @param {StateManagerOptions<T>} options - The options to initialize the StateManager.
   * @param {string} options.storeName - The name of the store.
   * @param {T & { error?: string }} [options.initialData] - The initial data for the store.
   * @param {any} [options.store] - An existing store instance to reuse.
   */
  constructor({ storeName, initialData, store }: StateManagerOptions<T>) {
    this.initialData = initialData || ({} as T & { errors?: string[] })
    this.storeName = storeName

    this.store = this.setupStore(store)
    this.addDefaultActionsToStore()
    StateManager.stores[storeName] = this.store
    this.initializeStoreWithData()
  }

  /**
   * Sets up the store, either creating a new one or reusing an existing instance.
   * @param {any} store - An existing store instance to reuse.
   * @returns {any} The configured store instance.
   */
  private setupStore(store: any): any {
    if (store === undefined) {
      const newStore = defineStore(this.storeName, {
        state: () => ({ ...this.initialData }),
      })
      return newStore()
    }
    return store
  }

  /**
   * Validates if a key (or nested key) exists in the store state.
   * @param {string} key - The key to validate (e.g., "person.email").
   * @returns {boolean} True if the key exists, false otherwise.
   */
  private validateKeyExists(key: string): boolean {
    const keys = key.split('.') // Divide a chave em partes
    let current = this.store.$state

    for (const part of keys) {
      if (!current || typeof current !== 'object' || !(part in current)) {
        return false
      }
      current = current[part]
    }

    return true
  }

  /**
   * Adds default actions (setState, addError, clearErrors) to the store if they don't already exist.
   */
  private addDefaultActionsToStore() {
    if (this.store && !this.store.setState) {
      this.store.setState = (key: string, value: any) => {
        if (!this.validateKeyExists(key)) {
          const errorMessage = `Key "${key}" not found in "${this.storeName}" state`
          console.error(errorMessage)
          toast.show.error(errorMessage)

          throw new Error(errorMessage)
        }

        dottie.set(this.store.$state, key, value)
      }

      this.store.addError = (error: string) => {
        this.store.$state.errors = this.store.$state.errors || []
        this.store.$state.errors.push(error)
      }

      this.store.clearErrors = () => {
        this.store.$state.errors = []
      }
    }
  }

  /**
   * Initializes the store with the initial data.
   */
  private initializeStoreWithData() {
    this.updateStoreState(this.initialData)
  }

  /**
   * Updates the store state with the provided data.
   * @param {Record<string, unknown>} data - The data to update the store state with.
   */
  private updateStoreState(data: Record<string, unknown>) {
    Object.entries(data).forEach(([key, value]) => {
      if (key in this.store.$state) {
        this.store.setState(key, value)
      } else {
        const errorMessage = `Key ${key} not found in "${this.storeName}" state`
        console.error(errorMessage)
        this.store.addError(errorMessage)
      }
    })
  }

  /**
   * Handles errors by logging them and adding them to the store's error state.
   * @param {any} error - The error object.
   * @param {string} context - The context in which the error occurred.
   */
  private handleError(error: any, context: string) {
    const errorMessage = `Error in ${context}: ${error.message}`
    console.error(errorMessage)
    this.store.addError(errorMessage)
  }

  /**
   * Returns the name of the store.
   * @returns {string} The store name.
   */
  getStoreName() {
    return this.storeName
  }

  /**
   * Returns the initial state of the store.
   * @returns {T & { errors?: string[] }} The initial data.
   */
  getInitialState() {
    return this.initialData
  }

  /**
   * Returns the reactive state of the store, where each property is a Ref.
   * @returns {{ [K in keyof T]: Ref<T[K]> }} The reactive state.
   */
  getState(): { [K in keyof T]: Ref<T[K]> } {
    return toRefs(this.store.$state) as { [K in keyof T]: Ref<T[K]> }
  }

  /**
   * Returns the raw state of the store, with all reactive values (Refs) unwrapped.
   * @returns {Record<string, unknown>} The raw state.
   */
  getRawState() {
    const state = this.store.$state
    return Object.keys(state).reduce(
      (acc, key) => {
        acc[key] = unref(state[key])
        return acc
      },
      {} as Record<string, unknown>,
    )
  }

  /**
   * Returns a computed reference to the store's errors.
   * @returns {Ref<string[]>} A computed reference to the errors array.
   */
  getErrors() {
    return computed(() => this.store.$state.errors ?? [])
  }

  /**
   * Sets the value of a specific field in the store state.
   * @param {K} key - The key of the field to update.
   * @param {T[K]} value - The new value for the field.
   */
  setFieldValue<K extends keyof T>(key: K, value: T[K]) {
    this.store.setState(key as string, value)
  }

  /**
   * Resets the store state to the initial data.
   */
  resetState() {
    this.updateStoreState(this.initialData)
  }

  clearState() {
    Object.keys(this.store.$state).forEach((key) => {
      const currentValue = this.store.$state[key]

      this.store.setState(
        key,
        typeof currentValue === 'string'
          ? ''
          : Array.isArray(currentValue)
            ? []
            : typeof currentValue === 'object' && currentValue !== null
              ? {}
              : undefined,
      )
    })
  }

  /**
   * Updates multiple fields in the store state.
   * @param {Partial<T>} fields - An object containing the fields to update.
   */
  setFieldsValue(fields: Partial<T>) {
    this.updateStoreState(fields)
  }

  /**
   * Adds an error to the store's error state.
   * @param {string} error - The error message to add.
   */
  addError(error: string) {
    this.store.addError(error)
  }

  /**
   * Clears all errors from the store's error state.
   */
  clearErrors() {
    this.store.clearErrors()
  }

  /**
   * Fetches data from an API endpoint and updates the store state with the response.
   * @param {string} endpoint - The API endpoint to fetch data from.
   */
  async fetchAndUpdateState(endpoint: string) {
    if (this.initialData !== undefined) {
      try {
        const response = await api({ endpoint, method: 'GET', useAuthToken: true })
        const data = await response.data

        if (typeof data !== 'object' || data === null) {
          throw new Error('Invalid data format received')
        }

        console.log(data)

        const filteredData = Object.keys(this.initialData)
          .filter((key) => key in data)
          .reduce((acc, key) => {
            acc[key as keyof T] = data[key]
            return acc
          }, {} as Partial<T>)

        console.log(filteredData)

        this.updateStoreState(filteredData)
      } catch (error: any) {
        this.handleError(error, 'fetchAndUpdateState')
      }
    }
  }

  /**
   * Fetches paginated data from an API endpoint and updates the store state with the response.
   * @param {Object} options - The options for fetching paginated data.
   * @param {string} options.endpoint - The API endpoint to fetch data from.
   * @param {string} options.field - The field in the store state to update with the fetched data.
   */
  async fetchPaginatedData({ endpoint, field }: { endpoint: string; field: string }) {
    if (this.initialData !== undefined) {
      try {
        const { data: response } = await api({
          endpoint,
          method: 'GET',
          useAuthToken: true,
        })

        if (response.data && Array.isArray(response.data)) {
          this.store.setState(field, response.data)
        }

        if (response.meta) {
          this.store.setState('meta', response.meta)
        }
      } catch (error: any) {
        this.handleError(error, 'fetchPaginatedData')
      }
    }
  }
}
