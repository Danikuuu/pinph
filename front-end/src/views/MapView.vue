<template>
  <div class="flex flex-col" style="height: 100vh; padding-top: 56px;">

    <!-- Toolbar -->
    <div class="flex items-center gap-3 px-4 py-2.5 z-10 relative"
      style="background: rgba(15,23,42,0.9); backdrop-filter: blur(12px); border-bottom: 1px solid rgba(255,255,255,0.05);">
      <div class="flex-1 relative max-w-md">
        <span class="absolute left-3 top-1/2 -translate-y-1/2" style="color: #64748b;">🔍</span>
        <input v-model="searchQuery" @input="debouncedSearch" type="text" placeholder="Search notes..."
          class="w-full rounded-lg pl-9 pr-4 py-2 text-sm text-white focus:outline-none"
          style="background: #1e293b; border: 1px solid rgba(255,255,255,0.08);"
          @focus="(e) => (e.target as HTMLElement).style.borderColor='rgba(96,165,250,0.4)'"
          @blur="(e) => (e.target as HTMLElement).style.borderColor='rgba(255,255,255,0.08)'" />
      </div>

      <!-- Mode toggle -->
      <div class="flex rounded-lg p-1" style="background: #1e293b; border: 1px solid rgba(255,255,255,0.05);">
        <button v-for="mode in (['all', 'nearby'] as const)" :key="mode"
          @click="setMode(mode)"
          class="px-3 py-1 rounded text-xs font-medium transition-all border-0 cursor-pointer capitalize"
          :style="viewMode === mode
            ? 'background: #3b82f6; color: white;'
            : 'background: transparent; color: #94a3b8;'">
          {{ mode === 'all' ? '🌍 All' : '📍 Nearby' }}
        </button>
      </div>

      <span class="text-xs" style="color: #475569;">{{ notesStore.notes.length }} notes</span>

      <button v-if="authStore.isLoggedIn" @click="toggleDropMode"
        class="px-4 py-2 rounded-lg text-sm font-medium text-white border-0 cursor-pointer transition-all"
        :style="dropMode ? 'background: #f97316;' : 'background: #3b82f6;'">
        {{ dropMode ? '✕ Cancel' : '+ Drop Note' }}
      </button>
      <router-link v-else to="/login"
        class="px-4 py-2 rounded-lg text-sm font-medium text-white no-underline"
        style="background: #3b82f6;">
        Login to Drop
      </router-link>
    </div>

    <!-- Drop mode banner -->
    <transition name="fade">
      <div v-if="dropMode" class="relative z-10 text-center text-sm py-2"
        style="background: rgba(249,115,22,0.15); border-bottom: 1px solid rgba(249,115,22,0.25); color: #fb923c;">
        🖱️ Click anywhere on the map to drop a note
      </div>
    </transition>

    <!-- Main content -->
    <div class="flex flex-1 overflow-hidden">

      <!-- Sidebar -->
      <div class="overflow-y-auto flex-shrink-0"
        :style="panelNote ? 'display:none;' : 'display:flex; flex-direction:column;'"
        style="width: 320px; background: #0f172a; border-right: 1px solid rgba(255,255,255,0.05);">
        <div class="p-3 space-y-2.5">
          <p v-if="notesStore.loading" class="text-center py-8 text-sm" style="color: #64748b;">Loading notes...</p>
          <p v-else-if="!notesStore.notes.length" class="text-center py-8 text-sm" style="color: #64748b;">No notes found</p>
          <NoteCard
            v-for="note in notesStore.notes"
            :key="note._id"
            :note="note"
            @select="openNote"
            @like="handleLike"
            @save="handleSave"
          />
        </div>
      </div>

      <!-- Map -->
      <div class="flex-1 relative">
        <div ref="mapEl" class="w-full h-full" />

        <!-- PH button -->
        <button @click="centerOnPH"
          class="absolute bottom-6 right-6 z-10 flex items-center gap-2 px-4 py-2 rounded-xl text-sm border cursor-pointer transition-all"
          style="background: rgba(30,41,59,0.9); border-color: rgba(255,255,255,0.1); color: #cbd5e1; backdrop-filter: blur(8px); box-shadow: 0 4px 16px rgba(0,0,0,0.3);"
          @mouseover="(e) => (e.currentTarget as HTMLElement).style.color='white'"
          @mouseleave="(e) => (e.currentTarget as HTMLElement).style.color='#cbd5e1'">
          🇵🇭 Back to Philippines
        </button>

        <!-- Coords -->
        <div class="absolute bottom-6 left-6 z-10 px-3 py-1.5 rounded-lg text-xs font-mono"
          style="background: rgba(30,41,59,0.8); border: 1px solid rgba(255,255,255,0.08); color: #64748b; backdrop-filter: blur(8px);">
          {{ cursorLat?.toFixed(5) ?? '--' }}°N, {{ cursorLng?.toFixed(5) ?? '--' }}°E
        </div>
      </div>

      <!-- Detail panel -->
      <transition name="panel">
        <div v-if="panelNote" class="flex-shrink-0 flex flex-col overflow-hidden"
          style="width: 384px; background: #0f172a; border-left: 1px solid rgba(255,255,255,0.05);">
          <NoteDetail :note="panelNote" @close="panelNote = null" @deleted="panelNote = null" />
        </div>
      </transition>
    </div>

    <!-- Create modal -->
    <teleport to="body">
      <transition name="modal">
        <CreateNoteModal
          v-if="showCreateModal"
          :lat="pendingLat!"
          :lng="pendingLng!"
          @close="closeModal"
          @created="onNoteCreated"
        />
      </transition>
    </teleport>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue'
