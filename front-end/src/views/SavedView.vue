<template>
  <div class="pt-20 pb-16 px-4 max-w-3xl mx-auto">
    <h1 class="text-2xl font-bold text-white mb-6 flex items-center gap-3" style="font-family:'Playfair Display',serif;">
      🔖 Saved Notes
      <span class="text-sm font-normal" style="color: #64748b;">({{ savedNotes.length }})</span>
    </h1>

    <p v-if="loading" class="text-sm" style="color: #64748b;">Loading saved notes...</p>

    <div v-else-if="savedNotes.length" class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
      <NoteCard
        v-for="note in savedNotes"
        :key="note._id"
        :note="note"
        @select="() => router.push('/map')"
        @like="handleLike"
        @save="handleUnsave"
      />
    </div>

    <div v-else class="rounded-2xl p-16 text-center" style="background: #1e293b; border: 1px solid rgba(255,255,255,0.05);">
      <p class="text-4xl mb-4">🔖</p>
      <p class="mb-1" style="color: #94a3b8;">No saved notes yet.</p>
      <p class="text-sm mb-6" style="color: #64748b;">Explore the map and save notes you love.</p>
      <router-link to="/map"
        class="inline-block px-6 py-3 rounded-xl text-sm font-medium text-white no-underline"
        style="background: #3b82f6;">
        Explore Map →
      </router-link>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { notesAPI }      from '../services/api'
import { useToastStore } from '../stores/toast.store'
import NoteCard from '../components/NoteCard.vue'
import type { Note } from '../types'

const toastStore = useToastStore()
const router = useRouter()
const savedNotes = ref<Note[]>([])
const loading    = ref(false)

onMounted(async () => {
  loading.value = true
  try {
    const res = await notesAPI.getSaved()
    savedNotes.value = res.data.data
  } finally { loading.value = false }
})

async function handleLike(id: string) {
  try { await notesAPI.toggleLike(id) } catch { toastStore.error('Failed') }
}

async function handleUnsave(id: string) {
  try {
    await notesAPI.toggleSave(id)
    savedNotes.value = savedNotes.value.filter(n => n._id !== id)
    toastStore.success('Note unsaved')
  } catch { toastStore.error('Failed') }
}
</script>