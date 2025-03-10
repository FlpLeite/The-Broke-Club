import { defineStore } from 'pinia'
import { ref, computed } from 'vue'

interface User {
  id: string
  name: string
  email: string
}

export const useAuthStore = defineStore('auth', () => {
  const user = ref<User | null>(null)
  const isAuthenticated = computed(() => !!user.value)

  // For demo purposes, we'll use localStorage to persist the user
  const initializeAuth = () => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      user.value = JSON.parse(storedUser)
    }
  }

  const login = (email: string, password: string) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll just simulate a successful login
    const mockUser = {
      id: '1',
      name: 'Demo User',
      email
    }
    
    user.value = mockUser
    localStorage.setItem('user', JSON.stringify(mockUser))
    return Promise.resolve(mockUser)
  }

  const signup = (name: string, email: string, password: string) => {
    // In a real app, this would be an API call
    // For demo purposes, we'll just simulate a successful signup
    const mockUser = {
      id: '1',
      name,
      email
    }
    
    user.value = mockUser
    localStorage.setItem('user', JSON.stringify(mockUser))
    return Promise.resolve(mockUser)
  }

  const logout = () => {
    user.value = null
    localStorage.removeItem('user')
  }

  // Initialize auth state from localStorage
  initializeAuth()

  return {
    user,
    isAuthenticated,
    login,
    signup,
    logout
  }
})