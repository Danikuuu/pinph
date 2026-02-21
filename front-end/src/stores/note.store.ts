import { defineStore } from 'pinia'
import { ref } from 'vue'
import { notesAPI } from '../services/api'
import type { Note, CreateNotePayload } from '../types/index'

export const useNotesStore = defineStore('notes', () => {
  const notes       = ref<Note[]>([])
  const activeNote  = ref<Note | null>(null)
  const loading     = ref(false)
  const error       = ref<string | null>(null)

  async function fetchAll(params?: Record<string, string>) {
    loading.value = true
    try {
      const res = await notesAPI.getAll(params)
      notes.value = res.data.data.notes
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchNearby(params: { lat: number; lng: number }) {
    loading.value = true
    try {
      const res = await notesAPI.getNearby(params)
      notes.value = res.data.data
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function fetchById(id: string) {
    loading.value = true
    try {
      const res = await notesAPI.getById(id)
      activeNote.value = res.data.data
      return activeNote.value
    } catch (e: any) {
      error.value = e.message
    } finally {
      loading.value = false
    }
  }

  async function createNote(data: CreateNotePayload) {
    const res = await notesAPI.create(data)
    const note = res.data.data
    notes.value.unshift(note)
    return note
  }

  async function deleteNote(id: string) {
    await notesAPI.delete(id)
    notes.value = notes.value.filter(n => n._id !== id)
    if (activeNote.value?._id === id) activeNote.value = null
  }

  async function toggleLike(id: string) {
    const res = await notesAPI.toggleLike(id)
    const { liked, likesCount } = res.data.data
    const note = notes.value.find(n => n._id === id)
    if (note) note.likesCount = likesCount
    if (activeNote.value?._id === id) activeNote.value.likesCount = likesCount
    return { liked, likesCount }
  }

  async function addComment(noteId: string, text: string) {
    const res = await notesAPI.addComment(noteId, text)
    const updated = res.data.data
    if (activeNote.value?._id === noteId) {
      activeNote.value.comments = updated.comments
    }
    return updated
  }

  async function toggleSave(id: string) {
    const res = await notesAPI.toggleSave(id)
    return res.data.data
  }

  return { notes, activeNote, loading, error, fetchAll, fetchNearby, fetchById, createNote, deleteNote, toggleLike, addComment, toggleSave }
})