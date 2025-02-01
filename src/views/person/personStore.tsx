import { StateManager } from '@/common/helpers/StateManager'

interface IPerson {
  id?: string
  name?: string
  email?: string
  phone?: string | null
  active?: boolean | null
  extension?: string | null
  neighborhood?: string | null
  complement?: string | null
  address?: string | null
  number?: string | null
  city?: string | null
  state?: string | null
  type?: string
  userId?: string
  createdAt?: string
  updatedAt?: string
  user?: {
    id?: string
    username?: string
  }
}

interface IPersonState {
  personList: IPerson[]
  person: IPerson
  errors: string[]
  [key: string]: unknown
}

const initialData: IPersonState = {
  personList: [],
  person: {},
  errors: [],
}

const personStore = new StateManager({
  storeName: 'personStore',
  initialData,
})

export default personStore
