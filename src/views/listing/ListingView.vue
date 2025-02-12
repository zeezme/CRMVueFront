<script setup lang="ts">
import { computed, ref } from 'vue'
import VCodeBlock from '@wdns/vue-code-block'
import DefaultListing from '@/common/components/listing/DefaultListing.vue'
import * as Yup from 'yup'
import Validator from '@/common/helpers/yupValidator'
import loading from '@/common/helpers/loading'
import api from '@/common/helpers/api'
import toast from '@/common/helpers/toast'
import type { IPerson } from '../person/personStore'
import personStore from '../person/personStore'
import InsertPerson from '../person/form/InsertPerson.vue'
import dottie from 'dottie'

const avatarLogoUrl = import.meta.env.VITE_AVATAR_URL

const person = ref(personStore.getState())

const personListEntries = computed(() => {
  if (!person.value || !person.value.personList) return []

  return person.value.personList.map((personItem) => ({
    name: personItem.name,
    email: personItem.email,
  }))
})

const personEntries = computed(() => {
  if (!person.value) return []

  const flattened = dottie.flatten(person.value)

  return Object.entries(flattened)
    .filter(([key]) => key !== 'personList')
    .map(([key, value]) => ({
      key,
      value: Array.isArray(value)
        ? value.map((item) => (typeof item === 'object' ? JSON.stringify(item) : item)).join(', ')
        : typeof value === 'object' && value !== null
          ? JSON.stringify(value)
          : (value ?? 'Sem'),
    }))
})

console.log(personListEntries)

const errorRef = ref()

const insertPerson = async () => {
  const personData = personStore.getRawState().person as IPerson

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('O nome é obrigatório.'),
    email: Yup.string().required('O e-mail é obrigatório.'),
  })

  const validator = new Validator(personData, validationSchema)
  const { isValid, errors } = await validator.validate()

  if (!isValid) {
    errorRef.value = errors
    return
  }

  loading.start()

  try {
    await api({
      endpoint: 'person',
      method: 'POST',
      data: personData,
      useAuthToken: true,
    })

    toast.show.success('Sucesso ao inserir pessoa!')
  } catch (error) {
    return
  } finally {
    personStore.fetchPaginatedData({
      endpoint: 'person',
      field: 'personList',
    })
    loading.stop()
  }
}
</script>

<template>
  <Card>
    <template #content>
      <div class="flex flex-col gap-6">
        <Panel header="📌 PersonStore em Tempo Real" toggleable collapsed>
          <div class="flex flex-row w-full gap-5">
            <div class="w-2/5">
              <div
                class="grid grid-cols-2 w-full"
                v-for="(person, index) in personListEntries"
                :key="index"
              >
                <div class="flex items-center border p-2">
                  <strong class="w-40">Name:</strong>
                  <span>{{ person.name }}</span>
                </div>
                <div class="flex items-center border p-2">
                  <strong class="w-40">Email:</strong>
                  <span>{{ person.email }}</span>
                </div>
              </div>
            </div>

            <div class="w-3/5 bg-red-500">
              <DataTable
                :value="personEntries"
                scrollable
                scrollHeight="500px"
                class="p-datatable-sm"
              >
                <Column field="key" header="Chave"></Column>
                <Column field="value" header="Valor"></Column>
              </DataTable>
            </div>
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
            O componente <strong class="!font-bold">DefaultListing</strong> é uma tabela dinâmica
            que permite listar, editar e excluir registros de forma eficiente. Ele se integra
            diretamente com o <strong>StateManager</strong> para gerenciar o estado dos dados e
            oferece suporte a paginação, edição em linha e inclusão de novos registros.
          </p>

          <div class="flex flex-col gap-4 !mt-5">
            <DefaultListing
              title="Pessoas"
              :store="personStore"
              endpoint="person"
              field="personList"
              :matchKeys="['name', 'email', 'type']"
              :insertFunction="insertPerson"
              :insertContent="InsertPerson"
            />
          </div>
        </Panel>

        <!-- Seção: Como Usar o DefaultListing -->
        <Panel header="📌 Como Usar o DefaultListing" toggleable collapsed>
          <p class="!mb-3">
            O componente <strong>DefaultListing</strong> é altamente configurável e pode ser
            utilizado para listar dados de qualquer endpoint. Abaixo estão os passos para
            utilizá-lo.
          </p>

          <div class="flex flex-col gap-5">
            <h3 class="text-lg font-semibold">🔹 Exemplo Básico</h3>
            <p>
              Para utilizar o <strong>DefaultListing</strong>, importe o componente e passe as
              propriedades necessárias, como <code>title</code>, <code>store</code>,
              <code>endpoint</code> e <code>field</code>.
            </p>

            <VCodeBlock
              code="<template>
  <DefaultListing
    title='Pessoas'
    :store='personStore'
    endpoint='person'
    field='personList'
    :matchKeys='['name', 'email', 'type']'
    :insertFunction='insertPerson'
    :insertContent='InsertPerson'
  />
