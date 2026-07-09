const mongoose = require('mongoose');
const reviewSchema = require('./Reviews');

const doctorSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Doctor must belong to a user'],
      unique: true,
    },
    name: {
      type: String,
      required: [true, 'Please provide a doctor name'],
      trim: true,
    },
    specialization: {
      type: String,
      required: [true, 'Please provide a specialization'],
      trim: true,
    },
    qualification: {
      type: String,
      required: [true, 'Please provide a qualification'],
      trim: true,
    },
    experience: {
      type: Number,
      required: [true, 'Please provide years of experience'],
      min: [0, 'Experience cannot be negative'],
    },
    rating: {
      type: Number,
      default: 0,
      min: [0, 'Rating must be at least 0'],
      max: [5, 'Rating must be at most 5'],
    },
    profileImage: {
      type: String,
      default: 'default.jpg',
    },

    // 🆕 Availability config — used to generate bookable slots
    availability: {
      workingDays: {
        type: [String],
        enum: [
          'Saturday',
          'Sunday',
          'Monday',
          'Tuesday',
          'Wednesday',
          'Thursday',
          'Friday',
        ],
        default: [],
      },
      startTime: {
        type: String, // "09:00" (24h format)
        required: [true, 'Please provide a daily start time'],
        match: [
          /^([01]\d|2[0-3]):([0-5]\d)$/,
          'startTime must be in HH:mm format',
        ],
      },
      endTime: {
        type: String, // "17:00"
        required: [true, 'Please provide a daily end time'],
        match: [
          /^([01]\d|2[0-3]):([0-5]\d)$/,
          'endTime must be in HH:mm format',
        ],
      },
      slotDuration: {
        type: Number, // minutes
        default: 30,
        min: [5, 'Slot duration must be at least 5 minutes'],
      },
    },
  },
  {
    timestamps: { createdAt: true, updatedAt: false },
  },
);

doctorSchema.index({ specialization: 1 });
doctorSchema.index({ rating: -1 });

// Validate startTime < endTime
doctorSchema.pre('validate', function (next) {
  if (this.availability?.startTime && this.availability?.endTime) {
    if (this.availability.startTime >= this.availability.endTime) {
      return next(
        new Error('availability.startTime must be before availability.endTime'),
      );
    }
  }
  next();
});

const Doctor = mongoose.model('Doctor', doctorSchema);
module.exports = Doctor;
