const mongoose = require('mongoose');

const blogSchema = new mongoose.Schema({
  title: {
    type: String,
    required: [true, 'Please provide a your blog title'],
    trim: true,
    maxlength: [40, 'A blog title must have at most 40 characters'],
    minlength: [3, 'A blog title must have at least 3 characters'],
  },
  content: {
    type: String,
    required: [true, 'Please provide a your blog content'],
    trim: true,
    minlength: [50, 'Blog content must have at least 50 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a your blog category'],
    trim: true,
    maxlength: [20, 'A blog category must have at most 20 characters'],
    minlength: [3, 'A blog category must have at least 3 characters'],
  },
  authorId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'blog must belong to an author']
  },
  coverImage: {
    type: String,
    default: 'default.jpg',
    trim: true,
  },
},{
  timestamps: true,
});

blogSchema.index({ category: 1, createdAt: -1 });

const Blog = mongoose.model('Blog', blogSchema);
module.exports = Blog;