</template>"
              highlightjs
              lang="html"
              theme="github-dark"
            />
          </div>

          <div class="flex flex-col gap-5 !mt-5">
            <h3 class="text-lg font-semibold">🔹 Inserindo Novos Registros</h3>
            <p>
              Para adicionar a funcionalidade de inserção de novos registros, utilize as
              propriedades
              <code>insertFunction</code> e <code>insertContent</code>.
            </p>

            <VCodeBlock
              code="const insertPerson = async () => {
  const personData = personStore.getRawState().person as IPerson

  const validationSchema = Yup.object().shape({
    name: Yup.string().required('O nome é obrigatório.'),
    email: Yup.string().required('O e-mail é obrigatório.'),
  })

  const validator = new Validator(personData, validationSchema)
  const { isValid, errors } = await validator.validate()

  if (!isValid) {
    errorRef.value = errors
    return
  }

  loading.start()

  try {
    await api({
      endpoint: 'person',
      method: 'POST',
      data: personData,
      useAuthToken: true,
    })

    toast.show.success('Sucesso ao inserir pessoa!')
  } catch (error) {
    return
  } finally {
    personStore.fetchPaginatedData({
      endpoint: 'person',
      field: 'personList',
    })
    loading.stop()
  }
}"
              highlightjs
              lang="typescript"
              theme="github-dark"
            />
          </div>

          <div class="flex flex-col gap-5 !mt-5">
            <h3 class="text-lg font-semibold">🔹Modal de Inserção</h3>
            <p>
              O conteúdo do modal de inserção deve ser definido em um componente separado,
              recomenda-se que seja criada uma pasta chamada "form" na raiz do módulo e dentro dela,
              criar um arquivo chamado "Insert{alvo do módulo. Ex.: Person}.vue".
            </p>

            <VCodeBlock
              code="<script lang='ts'>
import { defineComponent, type PropType } from 'vue'
import DefaultTextInput from '@/common/components/Inputs/DefaultTextInput.vue'
import DefaultEmailInput from '@/common/components/Inputs/DefaultEmailInput.vue'
import type { StateManager } from '@/common/helpers/stateManager'

type T = Record<string, any>

export default defineComponent({
  name: 'InsertPerson',
  components: {
    DefaultTextInput,
    DefaultEmailInput,
  },
  props: {
    store: {
      type: Object as PropType<StateManager<T>>,
      required: true,
    },
  },
  setup(props) {
    const { store } = props

    return { internalStore: store }
  },
})
</script>

<template>
  <main class='flex flex-col gap-4'>
    <DefaultTextInput :store='store' field='person.name' label='Nome' required />
    <DefaultEmailInput :store='store' field='person.email' label='Email' required />
  </main>
</template>
"
              highlightjs
              lang="html"
              theme="github-dark"
            />
          </div>
        </Panel>

        <!-- Seção: Estrutura do DefaultListing -->
        <Panel header="📌 Estrutura do DefaultListing" toggleable collapsed>
          <p class="!mb-3">
            O componente <strong>DefaultListing</strong> é composto por uma tabela dinâmica com
            suporte a paginação, edição em linha e exclusão de registros. Abaixo está uma explicação
            detalhada de sua estrutura.
          </p>

          <div class="flex flex-col gap-5">
            <h3 class="text-lg font-semibold">🔹 Propriedades</h3>
            <p>O componente aceita as seguintes propriedades:</p>
            <ul class="list-disc pl-5 text-sm text-gray-400">
              <li><strong>title</strong>: Título exibido acima da tabela.</li>
              <li><strong>store</strong>: Instância do <code>StateManager</code>.</li>
              <li><strong>endpoint</strong>: Endpoint da API para buscar os dados.</li>
              <li>
                <strong>field</strong>: Campo no estado da store onde os dados serão armazenados.
              </li>
              <li><strong>matchKeys</strong>: Lista de chaves para filtrar as colunas exibidas.</li>
              <li><strong>insertFunction</strong>: Função para inserir novos registros.</li>
              <li>
                <strong>insertContent</strong>: Componente para o conteúdo do modal de inserção.
              </li>
            </ul>
          </div>

          <!-- <div class="flex flex-col gap-5 !mt-5">
            <h3 class="text-lg font-semibold">🔹 Métodos</h3>
            <p>O componente oferece os seguintes métodos:</p>
            <ul class="list-disc pl-5 text-sm text-gray-400">
              <li>
                <strong class="text-red-400 !font-bold">onPage</strong>: Atualiza os dados da tabela
                quando a página é alterada.
              </li>
              <li>
                <strong class="text-red-400 !font-bold">onRowEditSave</strong>: Salva as alterações
                feitas na edição em linha.
              </li>
              <li>
                <strong class="text-red-400 !font-bold">handleClickDelete</strong>: Exclui um
                registro da tabela.
              </li>
            </ul>
          </div> -->
        </Panel>
      </div>
    </template>
  </Card>
</template>
