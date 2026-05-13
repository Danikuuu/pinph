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
    const ln = parseFloat(lng);
    const lt = parseFloat(lat);
    if (!Number.isFinite(ln) || !Number.isFinite(lt)) {
      throw { status: 400, message: 'Valid lat and lng query parameters are required' };
    }
    const md = parseInt(maxDistance, 10);
    return noteRepository.findNearby({
      lng: ln,
      lat: lt,
      maxDistance: Number.isFinite(md) && md > 0 ? md : 50000,
    });
  },

  async getMyNotes(userId) {
    return noteRepository.findByAuthor(userId);
  },

  async createNote(userId, data) {
    const { title, body, lat, lng, locationName, isExact, tags, isPublic } = data;
    const ln = parseFloat(lng);
    const lt = parseFloat(lat);
    if (!title?.trim() || !body?.trim()) throw { status: 400, message: 'Title and body are required' };
    if (!Number.isFinite(ln) || !Number.isFinite(lt)) throw { status: 400, message: 'Valid coordinates are required' };
    return noteRepository.create({
      author: userId,
      title: title.trim(),
      body: body.trim(),
      location: {
        type: 'Point',
        coordinates: [ln, lt],
        name: (locationName && String(locationName).trim()) || '',
        isExact: isExact !== false,
      },
      tags: Array.isArray(tags) ? tags : [],
      isPublic: isPublic !== false,
    });
  },

  async updateNote(noteId, userId, data) {
    const note = await noteRepository.findById(noteId);
    if (!note) throw { status: 404, message: 'Note not found' };
    if (note.author._id.toString() !== userId.toString()) throw { status: 403, message: 'Not authorized' };

    const $set = {};
    if (data.title !== undefined) {
      if (typeof data.title !== 'string' || !data.title.trim()) throw { status: 400, message: 'Invalid title' };
      $set.title = data.title.trim();
    }
    if (data.body !== undefined) {
      if (typeof data.body !== 'string' || !data.body.trim()) throw { status: 400, message: 'Invalid body' };
      $set.body = data.body.trim();
    }
    if (data.tags !== undefined) {
      if (!Array.isArray(data.tags)) throw { status: 400, message: 'Invalid tags' };
      $set.tags = data.tags.map((t) => String(t).trim()).filter(Boolean).slice(0, 30);
    }
    if (typeof data.isPublic === 'boolean') $set.isPublic = data.isPublic;
    if (data.locationName !== undefined) $set['location.name'] = String(data.locationName).trim().slice(0, 200);
    if (typeof data.isExact === 'boolean') $set['location.isExact'] = data.isExact;
    if (data.lat !== undefined && data.lng !== undefined) {
      const ln = parseFloat(data.lng);
      const lt = parseFloat(data.lat);
      if (!Number.isFinite(ln) || !Number.isFinite(lt)) throw { status: 400, message: 'Invalid coordinates' };
      $set['location.type'] = 'Point';
      $set['location.coordinates'] = [ln, lt];
    }
    if (Object.keys($set).length === 0) throw { status: 400, message: 'No allowed fields to update' };
    return noteRepository.updateById(noteId, { $set });
  },

  async deleteNote(noteId, userId) {
    const note = await noteRepository.findById(noteId);
    if (!note) throw { status: 404, message: 'Note not found' };
    if (note.author._id.toString() !== userId.toString()) throw { status: 403, message: 'Not authorized' };
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
    if (typeof text !== 'string' || !text.trim()) throw { status: 400, message: 'Comment text is required' };
    if (text.length > 500) throw { status: 400, message: 'Comment is too long' };
    return noteRepository.addComment(noteId, userId, text.trim());
  },

  async deleteComment(noteId, commentId, userId) {
    const note = await noteRepository.findById(noteId);
    if (!note) throw { status: 404, message: 'Note not found' };
    const updated = await noteRepository.deleteComment(noteId, commentId, userId);
    if (!updated) throw { status: 404, message: 'Note not found' };
    return updated;
  },

  async saveNote(noteId, userId) {
    const note = await noteRepository.findById(noteId);
    if (!note) throw { status: 404, message: 'Note not found' };
    const user = await userRepository.findById(userId);
    const alreadySaved = user.savedNotes.some((id) => id.toString() === noteId.toString());
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