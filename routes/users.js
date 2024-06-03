const express = require('express');
const router = express.Router();
const { join } = require('./../controllers/UserController');

router.use(express.json);

router.post('/join', join);

module.exports = router;