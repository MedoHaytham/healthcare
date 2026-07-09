// routes/emergencyContactRoutes.js
const express = require('express');
const emergencyController = require('../controllers/emergencyContactController');

const router = express.Router();

// Public — anyone can view emergency contacts (no login required)
router.get('/', emergencyController.getAllContacts);
router.get('/:id', emergencyController.getContact);

// Admin only — manage the data
// router.use(authController.protect, authController.restrictTo('admin'));

router.post('/', emergencyController.addContact);
router.patch('/:id', emergencyController.updateContact);
router.delete('/:id', emergencyController.deleteContact);

module.exports = router;