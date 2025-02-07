<script setup lang="ts">
import DefaultListing from '@/common/components/listing/DefaultListing.vue'
import InsertPerson from './form/InsertPerson.vue'
import personStore from './personStore'
import * as Yup from 'yup'
import Validator from '@/common/helpers/yupValidator'
import { ref } from 'vue'
import loading from '@/common/helpers/loading'
import api from '@/common/helpers/api'
import toast from '@/common/helpers/toast'
import { type IPerson } from './personStore'

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
  <main class="w-full flex flex-col h-full">
    <DefaultListing
      title="Pessoas"
      :store="personStore"
      endpoint="person"
      field="personList"
      :matchKeys="['name', 'email', 'type']"
      :insertFunction="insertPerson"
      :insertContent="InsertPerson"
    />
  </main>
</template>
