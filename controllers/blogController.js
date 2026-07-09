const Blog = require('../models/Blogs');
const handlerFactory = require('./handlerFactory');


// Get all blogs
exports.getAllBlogs = handlerFactory.getAll(Blog, ['title', 'category']);

// Get a single blog
exports.getBlog = handlerFactory.getOne(Blog);

// Create new blog
exports.addBlog = handlerFactory.createOne(Blog);

// Update blog
exports.updateBlog = handlerFactory.updateOne(Blog);

// Delete blog
exports.deleteBlog = handlerFactory.deleteOne(Blog);