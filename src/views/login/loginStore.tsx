import { StateManager } from '@/common/helpers/StateManager'

interface ILoginState {
  username: string
  password: string
  errors: string[]
  [key: string]: unknown
}

const initialData: ILoginState = {
  username: '',
  password: '',
  errors: [],
}

const loginStore = new StateManager({
  storeName: 'userStore',
  initialData,
})

export default loginStore
