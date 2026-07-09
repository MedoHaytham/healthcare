const asyncWrapper = require('../utils/asyncWrapper');
const Order = require('../models/Orders');
const Medicine = require('../models/Medicines');
const httpStatus = require('../utils/httpStatusText');
const handlerFactory = require('./handlerFactory');
const AppError = require('../utils/appError');
const APIfeatures = require('../utils/apiFeatures');

// ----------------------------------------------------------------
// Helper: validate stock & compute the real price for each item
// NEVER trust price/totalPrice coming from the client
// ----------------------------------------------------------------
const buildOrderItems = async items => {
  if (!Array.isArray(items) || items.length === 0) {
    throw new AppError('Order must contain at least one item', 400);
  }

  const orderItems = await Promise.all(
    items.map(async item => {
      const { medicineId, quantity } = item;

      if (!quantity || quantity < 1) {
        throw new AppError('Each item must have a quantity of at least 1', 400);
      }

      const medicine = await Medicine.findById(medicineId);
      if (!medicine) {
        throw new AppError(`Medicine not found: ${medicineId}`, 404);
      }
      if (medicine.stock < quantity) {
        throw new AppError(`"${medicine.name}" only has ${medicine.stock} left in stock`, 400);
      }

      return { medicineId: medicine._id, quantity, price: medicine.price };
    })
  );

  const totalPrice = orderItems.reduce((sum, { price, quantity }) => sum + price * quantity, 0);

  return { orderItems, totalPrice };
};

// Decrease stock for each item after the order is placed
const decrementStock = items =>
  Promise.all(
    items.map(({ medicineId, quantity }) =>
      Medicine.findByIdAndUpdate(medicineId, { $inc: { stock: -quantity } })
    )
  );

// ----------------------------------------------------------------
// Admin: list all orders (search by billing name/phone, filter by status)
// ----------------------------------------------------------------
exports.getAllOrders = asyncWrapper(async (req, res, next) => {
  const filter = {};

  if (req.query.search) {
    const searchRegex = new RegExp(req.query.search, 'i');
    filter.$or = [
      { 'billingInfo.name': searchRegex },
      { 'billingInfo.phone': searchRegex },
    ];
  }

  const features = new APIfeatures(Order.find(filter), req.query)
    .filter()
    .sort()
    .limitFields();

  const total = await Order.countDocuments(features.query.getFilter());

  features.paginate();
  const doc = await features.query;

  res.status(200).json({
    status: httpStatus.SUCCESS,
    total,
    results: doc.length,
    data: { data: doc },
  });
});

exports.getOrder = handlerFactory.getOne(Order, 'items.medicineId');
exports.deleteOrder = handlerFactory.deleteOne(Order);

// Admin: update order status only (not the full document)
exports.updateOrderStatus = asyncWrapper(async (req, res, next) => {
  const { status } = req.body;

  const order = await Order.findByIdAndUpdate(
    req.params.id,
    { status },
    {
      new: true,
      runValidators: true
    }
  );

  if (!order) return next(new AppError('No order found with that ID', 404));

  res.status(200).json({ status: httpStatus.SUCCESS, data: { data: order } });
});

// ----------------------------------------------------------------
// Admin: revenue & order stats
// ----------------------------------------------------------------
exports.getOrderStats = asyncWrapper(async (req, res, next) => {
  const stats = await Order.aggregate([
    {
      $group: {
        _id: null,
        totalOrders: { $sum: 1 },
        totalRevenue: { $sum: '$totalPrice' },
        pendingOrders: { $sum: { $cond: [{ $eq: ['$status', 'pending'] }, 1, 0] } },
        deliveredOrders: { $sum: { $cond: [{ $eq: ['$status', 'delivered'] }, 1, 0] } },
      },
    },
  ]);

  const [result] = stats;

  res.status(200).json({
    status: httpStatus.SUCCESS,
    data: result || { totalOrders: 0, totalRevenue: 0, pendingOrders: 0, deliveredOrders: 0 },
  });
});

// ----------------------------------------------------------------
// User: get my own orders
// ----------------------------------------------------------------
exports.getMyOrders = asyncWrapper(async (req, res, next) => {
  const { _id } = req.currentUser;

  const orders = await Order.find({ user: _id })
    .populate('items.medicineId', 'name image')
    .sort('-createdAt');

  res.status(200).json({
    status: httpStatus.SUCCESS,
    results: orders.length,
    data: { orders },
  });
});

// ----------------------------------------------------------------
// Create order — server computes price & totalPrice, checks stock,
// and decrements stock immediately (no external payment gateway)
// ----------------------------------------------------------------
exports.createOrder = asyncWrapper(async (req, res, next) => {
  const { items, billingInfo, paymentMethod } = req.body;
  const { _id } = req.currentUser;

  const { orderItems, totalPrice } = await buildOrderItems(items);

  const order = await Order.create({
    user: _id,
    items: orderItems,
    totalPrice,
    billingInfo,
    paymentMethod,
    status: 'pending',
  });

  await decrementStock(orderItems);

  res.status(201).json({
    status: httpStatus.SUCCESS,
    data: { data: order },
  });
});