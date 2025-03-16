<script setup lang="ts">
import { ref, computed } from 'vue'
import { useTransactionsStore } from '../stores/transactions'
import jsPDF from 'jspdf'
import 'jspdf-autotable'
import Papa from 'papaparse'

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
  }).sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
})

const formatCurrency = (value: number) => {
  return new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL'
  }).format(value)
}

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString('pt-BR', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  })
}

const totalIncome = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'income')
    .reduce((sum, t) => sum + t.amount, 0)
})

const totalExpenses = computed(() => {
  return filteredTransactions.value
    .filter(t => t.type === 'expense')
    .reduce((sum, t) => sum + t.amount, 0)
})

const balance = computed(() => {
  return totalIncome.value - totalExpenses.value
})

const exportPDF = () => {
  const doc = new jsPDF()
  
  // Título
  doc.setFontSize(20)
  doc.text('Relatório Financeiro', 14, 20)
  
  // Período
  doc.setFontSize(12)
  const period = `Período: ${dateFrom.value ? formatDate(dateFrom.value) : 'Início'} até ${dateTo.value ? formatDate(dateTo.value) : 'Hoje'}`
  doc.text(period, 14, 30)
  
  // Resumo
  doc.text('Resumo:', 14, 40)
  doc.text(`Receitas: ${formatCurrency(totalIncome.value)}`, 14, 48)
  doc.text(`Despesas: ${formatCurrency(totalExpenses.value)}`, 14, 56)
  doc.text(`Saldo: ${formatCurrency(balance.value)}`, 14, 64)
  
  // Tabela de transações
  const tableData = filteredTransactions.value.map(t => [
    formatDate(t.date),
    t.description,
    t.category,
    t.type === 'income' ? 'Receita' : 'Despesa',
    formatCurrency(t.amount)
  ])
  
  doc.autoTable({
    startY: 75,
    head: [['Data', 'Descrição', 'Categoria', 'Tipo', 'Valor']],
    body: tableData,
    theme: 'striped',
    headStyles: { fillColor: [2, 132, 199] }
  })
  
  doc.save('relatorio-financeiro.pdf')
}

const exportCSV = () => {
  const data = filteredTransactions.value.map(t => ({
    Data: formatDate(t.date),
    Descrição: t.description,
    Categoria: t.category,
    Tipo: t.type === 'income' ? 'Receita' : 'Despesa',
    Valor: formatCurrency(t.amount)
  }))
  
  const csv = Papa.unparse(data)
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
  const link = document.createElement('a')
  const url = URL.createObjectURL(blob)
  
  link.setAttribute('href', url)
  link.setAttribute('download', 'relatorio-financeiro.csv')
  link.style.visibility = 'hidden'
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
}

const resetFilters = () => {
  dateFrom.value = ''
  dateTo.value = ''
}
</script>

<template>
  <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
    <div class="flex flex-col md:flex-row md:items-center md:justify-between mb-6">
      <h1 class="text-2xl font-bold text-gray-900 mb-4 md:mb-0">Relatórios</h1>
      
      <div class="flex flex-wrap gap-4">
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
        
        <div class="flex gap-2 self-end">
          <button @click="resetFilters" class="btn btn-secondary">
            Limpar Filtros
          </button>
          <button @click="exportPDF" class="btn btn-primary">
            Exportar PDF
          </button>
          <button @click="exportCSV" class="btn btn-primary">
            Exportar CSV
          </button>
        </div>
      </div>
    </div>

    <!-- Resumo -->
    <div class="bg-white rounded-lg shadow-md p-6 mb-6">
      <h2 class="text-lg font-semibold text-gray-700 mb-4">Resumo do Período</h2>
      <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
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
          <p class="text-sm text-gray-500 mb-1">Saldo</p>
          <p class="text-xl font-bold" :class="balance >= 0 ? 'text-success' : 'text-danger'">
            {{ formatCurrency(balance) }}
          </p>
        </div>
      </div>
    </div>

    <!-- Tabela de Transações -->
    <div class="bg-white rounded-lg shadow-md overflow-hidden">
      <div class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200">
          <thead class="bg-gray-50">
            <tr>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Data
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Descrição
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Categoria
              </th>
              <th scope="col" class="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Tipo
              </th>
              <th scope="col" class="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                Valor
              </th>
            </tr>
          </thead>
          <tbody class="bg-white divide-y divide-gray-200">
            <tr v-for="transaction in filteredTransactions" :key="transaction.id">
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ formatDate(transaction.date) }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
                {{ transaction.description }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                {{ transaction.category }}
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <span 
                  class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                  :class="transaction.type === 'income' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'"
                >
                  {{ transaction.type === 'income' ? 'Receita' : 'Despesa' }}
                </span>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm text-right font-medium" 
                  :class="transaction.type === 'income' ? 'text-success' : 'text-danger'">
                {{ formatCurrency(transaction.amount) }}
              </td>
            </tr>
            <tr v-if="filteredTransactions.length === 0">
              <td colspan="5" class="px-6 py-4 text-center text-sm text-gray-500">
                Nenhuma transação encontrada
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  </div>
</template>