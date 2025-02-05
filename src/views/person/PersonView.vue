<script setup lang="ts">
import DefaultListing from '@/common/components/listing/DefaultListing.vue'
import personStore from './personStore'
</script>

<template>
  <main>
    <Card>
      <template #content>
        <DefaultListing
          :store="personStore"
          endpoint="person"
          field="personList"
          :matchKeys="['name', 'email', 'type']"
        />
      </template>
    </Card>
  </main>
</template>
