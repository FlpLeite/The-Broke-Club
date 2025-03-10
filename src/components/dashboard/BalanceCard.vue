<script setup lang="ts">
import { computed } from 'vue'
import { useTransactionsStore } from '../../stores/transactions'

const transactionsStore = useTransactionsStore()

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const balanceClass = computed(() => {
  return transactionsStore.balance >= 0 ? 'text-success' : 'text-danger'
})
</script>

<template>
  <div class="card p-6">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">Resumo do Saldo</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="bg-green-50 p-4 rounded-lg">
        <p class="text-sm text-gray-500 mb-1">Receita Total</p>
        <p class="text-xl font-bold text-success">
          {{ formatCurrency(transactionsStore.totalIncome) }}
        </p>
      </div>
      <div class="bg-red-50 p-4 rounded-lg">
        <p class="text-sm text-gray-500 mb-1">Despesa Total</p>
        <p class="text-xl font-bold text-danger">
          {{ formatCurrency(transactionsStore.totalExpenses) }}
        </p>
      </div>
      <div class="bg-blue-50 p-4 rounded-lg">
        <p class="text-sm text-gray-500 mb-1">Saldo Atual</p>
        <p class="text-xl font-bold" :class="balanceClass">
          {{ formatCurrency(transactionsStore.balance) }}
        </p>
      </div>
    </div>
  </div>
</template>