<script lang="ts">
import type { StateManager } from '@/common/helpers/StateManager'
import { defineComponent, ref, type InputTypeHTMLAttribute, type PropType } from 'vue'
import * as Yup from 'yup'

type T = Record<string, any>

export default defineComponent({
  name: 'DefaultEmailInput',
  props: {
    label: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    field: {
      type: String as PropType<keyof T>,
      required: true,
    },
    store: {
      type: Object as PropType<StateManager<T>>,
      required: true,
    },
    type: {
      type: String as PropType<InputTypeHTMLAttribute>,
      default: 'text',
      required: false,
    },
  },
  setup(props) {
    const internalState = props.store.getState()

    const internalFieldValue = internalState[props.field] || ''

    const internalLabel = props.label

    const internalPlaceholder = props.placeholder

    const internalError = ref<string | null>(null)

    const handleValidateEmail = (value: string) => {
      try {
        Yup.string()
          .required('O e-mail é obrigatório.')
          .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'E-mail inválido.')
          .validateSync(value)
        internalError.value = null
      } catch (err: any) {
        internalError.value = err.message
      }
    }

    const handleChange = (event: Event) => {
      const newValue = (event.target as HTMLInputElement).value

      props.store.setFieldValue(props.field, newValue)

      internalError.value = null
    }

    return {
      internalFieldValue,
      internalLabel,
      internalPlaceholder,
      handleChange,
      handleValidateEmail,
      internalError,
    }
  },
})
</script>

<template>
  <div class="flex flex-col gap-2">
    <label>{{ internalLabel }}</label>
    <InputText
      v-model="internalFieldValue"
      @input="handleChange"
      :placeholder="internalPlaceholder"
      :label="internalLabel"
      :type="type"
      :value="internalFieldValue"
      :invalid="internalError !== null"
      v-on:blur="handleValidateEmail(internalFieldValue)"
      v-bind="$attrs"
    />
    <span v-if="internalError" class="text-red-500 text-xs">{{ internalError }}</span>
  </div>
</template>

<style scoped></style>
