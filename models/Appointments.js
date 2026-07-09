const mongoose = require('mongoose');

const appointmentSchema = new mongoose.Schema(
  {
    patientId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
      required: [true, 'Appointment must belong to a patient'],
    },
    doctorId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'Doctor',
      required: [true, 'Appointment must belong to a doctor'],
    },
    date: {
      type: Date,
      required: [true, 'Please provide an appointment date'],
    },
    timeSlot: {
      type: String, // e.g. "09:00-09:30"
      required: [true, 'Please provide a time slot'],
    },
    status: {
      type: String,
      enum: ['pending', 'confirmed', 'completed', 'cancelled'],
      default: 'pending',
    },
    patientDetails: {
      name: { type: String, required: true },
      age: { type: Number, required: true },
      phone: { type: String, required: true },
      reason: { type: String, trim: true },
    },
  },
  { timestamps: { createdAt: true, updatedAt: false } }
);

// Prevents double-booking at the DB level; cancelled appts don't block the slot
appointmentSchema.index(
  { doctorId: 1, date: 1, timeSlot: 1 },
  {
    unique: true,
    partialFilterExpression: { status: { $in: ['pending', 'confirmed'] } },
  }
);

appointmentSchema.index({ patientId: 1, date: -1 });

const Appointment = mongoose.model('Appointment', appointmentSchema);
module.exports = Appointment;