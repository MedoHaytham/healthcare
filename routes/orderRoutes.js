// orderRoutes.js
const express = require('express');
const orderController = require('../controllers/orderController');
const authController = require('../controllers/authController');
const { USER_ROLES } = require('../utils/usersRoles');

const router = express.Router();

router.use(authController.protect);

router.get('/my-orders', orderController.getMyOrders);
router.post('/', orderController.createOrder);
router.get('/:id', orderController.getOrder);

router.use(authController.restrictTo(USER_ROLES.ADMIN));

router.get('/stats', orderController.getOrderStats);

router.route('/')
  .get(orderController.getAllOrders);

router
  .route('/:id')
  .patch(orderController.updateOrderStatus)
  .delete(orderController.deleteOrder);

module.exports = router;