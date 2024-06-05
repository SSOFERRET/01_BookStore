const express = require('express');
const router = express.Router();
const conn = require('./../mariadb');

router.use(express.json());

router.get('/books')

module.exports = router;