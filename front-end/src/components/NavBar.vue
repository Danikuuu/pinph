<template>
  <nav class="fixed top-0 left-0 right-0 z-50"
    style="background: rgba(15,23,42,0.85); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05);">
    <div class="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between gap-3">
      <router-link to="/" class="flex items-center gap-2 group no-underline" @click="closeMenu">
        <div class="w-8 h-8 rounded-lg flex items-center justify-center text-white font-bold text-sm shadow-lg transition-transform group-hover:scale-110"
          style="background: #3b82f6; box-shadow: 0 4px 14px rgba(59,130,246,0.4);">
          📍
        </div>
        <span class="font-bold text-white" style="font-family: 'Playfair Display', serif;">
          PinNote <span style="color: #fcd116;">PH</span>
        </span>
      </router-link>

      <div class="hidden md:flex items-center gap-1">
        <router-link to="/map" class="nav-link">🗺️ Map</router-link>
        <template v-if="authStore.isLoggedIn">
          <router-link to="/saved" class="nav-link">🔖 Saved</router-link>
          <router-link to="/profile" class="nav-link">
            <div class="w-5 h-5 rounded-full flex items-center justify-center text-xs font-bold text-white mr-1"
              style="background: #3b82f6;">
              {{ authStore.user?.username?.[0]?.toUpperCase() }}
            </div>
            {{ authStore.user?.username }}
          </router-link>
          <button @click="handleLogout"
            class="px-3 py-1.5 rounded-lg text-sm font-medium transition-colors cursor-pointer border-0 bg-transparent"
            style="color: #f87171;"
            @mouseover="(e) => (e.target as HTMLElement).style.color='#fca5a5'"
            @mouseleave="(e) => (e.target as HTMLElement).style.color='#f87171'">
            Logout
          </button>
        </template>
        <template v-else>
          <router-link to="/login" class="nav-link">Login</router-link>
          <router-link to="/register"
            class="px-4 py-1.5 rounded-lg text-sm font-medium text-white no-underline transition-all hover:scale-105"
            style="background: #3b82f6;">
            Sign Up
          </router-link>
        </template>
      </div>

      <button class="md:hidden mobile-menu-btn" @click="menuOpen = !menuOpen"
        :aria-expanded="menuOpen" aria-label="Toggle navigation menu">
        {{ menuOpen ? '✕' : '☰' }}
      </button>
    </div>

    <transition name="fade">
      <div v-if="menuOpen" class="md:hidden mobile-menu-panel">
        <div class="mobile-menu-inner">
          <router-link to="/map" class="mobile-link" @click="closeMenu">🗺️ Map</router-link>
          <template v-if="authStore.isLoggedIn">
            <router-link to="/saved" class="mobile-link" @click="closeMenu">🔖 Saved</router-link>
            <router-link to="/profile" class="mobile-link" @click="closeMenu">👤 {{ authStore.user?.username }}</router-link>
            <button @click="handleLogout" class="mobile-link logout-btn">Logout</button>
          </template>
          <template v-else>
            <router-link to="/login" class="mobile-link" @click="closeMenu">Login</router-link>
            <router-link to="/register" class="mobile-signup" @click="closeMenu">Sign Up</router-link>
          </template>
        </div>
      </div>
    </transition>
  </nav>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import { useAuthStore } from '../stores/auth.store'
import { useToastStore } from '../stores/toast.store'
import { useRouter } from 'vue-router'

const authStore  = useAuthStore()
const toastStore = useToastStore()
const router     = useRouter()
const menuOpen   = ref(false)

function closeMenu() {
  menuOpen.value = false
}

function handleLogout() {
  closeMenu()
  authStore.logout()
  toastStore.success('Logged out successfully')
  router.push('/')
}
</script>

<style scoped>
.nav-link {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  font-size: 14px;
  color: #cbd5e1;
  text-decoration: none;
  border-radius: 8px;
  transition: all 0.15s;
}
.nav-link:hover { color: white; background: rgba(255,255,255,0.06); }
.router-link-active.nav-link { color: white; background: rgba(255,255,255,0.08); }

.mobile-menu-btn {
  border: 1px solid rgba(255,255,255,0.1);
  background: rgba(30,41,59,0.9);
  color: #cbd5e1;
  border-radius: 8px;
  width: 34px;
  height: 34px;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
}

.mobile-menu-panel {
  border-top: 1px solid rgba(255,255,255,0.05);
  background: rgba(15,23,42,0.98);
}

.mobile-menu-inner {
  max-width: 28rem;
  margin: 0 auto;
  padding: 12px 16px 14px;
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.mobile-link {
  text-decoration: none;
  color: #cbd5e1;
  background: rgba(255,255,255,0.03);
  border: 1px solid rgba(255,255,255,0.06);
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  text-align: left;
}

.mobile-signup {
  text-decoration: none;
  color: white;
  background: #3b82f6;
  border-radius: 10px;
  padding: 10px 12px;
  font-size: 14px;
  text-align: center;
  font-weight: 600;
}

.logout-btn {
  cursor: pointer;
  color: #f87171;
}
</style>