<script lang="ts">
import type { StateManager } from '@/common/helpers/StateManager'
import { defineComponent, type InputTypeHTMLAttribute, type PropType } from 'vue'

type T = Record<string, any>

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

    const internalLabelFieldValue = internalState[props.field]

    const internalLabelLabel = props.label

    const internalLabelPlaceholder = props.placeholder

    const handleChange = (event: Event) => {
      const newValue = (event.target as HTMLInputElement).value

      props.store.setFieldValue(props.field, newValue)
    }

    return {
      internalLabelFieldValue,
      internalLabelLabel,
      internalLabelPlaceholder,
      handleChange,
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
      :type="type"
      :value="internalLabelFieldValue"
      v-bind="$attrs"
    />
  </div>
</template>

<style scoped></style>
