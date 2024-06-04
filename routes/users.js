const express = require('express');
const router = express.Router();
const { join, login, requestPasswordReset, resetPassword } = require('./../controllers/UserController');

router.use(express.json());

router.post('/join', join);
router.get('/login', login);
router.get('/reset', requestPasswordReset);
router.put('/reset', resetPassword);

module.exports = router;