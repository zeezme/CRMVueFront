<script setup lang="ts">
import { globalStore } from '@/common/config/globalStore'
import personStore from '../person/personStore'
import { computed, ref } from 'vue'
import toast from '@/common/helpers/toast'
import dottie from 'dottie'
import router from '@/router'
import DefaultTextInput from '@/common/components/Inputs/DefaultTextInput.vue'
import DefaultEmailInput from '@/common/components/Inputs/DefaultEmailInput.vue'
import DefaultPasswordInput from '@/common/components/Inputs/DefaultPasswordInput.vue'

const global = ref(globalStore.getState())
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

const globalEntries = computed(() => {
  const flattened = dottie.flatten(global.value)
  console.log(flattened)
  return Object.entries(flattened).map(([key, value]) => ({
    key,
    value: Array.isArray(value)
      ? value.map((item) => (typeof item === 'object' ? Object.values(item)[1] : item)).join(', ')
      : typeof value === 'object'
        ? Object.values(value)[0]
        : value,
  }))
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

const handleLogout = () => {
  globalStore.clearState()

  router.push({ name: 'login' })
}
</script>

<template>
  <main class="flex flex-col md:flex-row gap-5">
    <!-- Estado Global -->
    <div class="flex flex-col md:w-2/4 gap-5">
      <Card>
        <template #title>
          <div class="text-center">Estado Global</div>
        </template>
        <template #content>
          <DataTable :value="globalEntries" scrollable scrollHeight="500px" class="p-datatable-sm">
            <Column field="key" header="Chave"></Column>
            <Column field="value" header="Valor">
              <template #body="{ data }">
                <span
                  v-if="data.key === 'token'"
                  class="truncate block w-48"
                  title="Token ocultado"
                >
                  🔒 Token
                </span>
                <span v-else>{{ data.value }}</span>
              </template>
            </Column>
          </DataTable>
        </template>
      </Card>

      <Card>
        <template #content>
          <ButtonGroup class="flex flex-wrap justify-center">
            <Button class="" @click="handleInserirToast">Inserir Toast</Button>
            <Button class="" @click="handleCiclarLoading">Ciclar Loading</Button>
            <Button class="" @click="handleLogout">Logout</Button>
          </ButtonGroup>
        </template>
      </Card>
    </div>

    <!-- Estado Pessoa -->
    <div class="flex flex-col md:w-1/4 gap-5">
      <Card>
        <template #title>
          <div class="text-center">Estado Pessoa</div>
        </template>
        <template #content>
          <DataTable :value="personEntries" scrollable scrollHeight="500px" class="p-datatable-sm">
            <Column field="key" header="Chave"></Column>
            <Column field="value" header="Valor"></Column>
          </DataTable>
        </template>
      </Card>
    </div>

    <!-- Lista de Pessoas -->
    <div class="flex flex-col md:w-1/4 gap-5">
      <Card>
        <template #title>
          <div class="text-center">Lista de Pessoas</div>
        </template>
        <template #content>
          <DataTable
            :value="personListEntries"
            scrollable
            scrollHeight="400px"
            class="p-datatable-sm"
          >
            <Column field="name" header="Nome" style=""></Column>
            <Column field="email" header="E-mail" style=""></Column>
          </DataTable>
        </template>
      </Card>

      <!-- Inputs -->
      <Card>
        <template #content>
          <DefaultPasswordInput
            :store="personStore"
            field="person.fakePassword"
            label="Senha"
            enable-strength-meter
          />
        </template>
      </Card>

      <Card>
        <template #content>
          <div class="flex flex-col gap-2">
            <DefaultTextInput :store="personStore" field="person.name" label="Nome" required />
            <DefaultEmailInput :store="personStore" field="person.email" label="Email" required />
          </div>
        </template>
      </Card>
    </div>
  </main>
</template>
