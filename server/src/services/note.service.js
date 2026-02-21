import { noteRepository } from '../repositories/note.repository.js';
import { userRepository } from '../repositories/user.repository.js';

export const noteService = {
  async getAllNotes(query) {
    return noteRepository.findAll(query);
  },

  async getNoteById(id) {
    const note = await noteRepository.findById(id);
    if (!note) throw { status: 404, message: 'Note not found' };
    return note;
  },

  async getNearbyNotes({ lng, lat, maxDistance }) {
    return noteRepository.findNearby({ lng: parseFloat(lng), lat: parseFloat(lat), maxDistance: parseInt(maxDistance) || 50000 });
  },

  async getMyNotes(userId) {
    return noteRepository.findByAuthor(userId);
  },

  async createNote(userId, data) {
    const { title, body, lat, lng, locationName, isExact, tags, isPublic } = data;
    return noteRepository.create({
      author: userId,
      title,
      body,
      location: {
        type: 'Point',
        coordinates: [parseFloat(lng), parseFloat(lat)],
        name: locationName || '',
        isExact: isExact !== false,
      },
      tags: tags || [],
      isPublic: isPublic !== false,
    });
  },

  async updateNote(noteId, userId, data) {
    const note = await noteRepository.findById(noteId);
    if (!note) throw { status: 404, message: 'Note not found' };
    if (note.author._id.toString() !== userId) throw { status: 403, message: 'Not authorized' };
    return noteRepository.updateById(noteId, data);
  },

  async deleteNote(noteId, userId) {
    const note = await noteRepository.findById(noteId);
    if (!note) throw { status: 404, message: 'Note not found' };
    if (note.author._id.toString() !== userId) throw { status: 403, message: 'Not authorized' };
    return noteRepository.deleteById(noteId);
  },

  async toggleLike(noteId, userId) {
    const note = await noteRepository.findById(noteId);
    if (!note) throw { status: 404, message: 'Note not found' };
    return noteRepository.toggleLike(noteId, userId);
  },

  async addComment(noteId, userId, text) {
    const note = await noteRepository.findById(noteId);
    if (!note) throw { status: 404, message: 'Note not found' };
    return noteRepository.addComment(noteId, userId, text);
  },

  async deleteComment(noteId, commentId, userId) {
    return noteRepository.deleteComment(noteId, commentId, userId);
  },

  async saveNote(noteId, userId) {
    const note = await noteRepository.findById(noteId);
    if (!note) throw { status: 404, message: 'Note not found' };
    const user = await userRepository.findById(userId);
    const alreadySaved = user.savedNotes.includes(noteId);
    if (alreadySaved) {
      await userRepository.removeSavedNote(userId, noteId);
      return { saved: false };
    }
    await userRepository.addSavedNote(userId, noteId);
    return { saved: true };
  },

  async getSavedNotes(userId) {
    const user = await userRepository.getSavedNotes(userId);
    return user.savedNotes;
  },
};