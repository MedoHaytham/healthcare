const express = require('express');
const { protect, restrictTo } =require('../controllers/authController');
const { getAvailableSlots, bookAppointment } = require('../controllers/appointmentController');

const router = express.Router();

router.get('/doctors/:doctorId/available-slots', getAvailableSlots);
router.post('/appointments', protect, restrictTo('patient'), bookAppointment);

module.exports = router;