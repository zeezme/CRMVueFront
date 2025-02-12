<script setup lang="ts">
import VCodeBlock from '@wdns/vue-code-block'
import Toast from '@/common/helpers/toast'
import { globalStore } from '@/common/config/globalStore'
import { ref } from 'vue'

const avatarLogoUrl = import.meta.env.VITE_AVATAR_URL

const toasts = ref(globalStore.getState().toasts || [])

const handleShowSuccessToast = () => {
  Toast.show.success('Operação realizada com sucesso!')
}

const handleShowErrorToast = () => {
  Toast.show.error('Ocorreu um erro ao processar a solicitação.')
}
</script>

<template>
  <Card>
    <template #content>
      <div class="flex flex-col gap-6">
        <Panel header="📌 Toasts na GlobalStore em Tempo Real" toggleable collapsed>
          <div class="flex items-center border p-2">
            <strong class="w-40">Toasts</strong>
            <ul class="list-disc pl-5">
              <li v-for="(item, index) in toasts" :key="index">
                {{ item }}
              </li>
            </ul>
          </div>
        </Panel>

        <!-- Seção: Apresentação -->
        <Panel toggleable>
          <template #header>
            <div class="flex items-center gap-3">
              <Avatar :image="avatarLogoUrl" shape="circle" />
              <span class="text-lg font-bold">Lucas Menezes</span>
            </div>
          </template>

          <p class="text-justify">
            Desenvolvi o <strong class="!font-bold">Toast</strong> para fornecer feedback visual ao
            usuário de forma simples e eficiente. Ele permite exibir mensagens de sucesso ou erro e
            integrar-se diretamente com o <strong>StateManager</strong> para gerenciar o estado das
            notificações.
          </p>

          <div class="flex flex-wrap items-center justify-between gap-4 !mt-5">
            <div class="flex items-center gap-2">
              <Button raised @click="handleShowSuccessToast">Exibir Toast de Sucesso</Button>
              <Button raised @click="handleShowErrorToast">Exibir Toast de Erro</Button>
            </div>
          </div>
        </Panel>

        <!-- Seção: Como Usar o Toast -->
        <Panel header="📌 Como Usar o Toast" toggleable collapsed>
          <p class="!mb-3">
            O componente <strong>Toast</strong> é utilizado para exibir mensagens de feedback ao
            usuário, como sucesso ou erro. Ele se integra diretamente com o
            <strong>StateManager</strong> para gerenciar o estado das notificações.
          </p>

          <div class="flex flex-col gap-5">
            <h3 class="text-lg font-semibold">🔹 Exibindo um Toast</h3>
            <p>
              Para exibir um toast, utilize os métodos <code>show.success</code> ou
              <code>show.error</code>, passando a mensagem desejada como parâmetro.
            </p>

            <VCodeBlock
              code="// Exibindo um toast de sucesso
Toast.show.success('Operação realizada com sucesso!')

// Exibindo um toast de erro
Toast.show.error('Ocorreu um erro ao processar a solicitação.')"
              highlightjs
              lang="typescript"
              theme="github-dark"
            />
          </div>

          <div class="flex flex-col gap-5 !mt-5">
            <h3 class="text-lg font-semibold">🔹 Removendo um Toast</h3>
            <p>
              O método de remoção do Toast deve ser utilizado somente dentro do helper já que ele é
              o único com acesso ao id (Randon uuidV4).
            </p>

            <VCodeBlock
              code="// Removendo um toast pelo ID
Toast.remove('id-do-toast')"
              highlightjs
              lang="typescript"
              theme="github-dark"
            />
          </div>
        </Panel>

        <!-- Seção: Estrutura do Toast -->
        <Panel header="📌 Estrutura do Toast" toggleable collapsed>
          <p class="!mb-3">
            A classe <strong>Toast</strong> é composta por métodos que facilitam a exibição e
            remoção de notificações. Abaixo está uma explicação detalhada de sua estrutura.
          </p>

          <div class="flex flex-col gap-5">
            <h3 class="text-lg font-semibold">🔹 Método `addToast`</h3>
            <p>
              O método <code>addToast</code> é responsável por adicionar um novo toast à store. Ele
              gera um ID único para o toast e o adiciona à lista de toasts no estado global.
            </p>

            <VCodeBlock
              code="private addToast(message: string, type: 'success' | 'error') {
  const id = v4()

  const newToast: IToast = { id, message, type }

  const toasts = globalStore?.getState()?.toasts.value || []

  globalStore?.setFieldValue('toasts', [...toasts, newToast])
}"
              highlightjs
              lang="typescript"
              theme="github-dark"
            />
          </div>

          <div class="flex flex-col gap-5 !mt-5">
            <h3 class="text-lg font-semibold">🔹 Método `show`</h3>
            <p>
              O método <code>show</code> é um objeto que contém duas funções: <code>success</code> e
              <code>error</code>. Ambas chamam o método <code>addToast</code> para adicionar um
              toast ao estado global.
            </p>

            <VCodeBlock
              code="show = {
  success: (message: string) => {
    this.addToast(message, 'success')
  },
  error: (message: string) => {
    this.addToast(message, 'error')
  },
}"
              highlightjs
              lang="typescript"
              theme="github-dark"
            />
          </div>

          <div class="flex flex-col gap-5 !mt-5">
            <h3 class="text-lg font-semibold">🔹 Método `remove`</h3>
            <p>
              O método <code>remove</code> é responsável por remover um toast da store com base no
              ID fornecido.
            </p>

            <VCodeBlock
              code="remove = (id: string) => {
  const toasts = globalStore?.getState()?.toasts.value || []

  globalStore?.setFieldValue(
    'toasts',
    toasts.filter((toast: IToast) => toast.id !== id),
  )
}"
              highlightjs
              lang="typescript"
              theme="github-dark"
            />
          </div>
        </Panel>
      </div>
    </template>
  </Card>
</template>
