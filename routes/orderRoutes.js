// orderRoutes.js
const express = require('express');
const orderController = require('../controllers/orderController');

const router = express.Router();

// router.use(authController.protect);

router.get('/my-orders', orderController.getMyOrders);
router.post('/', orderController.createOrder);

router.get('/stats', orderController.getOrderStats);
router
  .route('/')
  .get(orderController.getAllOrders);

router
  .route('/:id')
  .get(orderController.getOrder)
  .patch(orderController.updateOrderStatus)
  .delete(orderController.deleteOrder);

module.exports = router;