<script lang="ts">
import api from '@/common/helpers/api'
import loading from '@/common/helpers/loading'
import type { StateManager } from '@/common/helpers/stateManager'
import toast from '@/common/helpers/toast'
import type { DataTableRowEditSaveEvent } from 'primevue/datatable'
import Dialog from 'primevue/dialog'
import { computed, defineComponent, onBeforeMount, ref, watch, type PropType } from 'vue'

type T = Record<string, any>

interface IListingProps {
  endpoint: string
  field: keyof T
  store: StateManager<T>
  insertFunction?: () => void
  insertContent?: PropType<any>
  title?: string
  matchKeys?: string[]
}

export default defineComponent({
  name: 'DefaultListing',
  props: {
    title: {
      type: String,
      required: false,
    },
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
    insertFunction: {
      type: Function as PropType<() => void>,
      required: false,
    },
    insertContent: {
      type: Object as PropType<any>,
      required: false,
    },
  },
  setup(props: IListingProps) {
    const { store, endpoint, field, matchKeys, insertFunction } = props

    const showDialog = ref(false)

    const editingRows = ref([])

    const internalInsertFunction = () => {
      if (insertFunction) {
        try {
          insertFunction()
        } finally {
          showDialog.value = false
        }
      }
    }
    const openModal = () => {
      showDialog.value = true
    }

    const { meta } = store.getState()

    const itensList = ref(store.getState()[field])

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
        params: { page: Number(event.page) + 1, pageSize: event.rows },
        useAuthToken: true,
      })

      if (response) {
        store.setFieldValue(field, response.data)

        rows.value = response.meta.pageSize
        totalRecords.value = response.meta.total
      }
    }

    const onRowEditSave = async (event: DataTableRowEditSaveEvent) => {
      const { data, newData } = event

      const changedKeys = Object.keys(newData).filter((key) => data[key] !== newData[key])

      const changedData = changedKeys.reduce((acc: T, key: string) => {
        acc[key] = newData[key]
        return acc
      }, {})

      if (Object.keys(changedData).length === 0) {
        return
      }

      try {
        loading.start()

        await api({
          endpoint: endpoint + '/' + newData.id,
          method: 'PUT',
          data: changedData,
          useAuthToken: true,
        })

        toast.show.success('Item atualizado!')
      } catch (error: any) {
        toast.show.error('Erro ao atualizar item')
      } finally {
        store.fetchPaginatedData({ endpoint, field })

        loading.stop()
      }
    }

    const handleClickDelete = async (event: any) => {
      try {
        loading.start()

        await api({
          endpoint: endpoint + '/' + event.id,
          method: 'DELETE',
          useAuthToken: true,
          showErrorToast: false,
        })

        toast.show.success('Registro deletado!')
      } catch (error: any) {
        toast.show.error('Erro ao deletar item')
      } finally {
        store.fetchPaginatedData({ endpoint, field })

        loading.stop()
      }
    }

    onBeforeMount(() => {
      store.fetchPaginatedData({ endpoint, field })
    })

    return {
      itensList,
      itensHeadersList,
      rows,
      first,
      onPage,
      totalRecords,
      openModal,
      showDialog,
      editingRows,
      onRowEditSave,
      internalInsertFunction,
      handleClickDelete,
    }
  },
})
</script>

<template>
  <Card class="!mb-4" :pt="{ body: { class: `!p-4` } }">
    <template #content>
      <div class="grid grid-cols-3">
        <div class="col-span-2 text-center flex items-center justify-start text-2xl">
          {{ $props.title }}
        </div>
        <div v-if="$props.insertFunction" class="col-span-1 flex items-center justify-end">
          <Button @click="openModal" icon="pi pi-plus" variant="outlined" />
        </div>
      </div>
    </template>
  </Card>

  <Card :pt="{ body: { class: `!px-0 !py-3 ` } }">
    <template #content>
      <DataTable
        lazy
        row-hover
        :value="itensList"
        scrollable
        scroll-height="500px"
        v-model:editingRows="editingRows"
        edit-mode="row"
        size="small"
        @row-edit-save="onRowEditSave"
      >
        <Column
          v-for="(col, index) in itensHeadersList"
          :key="index"
          :field="col.field"
          :header="col.header"
          sortable
        >
          <template #editor="{ data, field }">
            <InputText v-model="data[field]" fluid />
          </template>
        </Column>

        <Column style="width: 1px" :rowEditor="true" bodyStyle="text-align:center" />

        <Column style="width: 1px" bodyStyle="text-align:center" field="delete">
          <template #body="{ data }">
            <Button
              icon="pi pi-trash text-red-500"
              variant="text"
              @click="handleClickDelete(data)"
            />
          </template>
        </Column>
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
    </template>
  </Card>

  <Dialog
    v-model:visible="showDialog"
    modal
    :header="`Adicionar ${title}`"
    :style="{ width: '25rem' }"
    :pt="{ header: { class: `!pb-0` } }"
  >
    <Divider />

    <div class="!mb-5">
      <component :is="insertContent" :store="store" />
    </div>

    <div class="flex justify-end gap-2">
      <Button type="button" label="Cancelar" severity="secondary" @click="showDialog = false" />
      <Button type="button" label="Salvar" @click="internalInsertFunction" />
    </div>
  </Dialog>
</template>

<style scoped></style>
