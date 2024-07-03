const express = require('express');
const router = express.Router();
const { join, login, requestPasswordReset, resetPassword } = require('./../controllers/UserController');

router.use(express.json());

router.post('/join', join);
router.post('/login', login);
router.post('/reset', requestPasswordReset);
router.put('/reset', resetPassword);

module.exports = router;