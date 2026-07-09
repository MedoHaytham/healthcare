// controllers/emergencyContactController.js
const EmergencyContact = require('../models/EmergencyContacts');
const handlerFactory = require('./handlerFactory');

// Public: get all emergency contacts (supports ?type=ambulance)
exports.getAllContacts = handlerFactory.getAll(EmergencyContact);
exports.getContact = handlerFactory.getOne(EmergencyContact);

// Admin only: manage the data
exports.addContact = handlerFactory.createOne(EmergencyContact);
exports.updateContact = handlerFactory.updateOne(EmergencyContact);
exports.deleteContact = handlerFactory.deleteOne(EmergencyContact);