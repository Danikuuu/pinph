import Note from '../models/note.model.js';

const AUTHOR_FIELDS = 'username avatar';

export const noteRepository = {
  async findAll({ page = 1, limit = 20, search = '' } = {}) {
    const query = { isPublic: true };
    if (search) query.$text = { $search: search };
    const skip = (page - 1) * limit;
    const [notes, total] = await Promise.all([
      Note.find(query).populate('author', AUTHOR_FIELDS).sort({ createdAt: -1 }).skip(skip).limit(limit),
      Note.countDocuments(query),
    ]);
    return { notes, total, pages: Math.ceil(total / limit) };
  },

  async findById(id) {
    return Note.findById(id)
      .populate('author', AUTHOR_FIELDS)
      .populate('comments.user', AUTHOR_FIELDS);
  },

  async findNearby({ lng, lat, maxDistance = 50000 }) {
    return Note.find({
      isPublic: true,
      location: {
        $near: {
          $geometry: { type: 'Point', coordinates: [lng, lat] },
          $maxDistance: maxDistance,
        },
      },
    }).populate('author', AUTHOR_FIELDS).limit(50);
  },

  async findByAuthor(authorId) {
    return Note.find({ author: authorId }).populate('author', AUTHOR_FIELDS).sort({ createdAt: -1 });
  },

  async create(data) {
    return (await Note.create(data)).populate ? Note.create(data) : Note.create(data);
  },

  async updateById(id, data) {
    return Note.findByIdAndUpdate(id, data, { new: true }).populate('author', AUTHOR_FIELDS);
  },

  async deleteById(id) {
    return Note.findByIdAndDelete(id);
  },

  async toggleLike(noteId, userId) {
    const note = await Note.findById(noteId);
    if (!note) return null;
    const liked = note.likes.includes(userId);
    if (liked) {
      note.likes.pull(userId);
    } else {
      note.likes.push(userId);
    }
    await note.save();
    return { liked: !liked, likesCount: note.likes.length };
  },

  async addComment(noteId, userId, text) {
    return Note.findByIdAndUpdate(
      noteId,
      { $push: { comments: { user: userId, text } } },
      { new: true }
    ).populate('comments.user', AUTHOR_FIELDS);
  },

  async deleteComment(noteId, commentId, userId) {
    return Note.findByIdAndUpdate(
      noteId,
      { $pull: { comments: { _id: commentId, user: userId } } },
      { new: true }
    );
  },
};