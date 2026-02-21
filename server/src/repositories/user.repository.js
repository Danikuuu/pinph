import User from '../models/user.model.js';

export const userRepository = {
  async findById(id) {
    return User.findById(id);
  },
  async findByEmail(email) {
    return User.findOne({ email });
  },
  async findByUsername(username) {
    return User.findOne({ username });
  },
  async create(data) {
    return User.create(data);
  },
  async updateById(id, data) {
    return User.findByIdAndUpdate(id, data, { new: true });
  },
  async addSavedNote(userId, noteId) {
    return User.findByIdAndUpdate(userId, { $addToSet: { savedNotes: noteId } }, { new: true });
  },
  async removeSavedNote(userId, noteId) {
    return User.findByIdAndUpdate(userId, { $pull: { savedNotes: noteId } }, { new: true });
  },
  async getSavedNotes(userId) {
    return User.findById(userId).populate({
      path: 'savedNotes',
      populate: { path: 'author', select: 'username avatar' }
    });
  },
};