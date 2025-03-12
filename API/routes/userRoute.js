const express = require('express');
const router = express.Router();

const verifyToken = require('../middlewares/token');
const controller = require('../controllers/userController');

router.post('/signup_User', controller.signup_User);
router.post('/login_User', controller.login_User);

//router.get('/get_information_User', verifyToken, controller.get_Information_User);

module.exports = router;