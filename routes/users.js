const express = require('express');
const router = express.Router();
const { join, login } = require('./../controllers/UserController');

router.use(express.json());

router.post('/join', join);
router.get('/login', login);

module.exports = router;