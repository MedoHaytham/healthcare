const mongoose = require('mongoose');

const labBookingSchema = new mongoose.Schema(
  {
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Booking must belong to a user'],
    },
    labTestId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'LabTest',
      required: [true, 'Booking must belong to a lab test'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide a booking date'],
    },
    status: {
      type: String,
      enum: ['booked', 'completed', 'cancelled'],
      default: 'booked',
    },
  },
  { timestamps: true }
);

labBookingSchema.index({ user: 1, date: -1 });

// Populate user and lab test info automatically
labBookingSchema.pre(/^find/, function () {
  this.populate('user', 'name').populate('labTestId', 'name price');
});

const LabBooking = mongoose.model('LabBooking', labBookingSchema);
module.exports = LabBooking;