const express = require('express');
const blogController = require('../controllers/blogController');

const router = express.Router();

router.route('/')
  .get(blogController.getAllBlogs)
  // for admin and doctor only
  .post(blogController.addBlog);

router.route('/:id')
  .get(blogController.getBlog)
  // for admin and doctor only
  .patch(blogController.updateBlog)
  .delete(blogController.deleteBlog);

module.exports = router;