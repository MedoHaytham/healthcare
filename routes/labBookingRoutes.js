// labBookingRoutes.js
const express = require('express');
const bookingController = require('../controllers/labBookingController');
const authController = require('../controllers/authController');
const { USER_ROLES } = require('../utils/usersRoles');

const router = express.Router();

router.use(authController.protect);

router.get('/my-bookings', bookingController.getMyBookings);
router.post('/', bookingController.createBooking);
router.patch('/:id/cancel', bookingController.cancelBooking);

router.use(authController.restrictTo(USER_ROLES.ADMIN)); 

router.get('/', bookingController.getAllBookings);
router
  .route('/:id')
  .get(bookingController.getBooking)
  .patch(bookingController.updateBookingStatus);

module.exports = router;