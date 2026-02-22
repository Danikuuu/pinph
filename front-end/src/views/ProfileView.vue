<template>
  <div class="pt-20 pb-16 px-4 max-w-3xl mx-auto">
    <div v-if="authStore.user" class="space-y-6">
      <!-- Header card -->
      <div class="rounded-2xl p-6 flex items-start gap-5" style="background: #1e293b; border: 1px solid rgba(255,255,255,0.06);">
        <div class="w-20 h-20 rounded-2xl flex items-center justify-center text-3xl font-bold text-white flex-shrink-0"
          style="background: linear-gradient(135deg, #3b82f6, #8b5cf6); box-shadow: 0 8px 24px rgba(59,130,246,0.3);">
         {{ authStore.user?.username?.[0]?.toUpperCase() ?? '' }}

        </div>
        <div class="flex-1">
          <h1 class="text-2xl font-bold text-white" style="font-family:'Playfair Display',serif;">{{ authStore.user.username }}</h1>
          <p class="text-sm mt-0.5" style="color: #64748b;">{{ authStore.user.email }}</p>
          <p class="text-sm mt-2" style="color: #cbd5e1;">{{ authStore.user.bio || 'No bio yet.' }}</p>
          <p class="text-xs mt-2" style="color: #475569;">Member since {{ formatDate(authStore.user.createdAt) }}</p>
        </div>
        <button @click="showEdit = !showEdit"
          class="px-3 py-1.5 rounded-lg text-sm border cursor-pointer transition-all"
          style="background: transparent; border-color: rgba(255,255,255,0.1); color: #94a3b8;"
          @mouseover="(e:any) => e.currentTarget.style.color='white'"
          @mouseleave="(e:any) => e.currentTarget.style.color='#94a3b8'">
          ✏️ Edit
        </button>
      </div>

      <!-- Edit bio -->
      <transition name="slide-up">
        <div v-if="showEdit" class="rounded-xl p-4" style="background: #1e293b; border: 1px solid rgba(255,255,255,0.06);">
          <label class="block text-xs uppercase tracking-wider mb-2" style="color: #94a3b8;">Bio</label>
          <textarea v-model="bioInput" maxlength="200" rows="3" placeholder="Tell the world about yourself..."
            class="w-full rounded-lg px-4 py-3 text-sm text-white focus:outline-none resize-none mb-3"
            style="background: #0f172a; border: 1px solid rgba(255,255,255,0.1);" />
          <div class="flex gap-2 justify-end">
            <button @click="showEdit = false"
              class="px-4 py-2 rounded-lg text-sm border cursor-pointer"
              style="background: transparent; border-color: rgba(255,255,255,0.1); color: #94a3b8;">
              Cancel
            </button>
            <button @click="saveBio"
              class="px-4 py-2 rounded-lg text-sm font-medium text-white border-0 cursor-pointer"
              style="background: #3b82f6;">
              Save Bio
            </button>
          </div>
        </div>
      </transition>

      <!-- My Notes -->
      <div>
        <h2 class="font-semibold text-white mb-4 flex items-center gap-2">
          📍 My Notes
          <span class="text-xs px-2 py-0.5 rounded-full" style="background: rgba(255,255,255,0.05); color: #64748b;">{{ myNotes.length }}</span>
        </h2>
        <p v-if="loadingNotes" class="text-sm" style="color: #64748b;">Loading...</p>
        <div v-else-if="myNotes.length" class="grid gap-4" style="grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));">
          <NoteCard v-for="note in myNotes" :key="note._id" :note="note"
            @select="() => router.push('/map')" @like="handleLike" @save="handleSave" />
        </div>
        <div v-else class="rounded-xl p-10 text-center" style="background: #1e293b; border: 1px solid rgba(255,255,255,0.05);">
          <p class="text-sm" style="color: #64748b;">You haven't dropped any notes yet.</p>
          <router-link to="/map" style="color: #60a5fa; font-size: 14px; display: block; margin-top: 8px;">
            Open the map →
          </router-link>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore }  from '../stores/auth.store'
import { useToastStore } from '../stores/toast.store'
import { notesAPI, usersAPI } from '../services/api'
import NoteCard from '../components/NoteCard.vue'
import type { Note } from '../types'

const authStore  = useAuthStore()
const toastStore = useToastStore()
const router     = useRouter()

const myNotes    = ref<Note[]>([])
const loadingNotes = ref(false)
const showEdit   = ref(false)
const bioInput   = ref(authStore.user?.bio ?? '')

onMounted(async () => {
  loadingNotes.value = true
  try {
    const res = await notesAPI.getMyNotes()
    myNotes.value = res.data.data
  } finally {
    loadingNotes.value = false
  }
})


async function saveBio() {
  try {
    await usersAPI.updateProfile({ bio: bioInput.value })
    if (authStore.user) authStore.user.bio = bioInput.value
    showEdit.value = false
    toastStore.success('Bio updated!')
  } catch { toastStore.error('Failed to update bio') }
}

async function handleLike(id: string) {
  try { await notesAPI.toggleLike(id) } catch { toastStore.error('Failed') }
}
async function handleSave(id: string) {
  try {
    const res = await notesAPI.toggleSave(id)
    // res.data.data is already Note, no extra .data
    toastStore.success(res.data.data.saved ? 'Saved!' : 'Unsaved')
  } catch {
    toastStore.error('Failed')
  }
}


function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'long' })
}
</script>