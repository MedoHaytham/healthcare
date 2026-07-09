const mongoose = require('mongoose');
const Doctor = require('../models/Doctors');
const Appointment = require('../models/Appointments');
const { generateDaySlots, getDayName } = require('../utils/slotGenerator');
const AppError = require('../utils/appError');

exports.getAvailableSlots = async (req, res, next) => {
  try {
    const { doctorId } = req.params;
    const { date } = req.query;

    if (!date) return next(new AppError('Please provide a date', 400));

    const requestedDate = new Date(date);
    if (Number.isNaN(requestedDate) || requestedDate < new Date().setHours(0, 0, 0, 0)) {
      return next(new AppError('Please provide a valid, future date', 400));
    }

    const doctor = await Doctor.findById(doctorId).select('availability name');
    if (!doctor) return next(new AppError('No doctor found with that ID', 404));

    const dayName = getDayName(requestedDate);
    if (!doctor.availability.workingDays.includes(dayName)) {
      return res.status(200).json({
        status: 'success',
        data: { date, dayName, availableSlots: [] },
        message: `Dr. ${doctor.name} is not available on ${dayName}`,
      });
    }

    // All theoretically possible slots for that day
    const allSlots = generateDaySlots(doctor.availability);

    // Slots already taken (pending/confirmed only — matches the partial index)
    const startOfDay = new Date(requestedDate).setHours(0, 0, 0, 0);
    const endOfDay = new Date(requestedDate).setHours(23, 59, 59, 999);

    const bookedAppointments = await Appointment.find({
      doctorId,
      date: { $gte: startOfDay, $lte: endOfDay },
      status: { $in: ['pending', 'confirmed'] },
    }).select('timeSlot');

    const bookedSlots = new Set(bookedAppointments.map((a) => a.timeSlot));
    const availableSlots = allSlots.filter((slot) => !bookedSlots.has(slot));

    res.status(200).json({
      status: 'success',
      data: { date, dayName, availableSlots },
    });
  } catch (err) {
    next(err);
  }
};


exports.bookAppointment = async (req, res, next) => {
  const session = await mongoose.startSession();

  try {
    const { doctorId, date, timeSlot, patientDetails } = req.body;
    const patientId = req.user._id; // from protect middleware

    if (!doctorId || !date || !timeSlot) {
      return next(new AppError('doctorId, date and timeSlot are required', 400));
    }

    const requestedDate = new Date(date);
    if (Number.isNaN(requestedDate) || requestedDate < new Date().setHours(0, 0, 0, 0)) {
      return next(new AppError('Please provide a valid, future date', 400));
    }

    const doctor = await Doctor.findById(doctorId).select('availability name');
    if (!doctor) return next(new AppError('No doctor found with that ID', 404));

    const dayName = getDayName(requestedDate);
    if (!doctor.availability.workingDays.includes(dayName)) {
      return next(new AppError(`Doctor is not available on ${dayName}`, 400));
    }

    const validSlots = generateDaySlots(doctor.availability);
    if (!validSlots.includes(timeSlot)) {
      return next(new AppError('Invalid time slot for this doctor', 400));
    }

    let appointment;

    await session.withTransaction(async () => {
      // Double-check availability inside the transaction to shrink the race window
      const existing = await Appointment.findOne({
        doctorId,
        date: requestedDate,
        timeSlot,
        status: { $in: ['pending', 'confirmed'] },
      }).session(session);

      if (existing) {
        throw new AppError('This slot was just booked. Please choose another.', 409);
      }

      const created = await Appointment.create(
        [
          {
            patientId,
            doctorId,
            date: requestedDate,
            timeSlot,
            patientDetails,
            status: 'pending',
          },
        ],
        { session }
      );

      appointment = created[0];
    });

    res.status(201).json({
      status: 'success',
      message: 'Appointment booked successfully. Awaiting confirmation.',
      data: { appointment },
    });
  } catch (err) {
    // Belt-and-suspenders: catch the unique index violation too,
    // in case two requests raced past the pre-check simultaneously
    if (err.code === 11000) {
      return next(new AppError('This slot was just booked. Please choose another.', 409));
    }
    next(err);
  } finally {
    session.endSession();
  }
};