<script setup lang="ts">
defineProps<{
  title?: string
}>()
</script>

<template>
  <div class="card">
    <div v-if="title" class="border-b border-gray-200 p-4">
      <h2 class="text-lg font-semibold text-gray-700">{{ title }}</h2>
    </div>
    <div class="p-4">
      <slot></slot>
    </div>
  </div>
</template>