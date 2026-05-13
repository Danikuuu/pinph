<template>
  <header
    class="navbar fixed top-0 left-0 right-0 z-50 border-b border-white/5 bg-slate-900/90 backdrop-blur-md"
  >
    <div class="mx-auto flex h-14 max-w-7xl items-center gap-3 px-4 sm:px-5">
      <!-- Brand -->
      <router-link
        to="/"
        class="group flex min-w-0 shrink-0 items-center gap-2.5 no-underline"
        @click="closeMenu"
      >
        <div
          class="flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-blue-500 text-sm font-bold text-white shadow-lg shadow-blue-500/25 transition-transform group-hover:scale-105"
        >
          📍
        </div>
        <span
          class="truncate font-bold tracking-tight text-white"
          style="font-family: var(--font-display), serif"
        >
          PinNote
          <span class="text-[var(--color-phyellow)]">PH</span>
        </span>
      </router-link>

      <!-- Desktop navigation -->
      <nav
        class="ml-auto hidden min-w-0 items-center gap-3 md:flex"
        aria-label="Main"
      >
        <div
          class="flex items-center rounded-xl border border-white/5 bg-white/[0.04] p-1"
        >
          <router-link
            v-for="item in primaryLinks"
            :key="item.to"
            :to="item.to"
            class="rounded-lg px-3 py-2 text-sm font-medium text-slate-400 no-underline transition-colors hover:bg-white/5 hover:text-slate-200"
            active-class="bg-white/10 text-white"
          >
            {{ item.label }}
          </router-link>
        </div>

        <template v-if="authStore.isLoggedIn">
          <div class="flex h-8 w-px shrink-0 bg-white/10" aria-hidden="true" />

          <router-link
            to="/profile"
            class="flex max-w-[200px] items-center gap-2 rounded-xl border border-white/5 bg-white/[0.04] py-1.5 pl-1.5 pr-3 no-underline transition-colors hover:border-white/10 hover:bg-white/[0.07]"
            active-class="!border-blue-500/30 !bg-blue-500/10"
          >
            <span
              class="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-xs font-bold text-white"
            >
              {{ authStore.user?.username?.[0]?.toUpperCase() ?? '?' }}
            </span>
            <span class="truncate text-sm font-medium text-slate-200">
              {{ authStore.user?.username }}
            </span>
          </router-link>

          <button
            type="button"
            class="shrink-0 rounded-xl px-3 py-2 text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10 hover:text-red-300"
            @click="handleLogout"
          >
            Log out
          </button>
        </template>

        <template v-else>
          <div class="flex h-8 w-px shrink-0 bg-white/10" aria-hidden="true" />

          <router-link
            to="/login"
            class="rounded-xl px-3 py-2 text-sm font-medium text-slate-300 no-underline transition-colors hover:bg-white/5 hover:text-white"
            active-class="!text-white !bg-white/10"
          >
            Log in
          </router-link>
          <router-link
            to="/register"
            class="rounded-xl bg-blue-500 px-4 py-2 text-sm font-semibold text-white no-underline shadow-lg shadow-blue-500/20 transition-transform hover:scale-[1.02] active:scale-[0.98]"
          >
            Sign up
          </router-link>
        </template>
      </nav>

      <!-- Mobile menu toggle -->
      <button
        type="button"
        class="ml-auto flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-white/10 bg-slate-800/80 text-slate-200 md:hidden"
        :aria-expanded="menuOpen"
        aria-controls="mobile-nav"
        :aria-label="menuOpen ? 'Close menu' : 'Open menu'"
        @click="menuOpen = !menuOpen"
      >
        <svg
          v-if="!menuOpen"
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M4 6h16M4 12h16M4 18h16"
          />
        </svg>
        <svg
          v-else
          class="h-5 w-5"
          fill="none"
          stroke="currentColor"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M6 18L18 6M6 6l12 12"
          />
        </svg>
      </button>
    </div>

    <!-- Mobile panel -->
    <transition name="mobile-nav">
      <div v-if="menuOpen" class="fixed inset-0 top-14 z-40 md:hidden">
        <button
          type="button"
          class="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
          aria-label="Close menu"
          @click="closeMenu"
        />
        <nav
          id="mobile-nav"
          class="relative mx-3 mt-2 overflow-hidden rounded-2xl border border-white/10 bg-slate-900/95 p-2 shadow-2xl shadow-black/40"
          aria-label="Mobile main"
        >
          <router-link
            v-for="item in primaryLinks"
            :key="item.to"
            :to="item.to"
            class="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-200 no-underline transition-colors hover:bg-white/5"
            active-class="bg-white/10 text-white"
            @click="closeMenu"
          >
            {{ item.label }}
          </router-link>

          <template v-if="authStore.isLoggedIn">
            <div class="my-2 h-px bg-white/10" />

            <router-link
              to="/profile"
              class="flex w-full items-center gap-3 rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-200 no-underline transition-colors hover:bg-white/5"
              active-class="bg-white/10 text-white"
              @click="closeMenu"
            >
              <span
                class="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-blue-500 text-xs font-bold text-white"
              >
                {{ authStore.user?.username?.[0]?.toUpperCase() ?? '?' }}
              </span>
              <span class="min-w-0 truncate font-medium">{{ authStore.user?.username }}</span>
            </router-link>

            <button
              type="button"
              class="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-red-400 transition-colors hover:bg-red-500/10"
              @click="handleLogout"
            >
              Log out
            </button>
          </template>

          <template v-else>
            <div class="my-2 h-px bg-white/10" />

            <router-link
              to="/login"
              class="block w-full rounded-xl px-4 py-3 text-left text-sm font-medium text-slate-200 no-underline transition-colors hover:bg-white/5"
              @click="closeMenu"
            >
              Log in
            </router-link>
            <router-link
              to="/register"
              class="mt-1 block w-full rounded-xl bg-blue-500 px-4 py-3 text-center text-sm font-semibold text-white no-underline shadow-lg shadow-blue-500/25"
              @click="closeMenu"
            >
              Sign up
            </router-link>
          </template>
        </nav>
      </div>
    </transition>
  </header>
</template>

<script setup lang="ts">
import { ref, watch, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../stores/auth.store'
import { useToastStore } from '../stores/toast.store'

const authStore = useAuthStore()
const toastStore = useToastStore()
const router = useRouter()
const route = useRoute()
const menuOpen = ref(false)

const primaryLinks = computed(() => {
  const links: { to: string; label: string }[] = [{ to: '/map', label: 'Map' }]
  if (authStore.isLoggedIn) links.push({ to: '/saved', label: 'Saved' })
  return links
})

function closeMenu() {
  menuOpen.value = false
}

function handleLogout() {
  closeMenu()
  authStore.logout()
  toastStore.success('Logged out successfully')
  router.push('/')
}

watch(
  () => route.fullPath,
  () => closeMenu(),
)
</script>

<style scoped>
.mobile-nav-enter-active,
.mobile-nav-leave-active {
  transition:
    opacity 0.2s ease,
    transform 0.2s ease;
}
.mobile-nav-enter-from,
.mobile-nav-leave-to {
  opacity: 0;
}
.mobile-nav-enter-from nav,
.mobile-nav-leave-to nav {
  transform: translateY(-8px);
}
</style>
