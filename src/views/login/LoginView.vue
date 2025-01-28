<script setup lang="ts">
import loginStore from './loginStore'
import DefaultTextInput from '@/common/components/Inputs/DefaultTextInput.vue'
import DefaultPasswordInput from '@/common/components/Inputs/DefaultPasswordInput.vue'
import loading from '@/common/helpers/loading'
import api from '@/common/helpers/api'
import toast from '@/common/helpers/toast'
import { globalStore } from '@/common/config/globalStore'
import * as Yup from 'yup'

const errors = loginStore.getErrors()

const handleSubmitLogin = async () => {
  const data = loginStore.getState()

  const submit = async (data: any): Promise<any> => {
    const formattedData = {
      username: data.username.value,
      password: data.password.value,
    }

    const isValid = Yup.object()
      .shape({
        username: Yup.string().required('O usuário é obrigatório.'),
        password: Yup.string().required('A senha é obrigatória.'),
      })
      .isValidSync(formattedData)

    if (!isValid) {
      loginStore.addError('O usuário ou senha é obrigatório.')
      toast.show.error('O usuário ou senha é obrigatório.')
      return
    }

    loading.start()

    return await api({
      endpoint: 'signin',
      method: 'POST',
      data: formattedData,
    })
  }

  const response = await submit(data)

  if (response === false || !response) {
    // toast.show.error('Erro no login!')

    loading.stop()

    return
  }

  globalStore.setFieldValue('token', response?.data.token)

  globalStore.setFieldValue('permissions', response?.data.permissions)

  globalStore.setFieldValue('username', response?.data.username)

  toast.show.success('Sucesso no login!')

  loading.stop()
}
</script>

<template>
  <main>
    <Card
      :pt="{
        root: {
          class: `${errors.length > 0 ? 'outline-2 outline outline-red-500 outline-offset-0' : ''}`,
        },
      }"
    >
      <template #title> <div class="text-center">Login</div> </template>
      <template #content>
        <div class="flex flex-col gap-4">
          <DefaultTextInput :store="loginStore" field="username" placeholder="Usuário" />

          <DefaultPasswordInput :store="loginStore" field="password" placeholder="Senha" />

          <Button fluid type="submit" @click="handleSubmitLogin" label="Entrar" />
        </div>
      </template>
    </Card>
  </main>
</template>
