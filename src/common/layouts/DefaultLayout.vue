<script setup lang="ts">
import { RouterView } from 'vue-router'
import LoadingProvider from '@/common/providers/LoadingProvider.vue'
import ToastsProvider from '@/common/providers/ToastsProvider.vue'
</script>

<template>
  <div class="absolute top-0 start-0 w-screen h-screen">
    <ToastsProvider />
    <LoadingProvider />
    <main class="h-screen flex flex-row w-screen">
      <div class="flex justify-center items-center h-screen w-full md:w-screen bg-gray-300">
        <RouterView />
      </div>
    </main>
  </div>
</template>
