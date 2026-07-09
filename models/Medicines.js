const mongoose = require('mongoose');

const medicineSchema = new mongoose.Schema({
  name: {
    type: String,
    required: [true, 'Please provide a your medicine name'],
    trim: true,
    maxlength: [40, 'A medicine name must have at most 40 characters'],
    minlength: [3, 'A medicine name must have at least 3 characters'],
  },
  category: {
    type: String,
    required: [true, 'Please provide a your medicine category'],
    trim: true,
    maxlength: [20, 'A medicine category must have at most 20 characters'],
    minlength: [3, 'A medicine category must have at least 3 characters'],
  },
  description: {
    type: String,
    required: [true, 'Please provide a your medicine description'],
    trim: true,
    maxlength: [400, 'A medicine description must have at most 400 characters'],
    minlength: [3, 'A medicine description must have at least 3 characters'],
  },
  dosage: {
    type: String,
    required: [true, 'Please provide a your medicine dosage'],
    trim: true,
    maxlength: [20, 'A medicine dosage must have at most 20 characters'],
    minlength: [3, 'A medicine dosage must have at least 3 characters'],
  },
  price: {
    type: Number,
    required: [true, 'Please provide a your medicine price'],
    min: [0, 'A medicine price must be at least 0'],
  },
  image: {
    type: String,
    default: 'default.jpg',
    trim: true,
  },
  stock: {
    type: Number,
    required: [true, 'Please provide a your medicine stock'],
    min: [0, 'A medicine stock must be at least 0'],
    default: 0
  },
}, {
  timestamps: true,
  toJSON: { virtuals: true },
  toObject: { virtuals: true }
});

medicineSchema.index({ name: 'text', category: 1 });

medicineSchema.virtual('reviews', {
  ref: 'Review',
  foreignField: 'medicine',
  localField: '_id',
});



const medicine = mongoose.model('Medicine', medicineSchema);
module.exports = medicine;
