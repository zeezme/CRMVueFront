<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastsProvider from '@/common/providers/ToastsProvider.vue'
import LoadingProvider from '@/common/providers/LoadingProvider.vue'
</script>

<template>
  <div class="absolute top-0 start-0 w-screen h-screen">
    <div class="fixed bg-gray-300 w-screen h-full z-[-1]" />

    <ToastsProvider />

    <LoadingProvider />

    <div class="flex flex-row">
      <div class="p-5 overflow-x-hidden" style="width: 100vw; height: 100vh">
        <div class="lg:px-20">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped></style>
