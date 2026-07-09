// controllers/contactController.js
const asyncWrapper = require('../utils/asyncWrapper');
const ContactMessage = require('../models/ContactMessages');
const httpStatus = require('../utils/httpStatusText');
const factory = require('./handlerFactory');
const AppError = require('../utils/appError');

// Public: submit a contact form message (no login required)
exports.submitContactForm = asyncWrapper(async (req, res, next) => {
  const { name, email, phone, message } = req.body;

  const contactMessage = await ContactMessage.create({ name, email, phone, message });

  res.status(201).json({
    status: httpStatus.SUCCESS,
    message: 'Your message has been received, we will get back to you soon',
    data: { data: contactMessage },
  });
});

// Admin only: view & manage submitted messages
exports.getAllMessages = factory.getAll(ContactMessage);
exports.getMessage = factory.getOne(ContactMessage);
exports.deleteMessage = factory.deleteOne(ContactMessage);

// Admin only: mark message as read/resolved
exports.updateMessageStatus = asyncWrapper(async (req, res, next) => {
  const { status } = req.body;

  const contactMessage = await ContactMessage.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  );

  if (!contactMessage) {
    return next(new AppError('No message found with that ID', 404));
  }

  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: { data: contactMessage },
  });
});