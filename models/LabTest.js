const mongoose = require('mongoose');

const labTestSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, 'Please provide a lab test name'],
      trim: true,
      maxlength: [40, 'A lab test name must have at most 40 characters'],
      minlength: [3, 'A lab test name must have at least 3 characters'],
    },
    description: {
      type: String,
      required: [true, 'Please provide a lab test description'],
      trim: true,
      maxlength: [400, 'A lab test description must have at most 400 characters'],
      minlength: [3, 'A lab test description must have at least 3 characters'],
    },
    price: {
      type: Number,
      required: [true, 'Please provide a lab test price'],
      min: [0, 'A lab test price cannot be negative'],
    },
    category: {
      type: String,
      required: [true, 'Please provide a lab test category'],
      trim: true,
      maxlength: [20, 'A lab test category must have at most 20 characters'],
      minlength: [3, 'A lab test category must have at least 3 characters'],
    },
  },
  { timestamps: true }
);

labTestSchema.index({ name: 'text', category: 1 });

const LabTest = mongoose.model('LabTest', labTestSchema);
module.exports = LabTest;