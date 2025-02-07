<script lang="ts">
import { watch, onBeforeUnmount, defineComponent } from 'vue'
import { globalStore, type IToast } from '../config/globalStore'
import toast from '../helpers/toast'

export default defineComponent({
  name: 'ToastsProvider',
  setup() {
    const toastTimers: any[] = []

    const { toasts } = globalStore.getState()

    const removeToast = (id: string) => {
      toast.remove(id)
    }

    onBeforeUnmount(() => {
      toastTimers.forEach(clearTimeout)
    })

    watch(
      toasts,
      (newToasts) => {
        if (newToasts) {
          newToasts.forEach((toast: IToast) => {
            const timer = setTimeout(() => {
              removeToast(toast.id)
            }, 4000)

            toastTimers.push(timer)
          })
        }
      },
      { immediate: true },
    )

    return {
      toasts,
      removeToast,
    }
  },
})
</script>

<template>
  <div style="position: fixed; top: 10px; right: 10px; z-index: 90000; width: 300px">
    <TransitionGroup name="list" tag="div" class="flex flex-col gap-2">
      <div
        v-for="toast in toasts"
        :key="toast.id"
        class="rounded-sm shadow-sm p-2 cursor-pointer h-auto"
        :class="{
          'bg-green-500': toast.type === 'success',
          'bg-red-500': toast.type === 'error',
          'text-white': true,
          'hover:bg-green-700': toast.type === 'success',
          'hover:bg-red-700': toast.type === 'error',
        }"
        style="min-width: 280px"
        @click="removeToast(toast.id)"
      >
        <p class="text-sm text-center">{{ toast.message }}</p>
      </div>
    </TransitionGroup>
  </div>
</template>

<style scoped>
.list-move,
.list-enter-active,
.list-leave-active {
  transition:
    opacity 0.4s ease,
    transform 0.4s ease;
}

.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(30px);
}

.list-leave-active {
  position: absolute;
}
</style>
