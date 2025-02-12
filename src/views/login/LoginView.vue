<script setup lang="ts">
import loginStore from './loginStore'
import DefaultTextInput from '@/common/components/Inputs/DefaultTextInput.vue'
import DefaultPasswordInput from '@/common/components/Inputs/DefaultPasswordInput.vue'
import loading from '@/common/helpers/loading'
import api from '@/common/helpers/api'
import toast from '@/common/helpers/toast'
import { globalStore } from '@/common/config/globalStore'
import * as Yup from 'yup'
import { ref } from 'vue'
import Validator from '@/common/helpers/yupValidator'
import { useRouter } from 'vue-router'

const errorRef = ref()

const router = useRouter()

const handleSubmitLogin = async () => {
  const loginData = loginStore.getRawState()

  const validationSchema = Yup.object().shape({
    username: Yup.string().required('O usuário é obrigatório.'),
    password: Yup.string().required('A senha é obrigatória.'),
  })

  const validator = new Validator(loginData, validationSchema)
  const { isValid, errors } = await validator.validate()

  if (!isValid) {
    errorRef.value = errors
    return
  }

  loading.start()

  try {
    const response = await api({
      endpoint: 'signin',
      method: 'POST',
      data: loginData,
      showErrorToast: false,
    })

    globalStore.setFieldsValue({
      token: response.data.token,
      permissions: response.data.permissions,
      username: response.data.username,
    })

    toast.show.success('Sucesso no login!')

    router.push({ name: 'home' })
  } catch (error) {
    toast.show.error('Erro no login!')

    return
  } finally {
    loading.stop()
  }
}
</script>

<template>
  <main class="flex items-center flex-col justify-center gap-4 h-[90vh]">
    <Card>
      <template #content>
        <div class="flex flex-col">
          <p class="text-center !font-semibold !mb-2">Que tal tentar:</p>

          <p class="text-center">Usuário: portfolio</p>
          <p class="text-center">Senha: Portfolio@123</p>
        </div></template
      >
    </Card>
    <Card>
      <template #title>
        <div class="text-center">Login</div>
      </template>
      <template #content>
        <div
          class="flex flex-col gap-4"
          @keypress="(e) => e.key === 'Enter' && handleSubmitLogin()"
        >
          <DefaultTextInput
            forceFocus
            :store="loginStore"
            field="username"
            placeholder="Usuário"
            :error="errorRef"
            required
          />

          <DefaultPasswordInput
            :store="loginStore"
            field="password"
            placeholder="Senha"
            :error="errorRef"
            required
          />

          <Button fluid type="submit" @click="handleSubmitLogin" label="Entrar" />
        </div>
      </template>
    </Card>
  </main>
</template>
