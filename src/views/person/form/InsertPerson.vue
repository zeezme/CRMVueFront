<script lang="ts">
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
  <main class="flex flex-col gap-4">
    <DefaultTextInput :store="store" field="person.name" label="Nome" required />
    <DefaultEmailInput :store="store" field="person.email" label="Email" required />
  </main>
</template>
