import { StateManager } from '@/common/helpers/stateManager'

interface IInputState {
  campoUsername: string
  campoPassword: string
  campoEmail: string
  errors: string[]
  [key: string]: unknown
}

const initialData: IInputState = {
  campoEmail: '',
  campoUsername: '',
  campoPassword: '',
  errors: [],
}

const inputStore = new StateManager({
  storeName: 'inputStore',
  initialData,
})

export default inputStore
