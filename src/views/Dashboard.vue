<script setup lang="ts">
import { onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth'
import BalanceCard from '../components/dashboard/BalanceCard.vue'
import ExpensesChart from '../components/dashboard/ExpensesChart.vue'
import SavingsProgress from '../components/dashboard/SavingsProgress.vue'
import RecentTransactions from '../components/dashboard/RecentTransactions.vue'

const router = useRouter()
const authStore = useAuthStore()

onMounted(() => {
  if (!authStore.isAuthenticated) {
    router.push('/login')
  }
})
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <h1 class="text-2xl font-bold text-gray-900 mb-6">Painel Financeiro</h1>
    
    <div class="grid grid-cols-1 gap-6 mb-6">
      <BalanceCard />
    </div>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      <ExpensesChart />
      <SavingsProgress />
    </div>

    <div class="grid grid-cols-1 gap-6">
      <RecentTransactions />
    </div>
  </div>
</template>