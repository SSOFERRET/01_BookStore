const express = require('express');
const router = express.Router();
const { proceedOrder, getOrders, getOrderDetail } = require('./../controllers/OrderController')

router.use(express.json());

router.post('', proceedOrder);
router.get('', getOrders);
router.get('/:id', getOrderDetail);

module.exports = router;