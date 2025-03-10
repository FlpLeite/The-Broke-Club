<script setup lang="ts">
import { computed } from 'vue'
import { Pie } from 'vue-chartjs'
import { Chart as ChartJS, ArcElement, Tooltip, Legend, Title } from 'chart.js'
import { useTransactionsStore } from '../../stores/transactions'

ChartJS.register(ArcElement, Tooltip, Legend, Title)

const transactionsStore = useTransactionsStore()

const chartData = computed(() => {
  const expensesByCategory = transactionsStore.expensesByCategory
  const labels = Object.keys(expensesByCategory)
  const data = Object.values(expensesByCategory)
  
  const backgroundColors = labels.map((_, index) => {
    const hue = (index * 137) % 360
    return `hsl(${hue}, 70%, 60%)`
  })
  
  return {
    labels,
    datasets: [
      {
        data,
        backgroundColor: backgroundColors,
        borderWidth: 1
      }
    ]
  }
})

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
      labels: {
        boxWidth: 15,
        font: {
          size: 12
        }
      }
    },
    title: {
      display: true,
      text: 'Despesas por Categoria',
      font: {
        size: 16
      }
    }
  }
}
</script>

<template>
  <div class="card p-6">
    <div class="h-80">
      <Pie 
        v-if="Object.keys(transactionsStore.expensesByCategory).length > 0"
        :data="chartData" 
        :options="chartOptions" 
      />
      <div v-else class="h-full flex items-center justify-center">
        <p class="text-gray-500">Nenhuma despesa registrada</p>
      </div>
    </div>
  </div>
</template>