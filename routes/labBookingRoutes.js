// labBookingRoutes.js
const express = require('express');
const bookingController = require('../controllers/labBookingController');

const router = express.Router();

// router.use(authController.protect); // login

router.get('/my-bookings', bookingController.getMyBookings);
router.post('/', bookingController.createBooking);
router.patch('/:id/cancel', bookingController.cancelBooking);

// router.use(authController.restrictTo('admin')); //  admin

router.get('/', bookingController.getAllBookings);
router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBookingStatus);

module.exports = router;