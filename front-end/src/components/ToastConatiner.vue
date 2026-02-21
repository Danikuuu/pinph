<template>
  <div class="fixed bottom-6 right-6 z-50 flex flex-col gap-2 pointer-events-none">
    <transition-group name="toast">
      <div
        v-for="toast in toastStore.toasts"
        :key="toast.id"
        class="pointer-events-auto flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium max-w-xs"
        :style="toastStyle(toast.type)"
      >
        <span>{{ toastIcon(toast.type) }}</span>
        <span>{{ toast.message }}</span>
        <button @click="toastStore.remove(toast.id)"
          class="ml-auto bg-transparent border-0 cursor-pointer text-inherit opacity-60 hover:opacity-100">
          ✕
        </button>
      </div>
    </transition-group>
  </div>
</template>

<script setup lang="ts">
import { useToastStore } from '../stores/toast.store'
import type { Toast } from '../stores/toast.store'

const toastStore = useToastStore()

function toastStyle(type: Toast['type']) {
  const styles: Record<string, string> = {
    success: 'background: rgba(20,83,45,0.95); border: 1px solid rgba(74,222,128,0.3); color: #bbf7d0; backdrop-filter: blur(8px); box-shadow: 0 8px 24px rgba(0,0,0,0.4);',
    error:   'background: rgba(127,29,29,0.95); border: 1px solid rgba(248,113,113,0.3); color: #fecaca; backdrop-filter: blur(8px); box-shadow: 0 8px 24px rgba(0,0,0,0.4);',
    info:    'background: rgba(23,37,84,0.95);  border: 1px solid rgba(96,165,250,0.3);  color: #bfdbfe; backdrop-filter: blur(8px); box-shadow: 0 8px 24px rgba(0,0,0,0.4);',
  }
  return styles[type] || styles.info
}

function toastIcon(type: Toast['type']) {
  return { success: '✅', error: '❌', info: 'ℹ️' }[type]
}
</script>