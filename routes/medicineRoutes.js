const express = require('express');

const router = express.Router();
const medicinesController = require('../controllers/medicineController');
const reviewRouter = require('./reviewRoutes');
const authController = require('../controllers/authController');
const { USER_ROLES } = require('../utils/usersRoles');

// nested router for reviews
router.use('/:medicineId/reviews', reviewRouter);

router.route('/')
  .get(medicinesController.getAllMedicines)
  .post(
    authController.protect,
    authController.restrictTo(USER_ROLES.ADMIN), 
    medicinesController.addMedicine
  );

router.route('/:id')
  .get(medicinesController.getMedicine)
  .patch(
    authController.protect, 
    authController.restrictTo(USER_ROLES.ADMIN), 
    medicinesController.updateMedicine
  )
  .delete(
    authController.protect, 
    authController.restrictTo(USER_ROLES.ADMIN), 
    medicinesController.deleteMedicine
  );

module.exports = router;