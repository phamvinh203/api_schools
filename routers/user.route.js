const express = require('express');
const router = express.Router();

const controller = require('../controllers/user.controller');
const authMiddleware = require('../middlewares/auth.middleware');

router.post('/register', controller.register);

router.post('/login', controller.login);

router.get('/profile', authMiddleware, controller.getProfile);


module.exports = router;

