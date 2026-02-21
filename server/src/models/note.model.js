import mongoose from 'mongoose';

const commentSchema = new mongoose.Schema({
  user:    { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  text:    { type: String, required: true, maxlength: 500 },
}, { timestamps: true });

const noteSchema = new mongoose.Schema({
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  title:  { type: String, required: true, maxlength: 100 },
  body:   { type: String, required: true, maxlength: 2000 },
  location: {
    type:        { type: String, enum: ['Point'], default: 'Point' },
    coordinates: { type: [Number], required: true }, // [lng, lat]
    name:        { type: String, default: '' },       // human-readable place name
    isExact:     { type: Boolean, default: true },    // exact vs approximate
  },
  tags:     [{ type: String, trim: true, maxlength: 30 }],
  likes:    [{ type: mongoose.Schema.Types.ObjectId, ref: 'User' }],
  comments: [commentSchema],
  isPublic: { type: Boolean, default: true },
}, { timestamps: true });

noteSchema.index({ location: '2dsphere' });

// Virtual for like count
noteSchema.virtual('likesCount').get(function() {
  return this.likes.length;
});

noteSchema.set('toJSON', { virtuals: true });

export default mongoose.model('Note', noteSchema);