import { noteService } from '../services/note.service.js';

export const noteController = {
  async getAllNotes(req, res) {
    const result = await noteService.getAllNotes(req.query);
    res.json({ success: true, data: result });
  },

  async getNoteById(req, res) {
    const note = await noteService.getNoteById(req.params.id);
    res.json({ success: true, data: note });
  },

  async getNearbyNotes(req, res) {
    const notes = await noteService.getNearbyNotes(req.query);
    res.json({ success: true, data: notes });
  },

  async getMyNotes(req, res) {
    const notes = await noteService.getMyNotes(req.user.id);
    res.json({ success: true, data: notes });
  },

  async createNote(req, res) {
    const note = await noteService.createNote(req.user.id, req.body);
    res.status(201).json({ success: true, data: note });
  },

  async updateNote(req, res) {
    const note = await noteService.updateNote(req.params.id, req.user.id, req.body);
    res.json({ success: true, data: note });
  },

  async deleteNote(req, res) {
    await noteService.deleteNote(req.params.id, req.user.id);
    res.json({ success: true, message: 'Note deleted' });
  },

  async toggleLike(req, res) {
    const result = await noteService.toggleLike(req.params.id, req.user.id);
    res.json({ success: true, data: result });
  },

  async addComment(req, res) {
    const note = await noteService.addComment(req.params.id, req.user.id, req.body.text);
    res.status(201).json({ success: true, data: note });
  },

  async deleteComment(req, res) {
    await noteService.deleteComment(req.params.id, req.params.commentId, req.user.id);
    res.json({ success: true, message: 'Comment deleted' });
  },

  async toggleSave(req, res) {
    const result = await noteService.saveNote(req.params.id, req.user.id);
    res.json({ success: true, data: result });
  },

  async getSavedNotes(req, res) {
    const notes = await noteService.getSavedNotes(req.user.id);
    res.json({ success: true, data: notes });
  },
};