import { StateManager } from '@/common/helpers/stateManager'

export interface IPerson {
  id: string
  name: string
  email: string
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
  fakePassword?: string
}

interface IPersonState {
  personList: IPerson[]
  person: IPerson
  errors: string[]
  meta: object
  [key: string]: unknown
}

const initialData: IPersonState = {
  personList: [],
  person: {
    id: '',
    name: '',
    email: '',
    phone: null,
    active: null,
    extension: null,
    neighborhood: null,
    complement: null,
    address: null,
    number: null,
    city: null,
    state: null,
    type: 'user',
    userId: '',
    fakePassword: '',
  },
  errors: [],
  meta: {},
}

const personStore = new StateManager({
  storeName: 'personStore',
  initialData,
})

export default personStore
