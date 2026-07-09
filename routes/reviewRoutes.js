const express = require('express');
const reviewController = require('../controllers/reviewController');
// const authController = require('../controllers/authController');

const router = express.Router({ mergeParams: true });

// for login before reviews
// router.use(authController.protect);

router.get('/my-reviews', reviewController.getMyReviews);

// for admin only
router.get('/stats', reviewController.getReviewsStats);

router
  .route('/')
  .get(reviewController.getAllReviews)
  .post(reviewController.setMedicineAndUserIds, reviewController.createReview);

router
  .route('/:id')
  .get(reviewController.getReview)
  .patch(reviewController.updateReview)
  .delete(reviewController.deleteReview);

module.exports = router;