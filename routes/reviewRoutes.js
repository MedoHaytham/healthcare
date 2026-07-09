const express = require('express');
const reviewController = require('../controllers/reviewController');
const authController = require('../controllers/authController');
const { USER_ROLES } = require('../utils/usersRoles');

const router = express.Router({ mergeParams: true });


router.get('/my-reviews', authController.protect, reviewController.getMyReviews);

// for admin only
router.get('/stats', 
  authController.protect, 
  authController.restrictTo(USER_ROLES.ADMIN), 
  reviewController.getReviewsStats
);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(
    authController.protect, 
    authController.restrictTo(USER_ROLES.PATIENT), 
    reviewController.setMedicineAndUserIds, 
    reviewController.createReview
  );

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(
    authController.protect, 
    authController.restrictTo(USER_ROLES.PATIENT), 
    reviewController.updateReview
  )
  .delete(
    authController.protect, 
    authController.restrictTo(USER_ROLES.PATIENT, USER_ROLES.ADMIN), 
    reviewController.deleteReview
  );

module.exports = router;