import { defineStore } from 'pinia'
import { ref, computed } from 'vue'
import { authAPI } from '../services/api'
import type { User } from '../types/index'

export const useAuthStore = defineStore('auth', () => {
  const user    = ref<User | null>(null)
  const token   = ref<string | null>(localStorage.getItem('pinnote_token'))
  const loading = ref(false)

  const isLoggedIn = computed(() => !!token.value && !!user.value)

  async function init() {
    if (token.value && !user.value) {
      try {
        const res = await authAPI.getMe()
        user.value = res.data.data
      } catch {
        logout()
      }
    }
  }

  async function register(data: { username: string; email: string; password: string }) {
    loading.value = true
    try {
      const res = await authAPI.register(data)
      token.value = res.data.data.token
      user.value  = res.data.data.user
      localStorage.setItem('pinnote_token', token.value)
    } finally {
      loading.value = false
    }
  }

  async function login(data: { email: string; password: string }) {
    loading.value = true
    try {
      const res = await authAPI.login(data)
      token.value = res.data.data.token
      user.value  = res.data.data.user
      localStorage.setItem('pinnote_token', token.value)
    } finally {
      loading.value = false
    }
  }

  function logout() {
    token.value = null
    user.value  = null
    localStorage.removeItem('pinnote_token')
  }

  return { user, token, loading, isLoggedIn, init, register, login, logout }
})