<script lang="ts">
import { defineComponent } from 'vue'
import { globalStore } from '../config/globalStore'

export default defineComponent({
  name: 'LoadingProvider',
  setup() {
    const { loading } = globalStore.getState()

    return {
      loading,
    }
  },
})
</script>

<template>
  <TransitionGroup name="backdrop" tag="div" class="flex items-center justify-center">
    <div
      v-if="loading"
      style="
        position: absolute;
        top: 0px;
        right: 0px;
        z-index: 2050;
        width: 100vw;
        height: 100vh;
        background-color: rgba(0, 0, 0, 0.8);
      "
      class="flex items-center justify-center"
    >
      <ProgressSpinner
        class="flex items-center justify-center"
        strokeWidth="2"
        style="width: 250px; height: 250px"
        animationDuration="1s"
      />
    </div>
  </TransitionGroup>
</template>

<style scoped>
.backdrop-move,
.backdrop-enter-active,
.backdrop-leave-active {
  transition: opacity 0.4s ease;
}

.backdrop-enter-from,
.backdrop-leave-to {
  opacity: 0;
}

.backdrop-enter-to,
.backdrop-leave-from {
  opacity: 1;
}
</style>
