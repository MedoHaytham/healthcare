const express = require('express');
const labTestController = require('../controllers/labTestController');
const authController = require('../controllers/authController');
const { USER_ROLES } = require('../utils/usersRoles');

const router = express.Router();

router.route('/')
  .get(labTestController.getAllLabTests)
  .post(
    authController.protect,
    authController.restrictTo(USER_ROLES.ADMIN),
    labTestController.addLabTest
  );

router.route('/:id')
  .get(labTestController.getLabTest)
  .patch(
    authController.protect,
    authController.restrictTo(USER_ROLES.ADMIN),
    labTestController.updateLabTest
  )
  .delete(
    authController.protect,
    authController.restrictTo(USER_ROLES.ADMIN),
    labTestController.deleteLabTest
  );

module.exports = router;