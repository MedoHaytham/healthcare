// routes/emergencyContactRoutes.js
const express = require('express');
const emergencyController = require('../controllers/emergencyContactController');
const authController = require('../controllers/authController');
const { USER_ROLES } = require('../utils/usersRoles');

const router = express.Router();

router.route('/')
  .get(emergencyController.getAllContacts)
  .post(
    authController.protect,
    authController.restrictTo(USER_ROLES.ADMIN),
    emergencyController.addContact
  );

router.use(authController.protect, authController.restrictTo(USER_ROLES.ADMIN));

router.route('/:id')
  .get(emergencyController.getContact)
  .patch(emergencyController.updateContact)
  .delete(emergencyController.deleteContact);

module.exports = router;