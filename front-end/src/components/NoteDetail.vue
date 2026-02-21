<template>
  <div class="flex flex-col h-full">
    <!-- Header -->
    <div class="flex items-center justify-between p-4" style="border-bottom: 1px solid rgba(255,255,255,0.05);">
      <button @click="$emit('close')"
        class="flex items-center gap-1 text-sm px-3 py-1.5 rounded-lg transition-colors bg-transparent border-0 cursor-pointer"
        style="color: #94a3b8;"
        @mouseover="(e) => (e.currentTarget as HTMLElement).style.color='white'"
        @mouseleave="(e) => (e.currentTarget as HTMLElement).style.color='#94a3b8'">
        ← Back
      </button>
      <div class="flex gap-2">
        <button @click="handleSave"
          class="text-sm px-3 py-1.5 rounded-lg transition-all border cursor-pointer"
          :style="saved
            ? 'background: rgba(251,191,36,0.15); border-color: rgba(251,191,36,0.3); color: #fbbf24;'
            : 'background: transparent; border-color: rgba(255,255,255,0.1); color: #94a3b8;'">
          {{ saved ? '🔖 Saved' : '🔖 Save' }}
        </button>
        <button v-if="isOwner" @click="handleDelete"
          class="text-sm px-3 py-1.5 rounded-lg border cursor-pointer"
          style="background: rgba(239,68,68,0.1); border-color: rgba(239,68,68,0.2); color: #f87171;">
          🗑️
        </button>
      </div>
    </div>

    <!-- Scrollable content -->
    <div class="flex-1 overflow-y-auto p-4 space-y-5">

      <!-- Author -->
      <div class="flex items-center gap-3">
        <div class="w-10 h-10 rounded-full flex items-center justify-center font-bold text-white"
          style="background: linear-gradient(135deg, #3b82f6, #8b5cf6);">
          {{ note.author?.username?.[0]?.toUpperCase() }}
        </div>
        <div>
          <p class="font-medium text-white">{{ note.author?.username }}</p>
          <p class="text-xs" style="color: #64748b;">{{ formatDate(note.createdAt) }}</p>
        </div>
      </div>

      <!-- Badge + Title + Body -->
      <div>
        <span v-if="!note.location?.isExact"
          class="inline-block text-xs px-2 py-0.5 rounded-full mb-2"
          style="background: rgba(249,115,22,0.15); color: #fb923c; border: 1px solid rgba(249,115,22,0.2);">
          Approximate location
        </span>
        <h2 class="text-xl font-bold text-white mb-3" style="font-family: 'Playfair Display', serif;">
          {{ note.title }}
        </h2>
        <p class="text-sm leading-relaxed whitespace-pre-wrap" style="color: #cbd5e1;">{{ note.body }}</p>
      </div>

      <!-- Tags -->
      <div v-if="note.tags?.length" class="flex flex-wrap gap-2">
        <span v-for="tag in note.tags" :key="tag"
          class="text-xs px-2 py-0.5 rounded-full"
          style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8;">
          #{{ tag }}
        </span>
      </div>

      <!-- Location card -->
      <div class="rounded-xl p-3 text-sm" style="background: rgba(59,130,246,0.05); border: 1px solid rgba(59,130,246,0.15);">
        <p class="text-xs uppercase tracking-wider mb-1" style="color: #64748b;">📍 Location</p>
        <p class="font-medium text-white">{{ note.location?.name || 'Unnamed location' }}</p>
        <p class="text-xs mt-1 font-mono" style="color: #64748b;">
          {{ note.location?.coordinates?.[1]?.toFixed(6) }}°N,
          {{ note.location?.coordinates?.[0]?.toFixed(6) }}°E
        </p>
      </div>

      <!-- Like button -->
      <button @click="handleLike"
        class="w-full py-2.5 rounded-xl border text-sm font-medium flex items-center justify-center gap-2 cursor-pointer transition-all"
        :style="liked
          ? 'background: rgba(239,68,68,0.15); border-color: rgba(239,68,68,0.3); color: #f87171;'
          : 'background: rgba(255,255,255,0.04); border-color: rgba(255,255,255,0.08); color: #94a3b8;'">
        <span :style="liked ? 'transform: scale(1.2)' : ''">❤️</span>
        {{ liked ? 'Liked' : 'Like' }} · {{ likeCount }}
      </button>

      <!-- Comments -->
      <div>
        <h3 class="font-semibold text-white mb-3">
          Comments
          <span class="font-normal text-sm" style="color: #64748b;">({{ note.comments?.length ?? 0 }})</span>
        </h3>

        <!-- Comment input -->
        <div v-if="authStore.isLoggedIn" class="flex gap-2 mb-4">
          <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
            style="background: #3b82f6;">
            {{ authStore.user?.username?.[0]?.toUpperCase() }}
          </div>
          <div class="flex-1 flex gap-2">
            <input
              v-model="commentText"
              @keyup.enter="submitComment"
              type="text"
              placeholder="Add a comment..."
              class="flex-1 text-sm rounded-lg px-3 py-2 text-white placeholder-gray-500 focus:outline-none"
              style="background: #0f172a; border: 1px solid rgba(255,255,255,0.1);"
              @focus="(e) => (e.target as HTMLElement).style.borderColor='rgba(96,165,250,0.5)'"
              @blur="(e) => (e.target as HTMLElement).style.borderColor='rgba(255,255,255,0.1)'"
            />
            <button @click="submitComment"
              :disabled="!commentText.trim() || submittingComment"
              class="px-3 py-2 rounded-lg text-sm font-medium text-white border-0 cursor-pointer disabled:opacity-50"
              style="background: #3b82f6;">
              {{ submittingComment ? '...' : 'Post' }}
            </button>
          </div>
        </div>
        <p v-else class="text-sm mb-4" style="color: #64748b;">
          <router-link to="/login" style="color: #60a5fa;">Login</router-link> to comment
        </p>

        <!-- Comment list -->
        <div class="space-y-3">
          <div v-for="comment in note.comments" :key="comment._id" class="flex gap-2 group">
            <div class="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0 mt-0.5"
              style="background: linear-gradient(135deg, #8b5cf6, #ec4899);">
              {{ comment.user?.username?.[0]?.toUpperCase() }}
            </div>
            <div class="flex-1 min-w-0">
              <div class="flex items-baseline gap-2">
                <span class="text-sm font-medium text-white">{{ comment.user?.username }}</span>
                <span class="text-xs" style="color: #64748b;">{{ timeAgo(comment.createdAt) }}</span>
              </div>
              <p class="text-sm mt-0.5" style="color: #cbd5e1;">{{ comment.text }}</p>
            </div>
            <button v-if="comment.user?._id === authStore.user?._id"
              @click="deleteComment(comment._id)"
              class="opacity-0 group-hover:opacity-100 text-xs bg-transparent border-0 cursor-pointer transition-all"
              style="color: #64748b;">
              ✕
            </button>
          </div>
          <p v-if="!note.comments?.length" class="text-sm text-center py-4" style="color: #64748b;">
            No comments yet. Be the first!
          </p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'