import L from 'leaflet'
import 'leaflet/dist/leaflet.css'
import NoteCard         from '../components/NoteCard.vue'
import NoteDetail       from '../components/NoteDetail.vue'
import CreateNoteModal  from '../components/CreateNoteModal.vue'
import { useNotesStore } from '../stores/note.store'
import { useAuthStore }  from '../stores/auth.store'
import { useToastStore } from '../stores/toast.store'
import type { Note }     from '../types'

const notesStore = useNotesStore()
const authStore  = useAuthStore()
const toastStore = useToastStore()

const mapEl           = ref<HTMLDivElement>()
const viewMode        = ref<'all' | 'nearby'>('all')
const dropMode        = ref(false)
const panelNote       = ref<Note | null>(null)
const showCreateModal = ref(false)
const pendingLat      = ref<number | null>(null)
const pendingLng      = ref<number | null>(null)
const searchQuery     = ref('')
const cursorLat       = ref<number | null>(null)
const cursorLng       = ref<number | null>(null)

let map: L.Map | null = null
let markersLayer: L.LayerGroup | null = null
let pendingMarker: L.Marker | null = null
let searchTimer: ReturnType<typeof setTimeout>

const PH_CENTER: [number, number] = [12.8797, 121.7740]
const PH_ZOOM = 6

onMounted(async () => {
  initMap()
  await loadNotes()
})

onBeforeUnmount(() => { map?.remove() })

function initMap() {
  if (!mapEl.value) return
  map = L.map(mapEl.value, { center: PH_CENTER, zoom: PH_ZOOM, zoomControl: false, attributionControl: false })

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    maxZoom: 19,
    attribution: '© OpenStreetMap © CARTO',
  }).addTo(map)

  L.control.zoom({ position: 'topright' }).addTo(map)
  L.control.attribution({ position: 'bottomright' }).addTo(map)

  markersLayer = L.layerGroup().addTo(map)

  map.on('click', handleMapClick)
  map.on('mousemove', (e) => { cursorLat.value = e.latlng.lat; cursorLng.value = e.latlng.lng })
}

async function loadNotes() {
  if (viewMode.value === 'nearby') {
    navigator.geolocation?.getCurrentPosition(
      async (pos) => {
        await notesStore.fetchNearby({ lat: pos.coords.latitude, lng: pos.coords.longitude })
        renderMarkers()
        map?.setView([pos.coords.latitude, pos.coords.longitude], 12)
      },
      () => { toastStore.info('Could not get location, showing all notes'); loadAll() }
    )
  } else {
    await loadAll()
  }
}

async function loadAll() {
  await notesStore.fetchAll(searchQuery.value ? { search: searchQuery.value } : undefined)
  renderMarkers()
}

