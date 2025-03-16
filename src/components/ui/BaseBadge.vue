<script setup lang="ts">
defineProps<{
  variant: 'success' | 'danger'
}>()
</script>

<template>
  <span :class="['badge', `badge-${variant}`]">
    <slot></slot>
  </span>
</template>