import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

export interface Transaction {
  id: string
  date: string
  description: string
  category: string
  amount: number
  type: 'income' | 'expense'
}

export const useTransactionsStore = defineStore('transactions', () => {
  const transactions = ref<Transaction[]>([
    {
      id: '1',
      date: '2025-01-15',
      description: 'Salário',
      category: 'Receita',
      amount: 3000,
      type: 'income'
    },
    {
      id: '2',
      date: '2025-01-16',
      description: 'Aluguel',
      category: 'Moradia',
      amount: 1200,
      type: 'expense'
    },
    {
      id: '3',
      date: '2025-01-18',
      description: 'Supermercado',
      category: 'Alimentação',
      amount: 150,
      type: 'expense'
    },
    {
      id: '4',
      date: '2025-01-20',
      description: 'Freelance',
      category: 'Receita',
      amount: 500,
      type: 'income'
    },
    {
      id: '5',
      date: '2025-01-22',
      description: 'Restaurante',
      category: 'Alimentação',
      amount: 75,
      type: 'expense'
    }
  ])

  const categories = [
    'Receita',
    'Moradia',
    'Alimentação',
    'Transporte',
    'Lazer',
    'Utilidades',
    'Saúde',
    'Educação',
    'Compras',
    'Pessoal',
    'Investimentos',
    'Outros'
  ]

  const addTransaction = (transaction: Omit<Transaction, 'id'>) => {
    const newTransaction = {
      ...transaction,
      id: Date.now().toString()
    }
    transactions.value.push(newTransaction)
  }

  const updateTransaction = (id: string, updatedTransaction: Omit<Transaction, 'id'>) => {
    const index = transactions.value.findIndex(t => t.id === id)
    if (index !== -1) {
      transactions.value[index] = { ...updatedTransaction, id }
    }
  }

  const deleteTransaction = (id: string) => {
    transactions.value = transactions.value.filter(t => t.id !== id)
  }

  const totalIncome = computed(() => {
    return transactions.value
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const totalExpenses = computed(() => {
    return transactions.value
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0)
  })

  const balance = computed(() => {
    return totalIncome.value - totalExpenses.value
  })

  const expensesByCategory = computed(() => {
    const result: Record<string, number> = {}
    
    transactions.value
      .filter(t => t.type === 'expense')
      .forEach(t => {
        if (!result[t.category]) {
          result[t.category] = 0
        }
        result[t.category] += t.amount
      })
      
    return result
  })

  return {
    transactions,
    categories,
    addTransaction,
    updateTransaction,
    deleteTransaction,
    totalIncome,
    totalExpenses,
    balance,
    expensesByCategory
  }
})