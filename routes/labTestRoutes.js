const express = require('express');
const labTestController = require('../controllers/labTestController');

const router = express.Router();

router.route('/')
  .get(labTestController.getAllLabTests)
  .post(labTestController.addLabTest);

router.route('/:id')
  .get(labTestController.getLabTest)
  .patch(labTestController.updateLabTest)
  .delete(labTestController.deleteLabTest);

module.exports = router;