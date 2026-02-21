<template>
  <teleport to="body">
    <div class="fixed inset-0 z-[9999] flex items-center justify-center p-4">

      <!-- Backdrop -->
      <div
        class="absolute inset-0 z-[9998]"
        style="background: rgba(0,0,0,0.6); backdrop-filter: blur(4px);"
        @click="$emit('close')"
      />

      <!-- Modal -->
      <div
        class="relative w-full max-w-lg rounded-2xl shadow-2xl z-[10000]"
        style="background: #1e293b; border: 1px solid rgba(255,255,255,0.1); animation: slideUp 0.3s ease;"
      >
        <!-- Header -->
        <div class="flex items-center justify-between p-5" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
          <h2 class="font-bold text-white text-lg" style="font-family: 'Playfair Display', serif;">📍 Drop a Note</h2>
          <button @click="$emit('close')"
            class="w-8 h-8 flex items-center justify-center rounded-lg border-0 cursor-pointer text-sm"
            style="background: rgba(255,255,255,0.05); color: #94a3b8;"
            @mouseover="(e) => (e.currentTarget as HTMLElement).style.color='white'"
            @mouseleave="(e) => (e.currentTarget as HTMLElement).style.color='#94a3b8'"
          >✕</button>
        </div>

        <!-- Form -->
        <form @submit.prevent="handleSubmit" class="p-5 space-y-4">
          <!-- Title -->
          <div>
            <label class="block text-xs uppercase tracking-wider mb-1.5" style="color: #94a3b8;">Title *</label>
            <input v-model="form.title" type="text" placeholder="What's here?" required maxlength="100"
              class="w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none"
              style="background: #0f172a; border: 1px solid rgba(255,255,255,0.1);"
              @focus="(e) => (e.target as HTMLElement).style.borderColor='rgba(96,165,250,0.5)'"
              @blur="(e) => (e.target as HTMLElement).style.borderColor='rgba(255,255,255,0.1)'" />
          </div>

          <!-- Body -->
          <div>
            <label class="block text-xs uppercase tracking-wider mb-1.5" style="color: #94a3b8;">Note *</label>
            <textarea v-model="form.body" placeholder="Write your note here..." required maxlength="2000" rows="4"
              class="w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none resize-none"
              style="background: #0f172a; border: 1px solid rgba(255,255,255,0.1);"
              @focus="(e) => (e.target as HTMLElement).style.borderColor='rgba(96,165,250,0.5)'"
              @blur="(e) => (e.target as HTMLElement).style.borderColor='rgba(255,255,255,0.1)'" />
            <p class="text-xs mt-1" style="color: #475569;">{{ form.body.length }}/2000</p>
          </div>

          <!-- Location pin info -->
          <div class="rounded-xl p-3" style="background: rgba(59,130,246,0.06); border: 1px solid rgba(59,130,246,0.2);">
            <p class="text-xs uppercase tracking-wider mb-1" style="color: #64748b;">📍 Pinned at</p>
            <p class="text-sm font-mono text-white">{{ lat?.toFixed(6) }}°N, {{ lng?.toFixed(6) }}°E</p>
            <label class="flex items-center gap-2 text-sm mt-2 cursor-pointer" style="color: #cbd5e1;">
              <input type="checkbox" v-model="form.isExact" />
              This is my exact location
            </label>
          </div>

          <!-- Place name -->
          <div>
            <label class="block text-xs uppercase tracking-wider mb-1.5" style="color: #94a3b8;">Location Name <span style="color: #475569;">(optional)</span></label>
            <input v-model="form.locationName" type="text" placeholder="e.g. Intramuros, Manila" maxlength="100"
              class="w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none"
              style="background: #0f172a; border: 1px solid rgba(255,255,255,0.1);"
              @focus="(e) => (e.target as HTMLElement).style.borderColor='rgba(96,165,250,0.5)'"
              @blur="(e) => (e.target as HTMLElement).style.borderColor='rgba(255,255,255,0.1)'" />
          </div>

          <!-- Tags -->
          <div>
            <label class="block text-xs uppercase tracking-wider mb-1.5" style="color: #94a3b8;">Tags <span style="color: #475569;">(optional, comma separated)</span></label>
            <input v-model="tagsInput" type="text" placeholder="food, travel, hidden gem"
              class="w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none"
              style="background: #0f172a; border: 1px solid rgba(255,255,255,0.1);"
              @focus="(e) => (e.target as HTMLElement).style.borderColor='rgba(96,165,250,0.5)'"
              @blur="(e) => (e.target as HTMLElement).style.borderColor='rgba(255,255,255,0.1)'" />
            <div v-if="parsedTags.length" class="flex flex-wrap gap-1.5 mt-2">
              <span v-for="tag in parsedTags" :key="tag"
                class="text-xs px-2 py-0.5 rounded-full"
                style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8;">
                #{{ tag }}
              </span>
            </div>
          </div>

          <!-- Visibility -->
          <label class="flex items-center gap-2 text-sm cursor-pointer" style="color: #cbd5e1;">
            <input type="checkbox" v-model="form.isPublic" />
            Make this note public
          </label>

          <!-- Actions -->
          <div class="flex gap-3 pt-2">
            <button type="button" @click="$emit('close')"
              class="flex-1 py-2.5 rounded-lg text-sm font-medium border cursor-pointer"
              style="background: transparent; border-color: rgba(255,255,255,0.1); color: #94a3b8;">
              Cancel
            </button>
            <button type="submit" :disabled="loading"
              class="flex-1 py-2.5 rounded-lg text-sm font-medium text-white border-0 cursor-pointer disabled:opacity-50"
              style="background: #3b82f6;">
              {{ loading ? 'Dropping...' : '📍 Drop Note' }}
            </button>
          </div>
        </form>
      </div>
    </div>
  </teleport>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useNotesStore } from '../stores/note.store'
import { useToastStore } from '../stores/toast.store'
import type { Note } from '../types'

const props = defineProps<{ lat: number; lng: number }>()
const emit  = defineEmits<{ close: []; created: [note: Note] }>()

const notesStore = useNotesStore()
const toastStore = useToastStore()
const loading    = ref(false)
const tagsInput  = ref('')

const form = ref({ title: '', body: '', locationName: '', isExact: true, isPublic: true })

const parsedTags = computed(() =>
  tagsInput.value.split(',').map(t => t.trim().toLowerCase()).filter(t => t.length > 0 && t.length <= 30)
)

async function handleSubmit() {
  loading.value = true
  try {
    const note = await notesStore.createNote({
      ...form.value,
      lat: props.lat,
      lng: props.lng,
      tags: parsedTags.value,
    })
    toastStore.success('Note dropped! 📍')
    emit('created', note)
  } catch (e: any) {
    toastStore.error(e.response?.data?.message ?? 'Failed to create note')
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
@keyframes slideUp {
  from { transform: translateY(16px); opacity: 0; }
  to   { transform: translateY(0); opacity: 1; }
}
</style>
