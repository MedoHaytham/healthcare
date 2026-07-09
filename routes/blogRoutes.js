const express = require('express');
const blogController = require('../controllers/blogController');
const authController = require('../controllers/authController');
const { USER_ROLES } = require('../utils/usersRoles');

const router = express.Router();

router.route('/')
  .get(blogController.getAllBlogs)
  .post(
    authController.protect, 
    authController.restrictTo(USER_ROLES.ADMIN, USER_ROLES.DOCTOR), 
    blogController.addBlog
  );

router.route('/:id')
  .get(blogController.getBlog)
  .patch(
    authController.protect, 
    authController.restrictTo(USER_ROLES.ADMIN, USER_ROLES.DOCTOR), 
    blogController.updateBlog
  )
  .delete(
    authController.protect, 
    authController.restrictTo(USER_ROLES.ADMIN, USER_ROLES.DOCTOR), 
    blogController.deleteBlog
  );

module.exports = router;