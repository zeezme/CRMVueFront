<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastsProvider from '@/common/providers/ToastsProvider.vue'
import LoadingProvider from '@/common/providers/LoadingProvider.vue'
</script>

<template>
  <div class="absolute top-0 start-0 w-screen h-screen">
    <ToastsProvider />
    <LoadingProvider />
    <main>
      <div class="flex justify-center items-center h-screen">
        <router-view />
      </div>
    </main>
  </div>
</template>
