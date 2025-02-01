<script lang="ts">
import type { StateManager } from '@/common/helpers/StateManager'
import {
  computed,
  defineComponent,
  ref,
  toRef,
  watch,
  type InputTypeHTMLAttribute,
  type PropType,
} from 'vue'

type T = Record<string, any>

interface ITextInputProps {
  label?: string
  placeholder?: string
  field: keyof T
  store: StateManager<T>
  type?: InputTypeHTMLAttribute
  required?: boolean
  error?: Partial<Record<keyof T, string>>
}

export default defineComponent({
  name: 'DefaultTextInput',
  props: {
    label: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    type: {
      type: String as PropType<InputTypeHTMLAttribute>,
      default: 'text',
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
      required: false,
    },
    error: {
      type: Object as PropType<Partial<Record<keyof T, string>>>,
      required: false,
    },
  },
  setup(props: ITextInputProps) {
    const { field, store, label, placeholder, type, required } = props

    const errorRef = computed(() => props.error && props.error[field])

    const internalState = store.getState()

    const internalLabelFieldValue = internalState[field]

    const internalError = ref()

    const internalType = type

    const internalLabelLabel = label

    const internalLabelPlaceholder = placeholder

    const handleChange = (event: Event) => {
      internalError.value = null

      const newValue = (event.target as HTMLInputElement).value

      store.setFieldValue(field, newValue)
    }

    const handleValidate = (value: string) => {
      if (required === true && value === '') {
        internalError.value = `O ${label || placeholder || field} é obrigatório.`
      }
    }

    watch(
      errorRef,
      () => {
        if (errorRef.value) {
          internalError.value = errorRef.value
        }
      },
      { immediate: true },
    )

    watch(internalError, () => {
      if (internalError.value) {
        store.addError(internalError.value)
      } else {
        store.clearErrors()
      }
    })

    return {
      internalLabelFieldValue,
      internalLabelLabel,
      internalLabelPlaceholder,
      internalType,
      internalError,
      handleChange,
      handleValidate,
    }
  },
})
</script>

<template>
  <div class="flex flex-col">
    <label>{{ internalLabelLabel }}</label>

    <InputText
      v-model="internalLabelFieldValue"
      @input="handleChange"
      :placeholder="internalLabelPlaceholder"
      :label="internalLabelLabel"
      :type="internalType"
      :value="internalLabelFieldValue"
      :class="{ 'p-invalid': !!internalError }"
      v-on:blur="handleValidate(internalLabelFieldValue)"
      v-bind="$attrs"
    />

    <span v-if="internalError" class="text-red-500 text-xs !mt-1">{{ internalError }}</span>
  </div>
</template>

<style scoped>
.p-invalid {
  border-color: red;
}
</style>
