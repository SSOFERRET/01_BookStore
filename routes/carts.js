const express = require('express');
const router = express.Router();
const { addToCart, getCartItems, removeCartItems } = require('./../controllers/CartController');

router.use(express.json());

router.post('', addToCart);
router.get('', getCartItems);
router.delete('/:id', removeCartItems);

module.exports = router;