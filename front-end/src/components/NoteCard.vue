<template>
  <div class="rounded-xl p-4 cursor-pointer transition-all duration-200 group"
    style="background: #1e293b; border: 1px solid rgba(255,255,255,0.05);"
    @click="$emit('select', note)"
    @mouseover="hovered = true"
    @mouseleave="hovered = false"
    :style="hovered ? 'border-color: rgba(255,255,255,0.15); background: #334155;' : 'border-color: rgba(255,255,255,0.05); background: #1e293b;'"
  >
    <!-- Author row -->
    <div class="flex items-start justify-between gap-3 mb-3">
      <div class="flex items-center gap-2">
        <div class="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold text-white flex-shrink-0"
          style="background: linear-gradient(135deg, #3b82f6, #8b5cf6);">
          {{ note.author?.username?.[0]?.toUpperCase() ?? '?' }}
        </div>
        <div>
          <p class="text-sm font-medium text-white">{{ note.author?.username }}</p>
          <p class="text-xs" style="color: #64748b;">{{ timeAgo(note.createdAt) }}</p>
        </div>
      </div>
      <div class="flex items-center gap-1 flex-shrink-0">
        <span v-if="!note.location?.isExact"
          class="text-xs px-1.5 py-0.5 rounded"
          style="background: rgba(249,115,22,0.15); color: #fb923c; border: 1px solid rgba(249,115,22,0.2);">
          ~approx
        </span>
      </div>
    </div>

    <!-- Title + Body -->
    <h3 class="font-semibold text-white mb-1 truncate transition-colors"
      :style="hovered ? 'color: #60a5fa;' : 'color: white;'">
      {{ note.title }}
    </h3>
    <p class="text-sm mb-3 line-clamp-2" style="color: #94a3b8;">{{ note.body }}</p>

    <!-- Location -->
    <div class="flex items-center gap-1 text-xs mb-3" style="color: #64748b;">
      <span>📍</span>
      <span class="truncate">
        {{ note.location?.name || `${note.location?.coordinates?.[1]?.toFixed(4)}°N, ${note.location?.coordinates?.[0]?.toFixed(4)}°E` }}
      </span>
    </div>

    <!-- Tags -->
    <div v-if="note.tags?.length" class="flex flex-wrap gap-1 mb-3">
      <span v-for="tag in note.tags.slice(0,3)" :key="tag"
        class="text-xs px-2 py-0.5 rounded-full"
        style="background: rgba(255,255,255,0.05); border: 1px solid rgba(255,255,255,0.08); color: #94a3b8;">
        #{{ tag }}
      </span>
    </div>

    <!-- Actions -->
    <div class="flex items-center gap-4 pt-3" style="border-top: 1px solid rgba(255,255,255,0.05);">
      <button @click.stop="$emit('like', note._id)"
        class="flex items-center gap-1 text-xs transition-colors bg-transparent border-0 cursor-pointer p-0"
        style="color: #64748b;"
        @mouseover="(e) => (e.currentTarget as HTMLElement).style.color='#f87171'"
        @mouseleave="(e) => (e.currentTarget as HTMLElement).style.color='#64748b'">
        ❤️ {{ note.likesCount ?? note.likes?.length ?? 0 }}
      </button>
      <button class="flex items-center gap-1 text-xs bg-transparent border-0 p-0" style="color: #64748b;">
        💬 {{ note.comments?.length ?? 0 }}
      </button>
      <button @click.stop="$emit('save', note._id)"
        class="flex items-center gap-1 text-xs ml-auto transition-colors bg-transparent border-0 cursor-pointer p-0"
        style="color: #64748b;"
        @mouseover="(e) => (e.currentTarget as HTMLElement).style.color='#fbbf24'"
        @mouseleave="(e) => (e.currentTarget as HTMLElement).style.color='#64748b'">
        🔖
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref } from 'vue'
import type { Note } from '../types/index'

defineProps<{ note: Note }>()
defineEmits<{ select: [note: Note]; like: [id: string]; save: [id: string] }>()

const hovered = ref(false)

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