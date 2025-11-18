const express = require('express');
const router = express.Router();

const ROUTES = {
    CREATE_TOKEN: '/user/generateToken',
    VALIDATE_TOKEN: '/user/validateToken'
};

const userController = require('../controllers/user.controller');

router.post(ROUTES.CREATE_TOKEN,userController.generateToken);
router.post(ROUTES.VALIDATE_TOKEN,userController.validateToken);

module.exports = router;
