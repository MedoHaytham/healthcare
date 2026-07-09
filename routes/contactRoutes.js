// routes/contactRoutes.js
const express = require('express');
const contactController = require('../controllers/contactController');
const authController = require('../controllers/authController');
const { USER_ROLES } = require('../utils/usersRoles');

const router = express.Router();

// Public — anyone can submit the contact form
router.post('/', contactController.submitContactForm);

// Admin only — manage submitted messages
router.use(authController.protect, authController.restrictTo(USER_ROLES.ADMIN));

router.get('/', contactController.getAllMessages);
router
  .route('/:id')
  .get(contactController.getMessage)
  .patch(contactController.updateMessageStatus)
  .delete(contactController.deleteMessage);

module.exports = router;