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
      <div class="fixed bg-gray-300 w-screen h-screen z-[-1]"></div>

      <div class="flex justify-center items-center h-screen w-full p-15 defaultMargin">
        <RouterView />
      </div>
    </main>
  </div>
</template>

<style scoped>
.defaultMargin {
  margin-left: 70px !important;
}
@media (max-width: 550px) {
  .defaultMargin {
    margin-left: 0px !important;
  }
}
</style>
