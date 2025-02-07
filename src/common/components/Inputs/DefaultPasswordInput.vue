<script lang="ts">
import type { StateManager } from '@/common/helpers/stateManager'
import { defineComponent, ref, toRef, watch, type PropType } from 'vue'
import { useElementSize } from '@vueuse/core'
import { zxcvbn } from '@zxcvbn-ts/core'
import { computed } from 'vue'

type T = Record<string, any>

interface IPasswordInputProps {
  label?: string
  placeholder?: string
  field: keyof T
  store: StateManager<T>
  required?: boolean
  error?: Partial<Record<keyof T, string>>
  enableStrengthMeter?: boolean
}

export default defineComponent({
  name: 'DefaultPasswordInput',
  props: {
    label: {
      type: String,
      required: false,
    },
    placeholder: {
      type: String,
      required: false,
    },
    required: {
      type: Boolean,
      default: false,
    },
    field: {
      type: String as PropType<keyof T>,
      required: true,
    },
    store: {
      type: Object as PropType<StateManager<T>>,
      required: true,
    },
    error: {
      type: Object as PropType<Partial<Record<keyof T, string>>>,
      required: false,
    },
    enableStrengthMeter: {
      type: Boolean,
      default: false,
      required: false,
    },
  },
  setup(props: IPasswordInputProps) {
    const { field, store, label, required, enableStrengthMeter } = props

    const errorRef = computed(() => props.error && props.error[field])

    const internalState = store.getState()

    const internalPasswordValue = ref(internalState[field] || '')

    const internalPasswordRef = ref(null)

    const internalPasswordStrength = ref('')

    const internalPasswordLevel = ref(0)

    const isPasswordVisible = ref(false)

    const internalPopoverRef = ref()

    const internalError = ref()

    const internalOutsideError = ref()

    const internalLabel = label

    const internalSuggestions = ref()

    const { width: internalPasswordFieldWidth } = useElementSize(internalPasswordRef)

    const handleValidatePassword = (value: string) => {
      if (required === true && value === '') {
        internalError.value = 'A senha é obrigatória.'

        internalOutsideError.value = 'A senha é obrigatória.'

        return
      }

      if (enableStrengthMeter) {
        const result = zxcvbn(value)

        internalPasswordLevel.value = (result.score * 100) / 4

        const strengthLabels = ['Terrível 😭', 'Fraca 😞', 'Média 😐', 'Forte 🚀', 'Muito Forte 🔥']

        internalPasswordStrength.value = strengthLabels[result.score]

        if (result.feedback.suggestions) {
          internalSuggestions.value = result.feedback.suggestions
        }

        if (result.feedback.warning) {
          internalError.value = result.feedback.warning
          internalOutsideError.value = 'Senha inválida. '
        } else {
          internalError.value = null
          internalOutsideError.value = null
        }
      }
    }

    const handleChange = (event: Event) => {
      internalError.value = null

      internalOutsideError.value = null

      const newValue = (event.target as HTMLInputElement).value

      store.setFieldValue(field, newValue)

      if (enableStrengthMeter) {
        internalPopoverRef.value.show(event)
      }

      internalPasswordValue.value = newValue

      handleValidatePassword(newValue)
    }

    const handleTogglePasswordVisibility = () => {
      isPasswordVisible.value = !isPasswordVisible.value
    }

    watch(
      errorRef,
      (newError) => {
        if (newError) {
          internalOutsideError.value = newError
          internalError.value = newError
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
      internalPasswordValue,
      handleChange,
      internalPopoverRef,
      internalPasswordRef,
      internalPasswordFieldWidth,
      internalPasswordStrength,
      internalPasswordLevel,
      internalSuggestions,
      internalLabel,
      internalError,
      internalOutsideError,
      isPasswordVisible,
      handleTogglePasswordVisibility,
      handleValidatePassword,
    }
  },
})
</script>

<template>
  <div class="flex flex-col">
    <label>{{ label }}</label>
    <div class="password-input-wrapper" ref="internalPasswordRef">
      <InputText
        v-model="internalPasswordValue"
        :value="internalPasswordValue"
        @input="handleChange"
        :placeholder="placeholder"
        :type="isPasswordVisible ? 'text' : 'password'"
        :class="[{ 'p-invalid': !!internalError }, 'w-full']"
        v-on:blur="handleValidatePassword(internalPasswordValue)"
        v-bind="$attrs"
      />

      <button type="button" @click="handleTogglePasswordVisibility" class="password-toggle">
        <span v-if="isPasswordVisible" class="flex items-center justify-center">
          <i class="pi pi-eye-slash text-gray-500" />
        </span>
        <span v-else class="flex items-center justify-center">
          <i class="pi pi-eye text-gray-500" />
        </span>
      </button>
    </div>

    <span v-if="internalError" class="text-red-500 text-xs !mt-1">{{ internalOutsideError }}</span>

    <Popover
      ref="internalPopoverRef"
      v-if="enableStrengthMeter"
      :style="{ width: `${internalPasswordFieldWidth}px` }"
    >
      <ProgressBar
        style="margin: 8px 0 8px 0"
        v-if="internalPasswordValue && internalPasswordValue !== ''"
        :value="internalPasswordLevel"
      />

      <div class="p-2 text-center">{{ internalPasswordStrength }}</div>

      <div v-if="internalSuggestions.length > 0" class="p-2 text-blue-500 text-xs">
        <div v-for="(suggestion, index) in internalSuggestions" :key="index">{{ suggestion }}</div>
      </div>

      <div v-if="internalError" class="p-2 text-red-500 text-xs">{{ internalError }}</div>
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
