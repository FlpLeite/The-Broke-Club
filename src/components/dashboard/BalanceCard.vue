<script setup lang="ts">
import { computed } from 'vue'
import type { Transaction } from '../../stores/transactions'

const props = defineProps<{
  transactions: Transaction[]
}>()

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const totalIncome = computed(() => {
  return props.transactions
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalExpenses = computed(() => {
  return props.transactions
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalInvestments = computed(() => {
  return props.transactions
    .filter(t => t.type === 'investment')
    .reduce((sum, t) => sum + t.amount, 0)
})

const availableBalance = computed(() => {
  return totalIncome.value - totalExpenses.value - totalInvestments.value
})

const totalBalance = computed(() => {
  return availableBalance.value + totalInvestments.value
})

const balanceClass = computed(() => {
  return availableBalance.value >= 0 ? 'text-success' : 'text-danger'
})
</script>

<template>
  <div class="card p-6">
    <h2 class="text-lg font-semibold text-gray-700 mb-4">Resumo do Saldo</h2>
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
      <div class="bg-green-50 p-4 rounded-lg">
        <p class="text-sm text-gray-500 mb-1">Receita Total</p>
        <p class="text-xl font-bold text-success">
          {{ formatCurrency(totalIncome) }}
        </p>
      </div>
      <div class="bg-red-50 p-4 rounded-lg">
        <p class="text-sm text-gray-500 mb-1">Despesa Total</p>
        <p class="text-xl font-bold text-danger">
          {{ formatCurrency(totalExpenses) }}
        </p>
      </div>
      <div class="bg-blue-50 p-4 rounded-lg">
        <p class="text-sm text-gray-500 mb-1">Total Investido</p>
        <p class="text-xl font-bold text-primary-600">
          {{ formatCurrency(totalInvestments) }}
        </p>
      </div>
    </div>
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="bg-gray-50 p-4 rounded-lg">
        <p class="text-sm text-gray-500 mb-1">Saldo Disponível</p>
        <p class="text-xl font-bold" :class="balanceClass">
          {{ formatCurrency(availableBalance) }}
        </p>
        <p class="text-xs text-gray-500 mt-1">Saldo após despesas e investimentos</p>
      </div>
      <div class="bg-gray-50 p-4 rounded-lg">
        <p class="text-sm text-gray-500 mb-1">Patrimônio Total</p>
        <p class="text-xl font-bold text-gray-900">
          {{ formatCurrency(totalBalance) }}
        </p>
        <p class="text-xs text-gray-500 mt-1">Saldo disponível + Investimentos</p>
      </div>
    </div>
  </div>
</template>