const LabTest = require('../models/LabTest');
const handlerFactory = require('./handlerFactory');


// Get all lab tests
exports.getAllLabTests = handlerFactory.getAll(LabTest, ['name', 'category']);

// Get a single lab test
exports.getLabTest = handlerFactory.getOne(LabTest);

// Create new lab test
exports.addLabTest = handlerFactory.createOne(LabTest);

// Update lab test
exports.updateLabTest = handlerFactory.updateOne(LabTest);

// Delete lab test
exports.deleteLabTest = handlerFactory.deleteOne(LabTest);