const Medicine = require('../models/Medicines');
const handlerFactory = require('./handlerFactory');


// Get all medicines
exports.getAllMedicines = handlerFactory.getAll(Medicine, ['name', 'category']);

// Get a single medicine
exports.getMedicine = handlerFactory.getOne(Medicine, 'reviews');

// Create new Medicine
exports.addMedicine = handlerFactory.createOne(Medicine);

// Update Medicine
exports.updateMedicine = handlerFactory.updateOne(Medicine);

// Delete Medicine
exports.deleteMedicine = handlerFactory.deleteOne(Medicine);