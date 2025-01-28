<script lang="ts">
import type { StateManager } from '@/common/helpers/StateManager'
import { defineComponent, ref, watch, type InputTypeHTMLAttribute, type PropType } from 'vue'
import { useElementSize } from '@vueuse/core'
import { zxcvbn } from '@zxcvbn-ts/core'
import { ProgressBar } from 'primevue'

type T = Record<string, any>

export default defineComponent({
  name: 'DefaultPasswordInput',
  props: {
    label: String,
    placeholder: String,
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
      default: 'password',
    },
  },
  setup(props) {
    const internalState = props.store.getState()
    const passwordValue = ref(internalState[props.field] || '')
    const passwordRef = ref(null)
    const passwordStrength = ref('')
    const passwordLevel = ref(0)
    const isPasswordVisible = ref(false)
    const popover = ref()
    const error = ref()
    const suggestions = ref()
    const { width: passwordFieldWidth } = useElementSize(passwordRef)

    const handleValidatePassword = (value: string) => {
      const result = zxcvbn(value)

      passwordLevel.value = (result.score * 100) / 4

      const strengthLabels = ['Terrível 😭', 'Fraca 😞', 'Média 😐', 'Forte 🚀', 'Muito Forte 🔥']

      passwordStrength.value = strengthLabels[result.score]

      if (result.feedback.suggestions) {
        suggestions.value = result.feedback.suggestions
      }

      if (result.feedback.warning) {
        error.value = result.feedback.warning
      } else {
        error.value = null
      }
    }

    const handleChange = (event: Event) => {
      error.value = null

      const newValue = (event.target as HTMLInputElement).value

      popover.value.show(event)

      passwordValue.value = newValue

      handleValidatePassword(newValue)

      props.store.setFieldValue(props.field, newValue)
    }

    const togglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value
    }

    watch(error, () => {
      if (error.value) {
        props.store.addError(error.value)
      } else {
        props.store.clearErrors()
      }
    })

    return {
      passwordValue,
      handleChange,
      popover,
      passwordRef,
      passwordFieldWidth,
      passwordStrength,
      passwordLevel,
      isPasswordVisible,
      togglePasswordVisibility,
      error,
      suggestions,
    }
  },
})
</script>

<template>
  <div class="flex flex-col">
    <label>{{ label }}</label>
    <div class="password-input-wrapper" ref="passwordRef">
      <InputText
        v-model="passwordValue"
        @input="handleChange"
        :placeholder="placeholder"
        :type="isPasswordVisible ? 'text' : 'password'"
        :class="{ 'p-invalid': !!error }"
        v-bind="$attrs"
      />

      <button type="button" @click="togglePasswordVisibility" class="password-toggle">
        <span v-if="isPasswordVisible" class="flex items-center justify-center">
          <i class="pi pi-eye-slash text-gray-500" />
        </span>
        <span v-else class="flex items-center justify-center">
          <i class="pi pi-eye text-gray-500" />
        </span>
      </button>
    </div>

    <Popover ref="popover" :style="{ width: `${passwordFieldWidth}px` }">
      <ProgressBar
        style="margin: 8px 0 8px 0"
        v-if="passwordValue && passwordValue !== ''"
        :value="passwordLevel"
      />

      <div class="p-2 text-center">{{ passwordStrength }}</div>

      <div v-if="suggestions.length > 0" class="p-2 text-blue-500 text-xs">
        <div v-for="(suggestion, index) in suggestions" :key="index">{{ suggestion }}</div>
      </div>

      <div v-if="error" class="p-2 text-red-500 text-xs">{{ error }}</div>
    </Popover>
  </div>
</template>

<style scoped>
.password-input-wrapper {
  display: flex;
  align-items: center;
  position: relative;
}

.password-toggle {
  position: absolute;
  right: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  height: 100%;
  border: none;
  background: transparent;
  cursor: pointer;
}

.p-invalid {
  border-color: red;
}
</style>
