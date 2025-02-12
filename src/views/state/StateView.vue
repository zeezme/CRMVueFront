<script setup lang="ts">
import { globalStore } from '@/common/config/globalStore'
import toast from '@/common/helpers/toast'
import dottie from 'dottie'
import { computed, ref } from 'vue'
import VCodeBlock from '@wdns/vue-code-block'

const global = ref(globalStore.getState())

const avatarLogoUrl = import.meta.env.VITE_AVATAR_URL

const globalEntries = computed(() => {
  return dottie.flatten(global.value)
})

const handleInserirToast = () => {
  toast.show.success('Toast inserido')
}

const handleCiclarLoading = () => {
  globalStore.setFieldValue('loading', true)

  setTimeout(() => {
    globalStore.setFieldValue('loading', false)
  }, 1500)
}
</script>
<template>
  <Card>
    <template #content>
      <div class="flex flex-col gap-6">
        <!-- Seção: Informações do Usuário -->
        <Panel header="📌 Global Store em Tempo Real" toggleable collapsed>
          <p class="mb-3">
            Abaixo estão alguns dos principais dados gerenciados pelo <strong>StateManager</strong>:
          </p>

          <Accordion :multiple="true">
            <!-- Informações Gerais -->
            <AccordionTab header="🔹 Informações Gerais">
              <p><strong>Usuário:</strong> {{ globalEntries.username }}</p>
              <p><strong>Carregando:</strong> {{ globalEntries.loading ? 'Sim' : 'Não' }}</p>
            </AccordionTab>

            <!-- Permissões -->
            <AccordionTab header="🔹 Permissões">
              <p>Lista das permissões atribuídas ao usuário:</p>
              <ul class="list-disc pl-5">
                <li v-for="permission in globalEntries.permissions" :key="permission">
                  {{ permission }}
                </li>
              </ul>
            </AccordionTab>

            <!-- Token -->
            <AccordionTab header="🔹 Token de Autenticação">
              <p class="truncate">O token JWT armazenado para autenticação:</p>
              <p class="text-sm font-mono">{{ globalEntries.token }}</p>
            </AccordionTab>

            <!-- Toasts -->
            <AccordionTab header="🔹 Notificações (Toasts)">
              <p>Mensagens de feedback geradas pela aplicação:</p>
              <ul class="list-disc pl-5">
                <li v-for="(toast, index) in globalEntries.toasts" :key="index">
                  {{ toast }}
                </li>
              </ul>
            </AccordionTab>

            <!-- Erros -->
            <AccordionTab header="🔹 Erros Capturados">
              <p>Lista de erros recentes armazenados na store:</p>
              <ul class="list-disc pl-5 text-red-500">
                <li v-for="(error, index) in globalEntries.errors" :key="index">
                  {{ error }}
                </li>
              </ul>
            </AccordionTab>
          </Accordion>
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
            Desenvolvi o <strong>StateManager</strong> para simplificar o gerenciamento de estado no
            Vue, reduzindo a complexidade do Pinia e oferecendo uma abordagem mais intuitiva e
            eficiente. Abaixo, você encontrará exemplos práticos de como utilizá-lo.
          </p>

          <template #footer>
            <div class="flex flex-wrap items-center justify-between gap-4">
              <div class="flex items-center gap-2">
                <Button raised @click="handleInserirToast">Inserir Toast</Button>
                <Button raised @click="handleCiclarLoading">Ciclar Loading</Button>
              </div>
            </div>
          </template>
        </Panel>

        <!-- #region Como Criar Uma Store -->
        <Panel header="📖 Como Criar Uma Store" toggleable collapsed>
          <div class="flex flex-col gap-5 !mb-5">
            <div>
              <h3 class="text-lg font-semibold">📌 Introdução</h3>
              <p class="text-justify">
                O <strong>StateManager</strong> permite um gerenciamento eficiente do estado,
                reduzindo o boilerplate e simplificando a manutenção do código.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold">📂 Estrutura da Store</h3>
              <p class="text-justify">
                Para começar, crie um arquivo chamado <code>{modulo}Store.ts</code> na mesma pasta
                do seu componente ou view. Esse arquivo será responsável por armazenar o estado do
                módulo.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold">📜 Exemplo</h3>

              <VCodeBlock
                code="import { StateManager } from '@/common/helpers/stateManager'

/**
 * Interface que define a estrutura do estado do login.
 */
interface ILoginState {
  username: string
  password: string
  errors: string[]
  [key: string]: unknown // Permite adicionar novas chaves dinamicamente
}

/**
 * Estado inicial da store de login.
 */
const initialData: ILoginState = {
  username: '',
  password: '',
  errors: [],
}

