const asyncWrapper = require('../utils/asyncWrapper');
const LabBooking = require('../models/LabBookings');
const LabTest = require('../models/LabTest');
const httpStatus = require('../utils/httpStatusText');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');
const APIfeatures = require('../utils/apiFeatures');

// ----------------------------------------------------------------
// Admin: list all bookings (filter by status, date range via ?date[gte]=)
// ----------------------------------------------------------------
exports.getAllBookings = asyncWrapper(async (req, res, next) => {
  const features = new APIfeatures(LabBooking.find(), req.query)
    .filter()
    .sort()
    .limitFields();

  const total = await LabBooking.countDocuments(features.query.getFilter());

  features.paginate();
  const doc = await features.query;

  res.status(200).json({
    status: httpStatus.SUCCESS,
    total,
    results: doc.length,
    data: { data: doc },
  });
});

exports.getBooking = handlerFactory.getOne(LabBooking);

// ----------------------------------------------------------------
// User: get my own bookings
// ----------------------------------------------------------------
exports.getMyBookings = asyncWrapper(async (req, res, next) => {
  const { _id } = req.currentUser;

  const bookings = await LabBooking.find({ user: _id }).sort('-date');

  res.status(200).json({
    status: httpStatus.SUCCESS,
    results: bookings.length,
    data: { bookings },
  });
});

// ----------------------------------------------------------------
// Create booking — validates the lab test exists & the date is valid
// ----------------------------------------------------------------
exports.createBooking = asyncWrapper(async (req, res, next) => {
  const { labTestId, date } = req.body;
  const { _id } = req.currentUser;

  const labTest = await LabTest.findById(labTestId);
  if (!labTest) {
    return next(new AppError('No lab test found with that ID', 404));
  }

  const bookingDate = new Date(date);
  if (Number.isNaN(bookingDate.getTime())) {
    return next(new AppError('Please provide a valid date', 400));
  }
  if (bookingDate <= new Date()) {
    return next(new AppError('Booking date must be in the future', 400));
  }

  const booking = await LabBooking.create({
    user: _id,
    labTestId,
    date: bookingDate,
    status: 'booked',
  });

  res.status(201).json({
    status: httpStatus.SUCCESS,
    data: { data: booking },
  });
});

// ----------------------------------------------------------------
// Cancel booking — only the owner can cancel their own pending booking
// ----------------------------------------------------------------
exports.cancelBooking = asyncWrapper(async (req, res, next) => {
  const booking = await LabBooking.findById(req.params.id);

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  const { _id, role } = req.currentUser;
  const isOwner = booking.user.toString() === _id.toString();

  if (!isOwner && role !== 'admin') {
    return next(new AppError('You are not allowed to cancel this booking', 403));
  }

  if (booking.status !== 'booked') {
    return next(new AppError(`This booking is already ${booking.status}`, 400));
  }

  booking.status = 'cancelled';
  await booking.save();

  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { data: booking },
  });
});

// ----------------------------------------------------------------
// Admin: update booking status (e.g. mark as completed)
// ----------------------------------------------------------------
exports.updateBookingStatus = asyncWrapper(async (req, res, next) => {
  const { status } = req.body;

  const booking = await LabBooking.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!booking) {
    return next(new AppError('No booking found with that ID', 404));
  }

  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { data: booking },
  });
});