const { Router } = require('express');
const patientController = require('../controllers/patient');
const orderController = require('../controllers/order');
const paramValidator = require('../middlewares')

const router = Router();

router.get('/patients', paramValidator, patientController.getPatients);
router.get('/patients/:id', paramValidator, patientController.getPatient);
router.post('/patients', paramValidator, patientController.createPatient);
router.put('/patients/:id', paramValidator, patientController.updatePatient);
router.delete('/patients/:id', paramValidator, patientController.deletePatient);

router.get('/orders', paramValidator, orderController.getOrders);
router.get('/orders/:id', paramValidator, orderController.getOrder);
router.post('/patients/:id/orders', paramValidator, orderController.createOrder);
router.put('/orders/:id', paramValidator, orderController.updateOrder);
router.delete('/orders/:id', paramValidator, orderController.deleteOrder);

module.exports = router;