/**
 * Criação da store utilizando StateManager.
 * - storeName: Nome da store para identificação.
 * - initialData: Estado inicial definido acima.
 */
const loginStore = new StateManager({
  storeName: 'userStore',
  initialData,
})

export default loginStore
"
                highlightjs
                lang="typescript"
                theme="github-dark"
              />
              <p class="text-justify">
                Neste bloco de código, declaramos uma interface chamada <code>ILoginState</code> que
                define a estrutura da store de Login. Esta tipagem além de ser utilizado no
                StateManager para limitar os tipos de dados que podem ser armazenados, ela também
                pode ser utilizada em qualquer parte do código para garantir que o estado seja do
                tipo esperado.
              </p>
            </div>
          </div>
        </Panel>

        <!-- Seção: Como Usar Uma Store -->
        <Panel header="📖 Como Usar Uma Store" toggleable collapsed>
          <div class="flex flex-col gap-5 !mb-5">
            <div>
              <h3 class="text-lg font-semibold text-gray">📌 Introdução</h3>
              <p class="text-justify text-sm">
                Agora que você já criou uma store, vamos aprender como utilizá-la através da classe
                <code class="!font-black">StateManager</code>, que fornece métodos para gerenciar o
                estado, fazer atualizações e lidar com erros de forma centralizada.
              </p>
            </div>

            <div>
              <h3 class="text-lg font-semibold text-gray">📂 Utilização</h3>
              <p class="text-justify text-sm">
                Para utilizar a store, basta importar a store em seu componente ou view e acessar o
                estado ou interagir com ele utilizando os métodos disponíveis:
              </p>

              <div class="bg-gray-900 p-4 rounded-lg overflow-auto shadow-md">
                <VCodeBlock
                  code="// Importando a store (Intellisense irá sugerir os tipos estipulados na criação da store).
const { userName } = loginStore.getState()

// Alterando um campo do estado.
loginStore.setFieldValue('chave', 'valor')

// Retorna o estado unwrapped, ideal para uso externo ou seja para enviar para uma API.
loginStore.getRawState()

// Lidar com erros:
loginStore.addError('Mensagem de erro')
loginStore.clearErrors()

// Buscar dados de uma API e atualizar o estado (Em testes):
store.fetchAndUpdateState('/endpoint')

// Usado para atualizar a listagem e setar os dados diretamente em um campo na store, como por exemplo personList da personStore.
personStore.fetchPaginatedData({ endpoint, field })
"
                  highlightjs
                  lang="typescript"
                  theme="github-dark"
                />
              </div>
            </div>

            <div>
              <h3 class="text-lg text-gray">⚙️ Métodos da Store</h3>
              <p class="text-justify text-sm">
                A <code class="!font-black">StateManager</code> oferece uma série de métodos para
                interagir com o estado da store:
              </p>
              <ul class="list-disc text-bold pl-6 text-sm text-gray-400">
                <li>
                  <strong class="text-red-400 !font-bold">getState()</strong>: Retorna o estado
                  reativo da store, onde cada propriedade é um <code class="!font-black">Ref</code>.
                </li>
                <li>
                  <strong class="text-red-400 !font-bold">getRawState()</strong>: Retorna o estado
                  bruto, com todas as propriedades não reativas desfeitas.
                </li>
                <li>
                  <strong class="text-red-400 !font-bold">setFieldValue(key, value)</strong>:
                  Atualiza um campo específico no estado.
                </li>
                <li>
                  <strong class="text-red-400 !font-bold">setFieldsValue(fields)</strong>: Atualiza
                  múltiplos campos no estado.
                </li>
                <li>
                  <strong class="text-red-400 !font-bold">resetState()</strong>: Restaura o estado
                  para os dados iniciais.
                </li>
                <li>
                  <strong class="text-red-400 !font-bold">clearState()</strong>: Limpa todos os
                  campos do estado.
                </li>
                <li>
                  <strong class="text-red-400 !font-bold">addError(error)</strong>: Adiciona um erro
                  à lista de erros da store.
                </li>
                <li>
                  <strong class="text-red-400 !font-bold">clearErrors()</strong>: Limpa todos os
                  erros da store.
                </li>
                <li>
                  <strong class="text-red-400 !font-bold">fetchAndUpdateState(endpoint)</strong>:
                  Faz uma requisição à API e atualiza o estado com a resposta.
                </li>
                <li>
                  <strong class="text-red-400 !font-bold"
                    >fetchPaginatedData({ endpoint, field })</strong
                  >: Faz uma requisição à API e atualiza um campo do estado com os dados paginados.
                </li>
              </ul>
            </div>
          </div>
        </Panel>
      </div>
    </template>
  </Card>
</template>
