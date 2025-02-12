<script setup lang="ts">
import { RouterView } from 'vue-router'
import ToastsProvider from '@/common/providers/ToastsProvider.vue'
import LoadingProvider from '@/common/providers/LoadingProvider.vue'
import DefaultSidebar from '@/common/components/sidebar/DefaultSidebar.vue'
</script>

<template>
  <div class="absolute top-0 start-0 w-screen h-screen">
    <div class="fixed bg-gray-300 w-screen h-full z-[-1]" />

    <ToastsProvider />

    <LoadingProvider />

    <div class="flex flex-row">
      <div style="width: 0vw; height: 100vh">
        <DefaultSidebar />
      </div>

      <div class="p-5 sm:ps-[7vw] overflow-x-hidden" style="width: 100vw; height: 100vh">
        <div class="lg:px-20">
          <RouterView />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
.defaultMargin {
  margin-left: 70px !important;
  padding: 4vw;
}
@media (max-width: 550px) {
  .defaultMargin {
    margin-left: 0px !important;
    padding: 30px !important;
  }
}
</style>
