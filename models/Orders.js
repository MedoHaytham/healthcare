const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'order must belong to a user'],
  },
  items: {
    type: [
      {
        medicineId: {
          type: mongoose.Schema.Types.ObjectId,
          ref: 'Medicine',
          required: [true, 'order must belong to a medicine'],
        },
        quantity: {
          type: Number,
          required: [true, 'Please provide a your order quantity'],
          min: [1, 'Order quantity must be at least 1'],
        },
        price: {
          type: Number,
          required: [true, 'Please provide a your order price'],
          min: [0, 'Order price cannot be negative']
        },
      }
    ],
    validate: {
      validator: function(value) {
        return value.length > 0;
      },
      message: 'Please provide a your order items',
    }
  },
  totalPrice: {
    type: Number,
    required: [true, 'Please provide a your order total price'],
    min: [0, 'Order total price cannot be negative']
  },
  billingInfo: {
    name: {
      type: String,
      required: [true, 'Please provide a your billing name'],
    },
    address: {
      type: String,
      required: [true, 'Please provide a your billing address'],
    },
    phone: {
      type: String,
      required: [true, 'Please provide a your billing phone'],
    },
  },
  paymentMethod:{
    type: String,
    required: [true, 'Please provide a your order payment method'],
    enum: ['cod', 'card', 'wallet'],
  },
  status: {
    type: String,
    enum: ['pending', 'paid', 'shipped' , 'delivered'],
    default: 'pending',
  },
}, {
  timestamps: true,
});

orderSchema.index({ user: 1, createdAt: -1 })

const Order = mongoose.model('Order', orderSchema);
module.exports = Order;