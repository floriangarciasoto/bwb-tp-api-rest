// Création des routes liées au panier utilisateur

const express = require('express');
const router = express.Router();

const ROUTES = {
    CART: '/cart'
};

const cartController = require('../controllers/cart.controller');

// On ajoute le middleware d'authentification car il est évident qu'il faut que l'utilisateur
// soit connecté pour qu'il puisse gérer son panier. Dans un autre cas d'utilisation on pourrait
// imaginer que l'on puisse gérer son panier sans être connecté dans un premier temps,
// mais comme dans notre cas on gère l'état des paniers des utilisateurs directement dans MongoDB,
// on force l'utilisateur a être connecté.
const auth = require('./../middlewares/auth');

router.post(ROUTES.CART,auth,cartController.addToCart);
router.get(`${ROUTES.CART}/:userId`,auth,cartController.showCart);
router.delete(ROUTES.CART,auth,cartController.removeFromCart);

module.exports = router;
