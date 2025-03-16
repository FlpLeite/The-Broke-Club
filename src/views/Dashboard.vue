<script setup lang="ts">
import { ref, computed, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import { useTransactionsStore } from '../stores/transactions'
import BalanceCard from '../components/dashboard/BalanceCard.vue'
import ExpensesChart from '../components/dashboard/ExpensesChart.vue'
import SavingsProgress from '../components/dashboard/SavingsProgress.vue'
import RecentTransactions from '../components/dashboard/RecentTransactions.vue'

const router = useRouter()
const authStore = useAuthStore()
const transactionsStore = useTransactionsStore()

const dateFrom = ref('')
const dateTo = ref('')

const filteredTransactions = computed(() => {
  return transactionsStore.transactions.filter(transaction => {
    let matchesDateRange = true
    if (dateFrom.value) {
      matchesDateRange = matchesDateRange && transaction.date >= dateFrom.value
    }
    if (dateTo.value) {
      matchesDateRange = matchesDateRange && transaction.date <= dateTo.value
    }
    return matchesDateRange
  })
})

const resetFilters = () => {
  dateFrom.value = ''
  dateTo.value = ''
}

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900">Painel Financeiro</h1>
      
      <div class="mt-4 md:mt-0 flex flex-wrap gap-4 items-center">
        <div class="flex gap-4">
          <div>
            <label for="dateFrom" class="block text-sm font-medium text-gray-700">De</label>
            <input
              type="date"
              id="dateFrom"
              v-model="dateFrom"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
          <div>
            <label for="dateTo" class="block text-sm font-medium text-gray-700">Até</label>
            <input
              type="date"
              id="dateTo"
              v-model="dateTo"
              class="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-primary-500 focus:ring-primary-500 sm:text-sm"
            />
          </div>
        </div>
        <button 
          @click="resetFilters"
          class="self-end btn btn-secondary"
        >
          Limpar Filtros
        </button>
      </div>
    </div>
    
    <div class="grid grid-cols-1 gap-6 mb-6">
      <BalanceCard :transactions="filteredTransactions" />
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <ExpensesChart :transactions="filteredTransactions" />
      <SavingsProgress :transactions="filteredTransactions" />
    </div>

    <div class="grid grid-cols-1 gap-6">
      <RecentTransactions :transactions="filteredTransactions" />
    </div>
  </div>
</template>