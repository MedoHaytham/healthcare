/* eslint-disable prefer-arrow-callback */
const mongoose = require('mongoose');

const reviewSchema = new mongoose.Schema({
  comment: {
    type: String,
    required: [true, 'Review can not be empty!'],
    trim: true,
    maxlength: [400, 'A review must have at most 400 characters'],
    minlength: [3, 'A review must have at least 3 characters'],
  },
  rating: {
    type: Number,
    required: [true, 'Please provide a your rating'],
    min: [1, 'rating must be above 1.0'],
    max: [5, 'rating must be below 5.0'],
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'review must belong to a user']
  },
  medicine: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Medicine',
    required: [true, 'review must belong to a medicine']
  }
}, {
  toJSON: { virtuals: true },
  toObject: { virtuals: true },
});

// prevent duplicate review from the same user
reviewSchema.index({ medicine: 1, user: 1 }, { unique: true });

// Populate user and medicine
reviewSchema.pre(/^find/, function () {
  this.populate('user', 'name').populate('medicine', 'name');
});

const Review = mongoose.model('Review', reviewSchema);
module.exports = Review;