import { useAuthStore }  from '../stores/auth.store'
import { useNotesStore } from '../stores/note.store'
import { useToastStore } from '../stores/toast.store'
import { notesAPI }      from '../services/api'
import type { Note }     from '../types'

const props = defineProps<{ note: Note }>()
const emit  = defineEmits<{ close: []; deleted: [] }>()

const authStore  = useAuthStore()
const notesStore = useNotesStore()
const toastStore = useToastStore()

const liked              = ref(props.note.likes?.includes(authStore.user?._id ?? '') ?? false)
const likeCount          = ref(props.note.likesCount ?? props.note.likes?.length ?? 0)
const saved              = ref(false)
const commentText        = ref('')
const submittingComment  = ref(false)

const isOwner = computed(() =>
  props.note.author?._id === authStore.user?._id ||
  props.note.author === authStore.user?._id as any
)

async function handleLike() {
  if (!authStore.isLoggedIn) { toastStore.info('Login to like notes'); return }
  try {
    const result = await notesStore.toggleLike(props.note._id)
    liked.value     = result.liked
    likeCount.value = result.likesCount
  } catch { toastStore.error('Failed to like note') }
}

async function handleSave() {
  if (!authStore.isLoggedIn) { toastStore.info('Login to save notes'); return }
  try {
    const result = await notesStore.toggleSave(props.note._id)
    saved.value = result.saved
    toastStore.success(result.saved ? 'Note saved!' : 'Note unsaved')
  } catch { toastStore.error('Failed to save note') }
}

async function handleDelete() {
  if (!confirm('Delete this note?')) return
  try {
    await notesStore.deleteNote(props.note._id)
    toastStore.success('Note deleted')
    emit('deleted')
  } catch { toastStore.error('Failed to delete note') }
}

async function submitComment() {
  if (!commentText.value.trim()) return
  submittingComment.value = true
  try {
    await notesStore.addComment(props.note._id, commentText.value.trim())
    commentText.value = ''
    toastStore.success('Comment posted!')
  } catch { toastStore.error('Failed to post comment') }
  finally { submittingComment.value = false }
}

async function deleteComment(commentId: string) {
  try {
    await notesAPI.deleteComment(props.note._id, commentId)
    props.note.comments = props.note.comments.filter(c => c._id !== commentId)
  } catch { toastStore.error('Failed to delete comment') }
}

function formatDate(d: string) {
  return new Date(d).toLocaleDateString('en-PH', { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' })
}
function timeAgo(dateStr: string) {
  const diff = Date.now() - new Date(dateStr).getTime()
  const m = Math.floor(diff / 60000)
  if (m < 1) return 'just now'
  if (m < 60) return `${m}m ago`
  const h = Math.floor(m / 60)
  if (h < 24) return `${h}h ago`
  return `${Math.floor(h / 24)}d ago`
}
</script>