const express = require('express');
const router = express.Router();
const {getBooks} = require('./../controllers/BookController')

router.use(express.json());

router.get('', getBooks);

module.exports = router;