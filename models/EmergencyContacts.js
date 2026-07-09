const mongoose = require('mongoose');

const emergencyContactSchema = new mongoose.Schema({
  type: {
    type: String,
    enum: ['ambulance', 'blood_bank', 'hospital', 'police'],
    required: [true, 'Please provide a your emergency contact type'],
    trim: true,
  },
  name: {
    type: String,
    required: [true, 'Please provide a your emergency contact name'],
    trim: true,
    maxlength: [40, 'A emergency contact name must have at most 40 characters'],
    minlength: [3, 'A emergency contact name must have at least 3 characters'],
  },
  phone: {
    type: String,
    required: [true, 'Please provide a your emergency contact phone'],
  },
  address: {
    type: String,
    required: [true, 'Please provide a your emergency contact address'],
    trim: true,
    maxlength: [100, 'A emergency contact address must have at most 100 characters'],
    minlength: [3, 'A emergency contact address must have at least 3 characters'],
  },
  location: {
    type: {
      type: String,
      enum: ['Point'],
      default: 'Point',
    },
    coordinates: {
      type: [Number],
      required: [true, 'Please provide a your emergency contact coordinates'],
    },
  },
});

// create index for location
emergencyContactSchema.index({ type: 1 });
emergencyContactSchema.index({ location: '2dsphere' });

const EmergencyContact = mongoose.model('EmergencyContact', emergencyContactSchema);
module.exports = EmergencyContact;