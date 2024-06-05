const express = require('express');
const router = express.Router();
const { getBooks, getBookDetail} = require('./../controllers/BookController')

router.use(express.json());

router.get('', getBooks);
router.get('/:id', getBookDetail);

module.exports = router;