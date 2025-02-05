<script lang="ts">
import api from '@/common/helpers/api'
import type { StateManager } from '@/common/helpers/StateManager'
import { computed, defineComponent, onBeforeMount, ref, watch, type PropType } from 'vue'

type T = Record<string, any>

interface IListingProps {
  endpoint: string
  field: keyof T
  store: StateManager<T>
  matchKeys?: string[]
}

export default defineComponent({
  name: 'DefaultListing',
  props: {
    endpoint: {
      type: String,
      required: true,
    },
    field: {
      type: String as PropType<keyof T>,
      required: true,
    },
    store: {
      type: Object as PropType<StateManager<T>>,
      required: true,
    },
    matchKeys: {
      type: Array as PropType<string[]>,
      required: false,
    },
  },
  setup(props: IListingProps) {
    const { store, endpoint, field, matchKeys } = props

    const { meta } = store.getState()

    const itensList = store.getState()[field]

    const itensHeadersList = computed(() => {
      // Mapeia o primeiro item do objeto e cria uma lista de headers apartir dos keys.
      const firstItem = itensList.value[0] || {}

      let keys = Object.keys(firstItem).map((key) => ({
        field: key,
        header: key.charAt(0).toUpperCase() + key.slice(1),
      }))

      if (matchKeys) {
        keys = keys.filter((key) => matchKeys.includes(key.field))
      }

      return keys
    })

    const rows = ref()
    const totalRecords = ref()
    const first = ref(0)

    watch(
      meta,
      (_meta) => {
        rows.value = _meta.pageSize
        totalRecords.value = _meta.total
      },
      { immediate: true },
    )

    if (!meta) {
      throw new Error(
        `"meta" property is required on "${store.getStoreName()}", please implement it.`,
      )
    }

    const onPage = async (event: any) => {
      first.value = event.first

      const { data: response } = await api({
        endpoint,
        method: 'GET',
        params: { page: event.first + 1, pageSize: event.rows },
        useAuthToken: true,
      })

      if (response) {
        store.setFieldValue(field, response.data)

        rows.value = response.meta.pageSize
        totalRecords.value = response.meta.total
      }
    }

    onBeforeMount(() => {
      store.indexData({ endpoint, field })
    })

    return { itensList, itensHeadersList, rows, first, onPage, totalRecords }
  },
})
</script>

<template>
  <div style="max-width: 90vw">
    <DataTable
      :value="itensList"
      scrollable
      class="!bg-slate-700"
      :pt="{
        tbody: {
          class: ['!bg-slate-700'],
        },
      }"
    >
      <Column
        v-for="(col, index) in itensHeadersList"
        :key="index"
        :field="col.field"
        :header="col.header"
        sortable
      />
    </DataTable>
    <Paginator
      :pt="{
        root: {
          class: `!pb-0 !pt-5`,
        },
      }"
      :rows="rows"
      :totalRecords="totalRecords"
      :rowsPerPageOptions="[itensList.length, 10, 20]"
      :first="first"
      @page="onPage"
    />
  </div>
</template>

<style scoped></style>
