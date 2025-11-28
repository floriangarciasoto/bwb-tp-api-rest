// Création des routes liées à l'authentification, de la même façon que pour les produits

const express = require('express');
const router = express.Router();

const ROUTES = {
    REGISTER: '/register',
    LOGIN: '/login'
};

const authController = require('../controllers/auth.controller');

router.post(ROUTES.REGISTER,authController.register);
router.post(ROUTES.LOGIN,authController.login);

module.exports = router;
