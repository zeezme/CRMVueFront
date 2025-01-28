import { globalStore } from '../config/globalStore'

class Loading {
  start() {
    globalStore?.setFieldValue('loading', true)
  }

  stop() {
    globalStore?.setFieldValue('loading', false)
  }
}

export default new Loading()
