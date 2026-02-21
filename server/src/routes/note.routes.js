import { Router } from 'express';
import { noteController } from '../controllers/note.controller.js';
import { protect, optionalAuth } from '../middleware/auth.middleware.js';

const router = Router();

// Public / optional auth
router.get('/',        optionalAuth, noteController.getAllNotes);
router.get('/nearby',  optionalAuth, noteController.getNearbyNotes);
router.get('/:id',     optionalAuth, noteController.getNoteById);

// Protected
router.use(protect);
router.get('/user/me',            noteController.getMyNotes);
router.get('/user/saved',         noteController.getSavedNotes);
router.post('/',                  noteController.createNote);
router.put('/:id',                noteController.updateNote);
router.delete('/:id',             noteController.deleteNote);
router.post('/:id/like',          noteController.toggleLike);
router.post('/:id/save',          noteController.toggleSave);
router.post('/:id/comments',      noteController.addComment);
router.delete('/:id/comments/:commentId', noteController.deleteComment);

export default router;