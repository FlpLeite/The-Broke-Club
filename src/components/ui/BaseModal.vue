<script setup lang="ts">
defineProps<{
  show: boolean
  title?: string
}>()

defineEmits<{
  (e: 'close'): void
}>()
</script>

<template>
  <Transition name="modal">
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="$emit('close')">
      <div class="flex min-h-screen items-center justify-center p-4">
        <div class="fixed inset-0 bg-black bg-opacity-50 transition-opacity"></div>
        
        <div class="relative bg-white rounded-lg shadow-xl max-w-lg w-full mx-4 transform transition-all">
          <div class="border-b border-gray-200 px-6 py-4">
            <h3 class="text-lg font-medium text-gray-900">{{ title }}</h3>
            <button
              class="absolute top-4 right-4 text-gray-400 hover:text-gray-500"
              @click="$emit('close')"
            >
              <span class="sr-only">Fechar</span>
              <svg class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="px-6 py-4">
            <slot></slot>
          </div>
          
          <div v-if="$slots.footer" class="border-t border-gray-200 px-6 py-4">
            <slot name="footer"></slot>
          </div>
        </div>
      </div>
    </div>
  </Transition>
</template>