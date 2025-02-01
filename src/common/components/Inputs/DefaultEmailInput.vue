<script lang="ts">
import type { StateManager } from '@/common/helpers/StateManager'
import {
  computed,
  defineComponent,
  ref,
  watch,
  type InputTypeHTMLAttribute,
  type PropType,
} from 'vue'
import * as Yup from 'yup'

type T = Record<string, any>

interface IEmailInputProps {
  label?: string
  placeholder: string
  field: keyof T
  store: StateManager<T>
  type: InputTypeHTMLAttribute
  error?: Partial<Record<keyof T, string>>
  required?: boolean
}

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
    required: {
      type: Boolean,
      default: false,
    },
    type: {
      type: String as PropType<InputTypeHTMLAttribute>,
      default: 'text',
      required: false,
    },
    error: {
      type: Object as PropType<Partial<Record<keyof T, string>>>,
      required: false,
    },
  },
  setup(props: IEmailInputProps) {
    const { field, store, label, placeholder, required, type } = props

    const errorRef = computed(() => props.error && props.error[field])

    const internalState = store.getState()

    const internalLabel = label

    const internalPlaceholder = placeholder

    const internalError = ref<string | null>(null)

    const internalFieldValue = internalState[field] || ''

    const internalType = type

    const handleValidateEmail = (value: string) => {
      try {
        const schema = Yup.string().when([], {
          is: () => required === true,
          then: (schema) =>
            schema
              .required('O e-mail é obrigatório.')
              .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'E-mail inválido.'),
          otherwise: (schema) =>
            schema.matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/, 'E-mail inválido.'),
        })

        schema.validateSync(value)

        internalError.value = null
      } catch (err: any) {
        internalError.value = err.message
      }
    }

    const handleChange = (event: Event) => {
      const newValue = (event.target as HTMLInputElement).value

      store.setFieldValue(props.field, newValue)

      internalError.value = null
    }

    watch(
      errorRef,
      (newError) => {
        if (newError) {
          internalError.value = newError
        }
      },
      { immediate: true },
    )

    watch(internalError, () => {
      if (internalError.value) {
        props.store.addError(internalError.value)
      } else {
        props.store.clearErrors()
      }
    })

    return {
      internalFieldValue,
      internalType,
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
  <div class="flex flex-col">
    <label>{{ internalLabel }}</label>
    <InputText
      v-model="internalFieldValue"
      @input="handleChange"
      :placeholder="internalPlaceholder"
      :label="internalLabel"
      :type="internalType"
      :value="internalFieldValue"
      :invalid="internalError !== null"
      v-on:blur="handleValidateEmail(internalFieldValue)"
      v-bind="$attrs"
    />
    <span v-if="internalError" class="text-red-500 text-xs !mt-1">{{ internalError }}</span>
  </div>
</template>

<style scoped></style>