function renderMarkers() {
  markersLayer?.clearLayers()
  notesStore.notes.forEach(note => {
    const [lng, lat] = note.location.coordinates
    const color = note.location?.isExact ? '#3b82f6' : '#f97316'
    const icon = L.divIcon({
      html: `<div style="width:30px;height:34px;position:relative;">
        <div style="width:30px;height:30px;border-radius:50% 50% 50% 0;background:${color};border:2.5px solid white;transform:rotate(-45deg);box-shadow:0 4px 14px rgba(0,0,0,0.4);display:flex;align-items:center;justify-content:center;">
          <span style="transform:rotate(45deg);font-size:12px;">📝</span>
        </div>
      </div>`,
      className: 'note-marker-icon',
      iconSize: [30, 34],
      iconAnchor: [15, 34],
      popupAnchor: [0, -36],
    })
    const marker = L.marker([lat, lng], { icon }).addTo(markersLayer!)
    marker.bindPopup(makePopup(note), { maxWidth: 260, minWidth: 210, closeButton: false })
    marker.on('mouseover', () => marker.openPopup())
    marker.on('mouseout',  () => marker.closePopup())
    marker.on('click',     () => { marker.closePopup(); openNote(note) })
  })
}

function makePopup(note: Note) {
  return `<div style="padding:12px;font-family:'DM Sans',sans-serif;">
    <div style="display:flex;align-items:center;gap:8px;margin-bottom:8px;">
      <div style="width:24px;height:24px;border-radius:50%;background:linear-gradient(135deg,#3b82f6,#8b5cf6);display:flex;align-items:center;justify-content:center;font-size:10px;font-weight:bold;color:white;">
        ${note.author?.username?.[0]?.toUpperCase() ?? '?'}
      </div>
      <span style="font-size:12px;color:#94a3b8;">${note.author?.username}</span>
    </div>
    <p style="font-size:14px;font-weight:600;color:white;margin:0 0 4px;">${note.title.slice(0, 40)}${note.title.length > 40 ? '...' : ''}</p>
    <p style="font-size:12px;color:#94a3b8;margin:0 0 8px;line-height:1.4;">${note.body.slice(0, 60)}${note.body.length > 60 ? '...' : ''}</p>
    <div style="display:flex;gap:12px;font-size:12px;color:#64748b;">
      <span>❤️ ${note.likesCount ?? note.likes?.length ?? 0}</span>
      <span>💬 ${note.comments?.length ?? 0}</span>
    </div>
  </div>`
}

function handleMapClick(e: L.LeafletMouseEvent) {
  if (!dropMode.value) return
  pendingLat.value = e.latlng.lat
  pendingLng.value = e.latlng.lng
  clearPending()
  pendingMarker = L.marker([e.latlng.lat, e.latlng.lng], {
    icon: L.divIcon({
      html: `<div style="width:16px;height:16px;border-radius:50%;background:#f97316;border:3px solid white;box-shadow:0 0 0 0 rgba(249,115,22,0.6);animation:markerPulse 1s infinite;"></div>`,
      className: '',
      iconSize: [16, 16],
      iconAnchor: [8, 8],
    }),
  }).addTo(map!)
  showCreateModal.value = true
  dropMode.value = false
  if (map) map.getContainer().style.cursor = ''
}

function clearPending() {
  if (pendingMarker && map) { map.removeLayer(pendingMarker); pendingMarker = null }
}

function closeModal() {
  showCreateModal.value = false
  clearPending()
}

function toggleDropMode() {
  dropMode.value = !dropMode.value
  if (map) map.getContainer().style.cursor = dropMode.value ? 'crosshair' : ''
}

function openNote(note: Note) {
  panelNote.value = note
  const [lng, lat] = note.location.coordinates
  map?.setView([lat, lng], Math.max(map.getZoom(), 13), { animate: true })
}

async function handleLike(noteId: string) {
  if (!authStore.isLoggedIn) { toastStore.info('Login to like notes'); return }
  try { await notesStore.toggleLike(noteId) }
  catch { toastStore.error('Failed to like note') }
}

async function handleSave(noteId: string) {
  if (!authStore.isLoggedIn) { toastStore.info('Login to save notes'); return }
  try {
    const result = await notesStore.toggleSave(noteId)
    toastStore.success(result.saved ? 'Note saved!' : 'Note unsaved')
  } catch { toastStore.error('Failed to save note') }
}

function onNoteCreated(note: Note) {
  showCreateModal.value = false
  clearPending()
  renderMarkers()
  openNote(note)
}

function setMode(mode: 'all' | 'nearby') {
  viewMode.value = mode
  loadNotes()
}

function centerOnPH() {
  map?.flyTo(PH_CENTER, PH_ZOOM, { animate: true, duration: 1.5 })
}

function debouncedSearch() {
  clearTimeout(searchTimer)
  searchTimer = setTimeout(() => loadAll(), 400)
}
</script>