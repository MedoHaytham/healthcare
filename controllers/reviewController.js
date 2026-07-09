const Review = require('../models/Reviews');
const handlerFactory = require('./handlerFactory');
const asyncWrapper = require('../utils/asyncWrapper');
const httpStatus = require('../utils/httpStatusText');
const AppError = require('../utils/appError');

// ----------------------------------------------------------------
// Middleware: set medicine (from nested route) & user (from token)
// Never trust these values coming from the client body
// ----------------------------------------------------------------
exports.setMedicineAndUserIds = (req, res, next) => {
  if (!req.body.medicine) req.body.medicine = req.params.medicineId;
  req.body.user = req.user._id;
  next();
};

// ----------------------------------------------------------------
// Get all reviews (supports nested route: /medicines/:medicineId/reviews)
// ----------------------------------------------------------------
exports.getAllReviews = handlerFactory.getAll(Review, ['comment']);

// Get a single review
exports.getReview = handlerFactory.getOne(Review);

// Create a new review — errors like duplicate reviews are handled
// centrally by the error controller (handleDuplicateKeysDB)
exports.createReview = handlerFactory.createOne(Review);

// ----------------------------------------------------------------
// Update review — only the owner can edit their own review
// ----------------------------------------------------------------
exports.updateReview = asyncWrapper(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  if (review.user.toString() !== req.user._id.toString()) {
    return next(new AppError('You are not allowed to edit this review', 403));
  }

  review.comment = req.body.comment ?? review.comment;
  review.rating = req.body.rating ?? review.rating;
  await review.save();

  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { data: review },
  });
});

// ----------------------------------------------------------------
// Delete review — only the owner or an admin can delete it
// ----------------------------------------------------------------
exports.deleteReview = asyncWrapper(async (req, res, next) => {
  const review = await Review.findById(req.params.id);

  if (!review) {
    return next(new AppError('No review found with that ID', 404));
  }

  const { _id, role } = req.user;
  const isOwner = review.user.toString() === _id.toString();

  if (!isOwner && role !== 'admin') {
    return next(new AppError('You are not allowed to delete this review', 403));
  }

  await Review.findByIdAndDelete(req.params.id);

  res.status(204).json({
    status: httpStatus.SUCCESS,
    data: null,
  });
});

// ----------------------------------------------------------------
// Get my own reviews
// ----------------------------------------------------------------
exports.getMyReviews = asyncWrapper(async (req, res, next) => {
  const { _id } = req.user;

  const reviews = await Review.find({ user: _id }).populate('medicine', 'name');

  res.status(200).json({
    status: httpStatus.SUCCESS,
    results: reviews.length,
    data: { reviews },
  });
});

// ----------------------------------------------------------------
// Admin: reviews & ratings stats
// ----------------------------------------------------------------
exports.getReviewsStats = asyncWrapper(async (req, res, next) => {
  const stats = await Review.aggregate([
    {
      $group: {
        _id: null,
        total: { $sum: 1 },
        avgRating: { $avg: '$rating' },
        fiveStars: { $sum: { $cond: [{ $eq: ['$rating', 5] }, 1, 0] } },
        fourStars: { $sum: { $cond: [{ $eq: ['$rating', 4] }, 1, 0] } },
        threeStars: { $sum: { $cond: [{ $eq: ['$rating', 3] }, 1, 0] } },
        twoStars: { $sum: { $cond: [{ $eq: ['$rating', 2] }, 1, 0] } },
        oneStar: { $sum: { $cond: [{ $eq: ['$rating', 1] }, 1, 0] } },
      },
    },
  ]);

  const [result] = stats;

  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: result || {
      total: 0,
      avgRating: 0,
      fiveStars: 0,
      fourStars: 0,
      threeStars: 0,
      twoStars: 0,
      oneStar: 0,
    },
  });
});