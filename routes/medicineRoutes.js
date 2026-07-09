const express = require('express');

const router = express.Router();
const medicinesController = require('../controllers/medicineController');
const reviewRouter = require('./reviewRoutes');

// nested router for reviews
router.use('/:medicineId/reviews', reviewRouter);

router.route('/')
  .get(medicinesController.getAllMedicines)
  .post(medicinesController.addMedicine);

router.route('/:id')
  .get(medicinesController.getMedicine)
  .patch(medicinesController.updateMedicine)
  .delete(medicinesController.deleteMedicine);

module.exports = router;