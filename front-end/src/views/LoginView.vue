<template>
  <div class="min-h-screen flex items-center justify-center px-4 py-20">
    <div class="w-full max-w-md">
      <div class="text-center mb-8">
        <router-link to="/" class="inline-flex items-center gap-2 mb-6 no-underline">
          <div class="w-10 h-10 rounded-xl flex items-center justify-center text-xl text-white"
            style="background: #3b82f6; box-shadow: 0 4px 14px rgba(59,130,246,0.4);">📍</div>
          <span class="font-bold text-xl text-white" style="font-family:'Playfair Display',serif;">PinNote PH</span>
        </router-link>
        <h1 class="text-2xl font-bold text-white" style="font-family:'Playfair Display',serif;">Welcome back</h1>
        <p class="mt-2 text-sm" style="color: #64748b;">Sign in to continue dropping notes</p>
      </div>

      <div class="rounded-2xl p-6" style="background: #1e293b; border: 1px solid rgba(255,255,255,0.08);">
        <form @submit.prevent="handleLogin" class="space-y-4">
          <div>
            <label class="block text-xs uppercase tracking-wider mb-1.5" style="color: #94a3b8;">Email</label>
            <input v-model="form.email" type="email" required placeholder="your@email.com"
              class="w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none"
              style="background: #0f172a; border: 1px solid rgba(255,255,255,0.1);"
              @focus="(e) => (e.target as HTMLElement).style.borderColor='rgba(96,165,250,0.5)'"
              @blur="(e) => (e.target as HTMLElement).style.borderColor='rgba(255,255,255,0.1)'" />
          </div>
          <div>
            <label class="block text-xs uppercase tracking-wider mb-1.5" style="color: #94a3b8;">Password</label>
            <div class="relative">
              <input v-model="form.password" :type="showPw ? 'text' : 'password'" required placeholder="••••••••"
                class="w-full rounded-lg px-4 py-3 pr-10 text-sm text-white focus:outline-none"
                style="background: #0f172a; border: 1px solid rgba(255,255,255,0.1);"
                @focus="(e) => (e.target as HTMLElement).style.borderColor='rgba(96,165,250,0.5)'"
                @blur="(e) => (e.target as HTMLElement).style.borderColor='rgba(255,255,255,0.1)'" />
              <button type="button" @click="showPw = !showPw"
                class="absolute right-3 top-1/2 -translate-y-1/2 bg-transparent border-0 cursor-pointer text-base"
                style="color: #64748b;">
                {{ showPw ? '🙈' : '👁️' }}
              </button>
            </div>
          </div>

          <div v-if="errorMsg" class="rounded-lg p-3 text-sm"
            style="background: rgba(239,68,68,0.1); border: 1px solid rgba(239,68,68,0.2); color: #f87171;">
            {{ errorMsg }}
          </div>

          <button type="submit" :disabled="authStore.loading"
            class="w-full py-3 rounded-lg text-base font-medium text-white border-0 cursor-pointer disabled:opacity-50 transition-all hover:scale-[1.01]"
            style="background: #3b82f6;">
            {{ authStore.loading ? 'Signing in...' : 'Sign In →' }}
          </button>
        </form>

        <p class="text-center text-sm mt-5" style="color: #64748b;">
          No account yet?
          <router-link to="/register" style="color: #60a5fa; text-decoration: none;">Create one</router-link>
        </p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { useToastStore } from '../stores/toast.store'

const authStore  = useAuthStore()
const toastStore = useToastStore()
const router     = useRouter()

const form    = ref({ email: '', password: '' })
const showPw  = ref(false)
const errorMsg = ref('')

async function handleLogin() {
  errorMsg.value = ''
  try {
    await authStore.login(form.value)
    toastStore.success(`Welcome back, ${authStore.user?.username}!`)
    router.push('/map')
  } catch (e: any) {
    errorMsg.value = e.response?.data?.message ?? 'Login failed'
  }
}
</script>