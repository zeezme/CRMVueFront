<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastsProvider from '@/common/providers/ToastsProvider.vue'
import LoadingProvider from '@/common/providers/LoadingProvider.vue'
import DefaultSidebar from '@/common/components/sidebar/DefaultSidebar.vue'
</script>

<template>
  <div class="absolute top-0 start-0 w-screen h-screen">
    <ToastsProvider />
    <LoadingProvider />
    <main class="h-screen flex flex-row w-screen">
      <DefaultSidebar />
      <div
        class="flex justify-center items-center h-screen w-full md:w-screen bg-gray-300 defaultContent"
      >
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.defaultContent {
  z-index: 1;
  margin-left: -20px;
  width: calc(100% + 20px);
}
</style>
