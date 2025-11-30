// Ajout d'Express (Express n'est pas déclaré globalement dans l'application,
// il faut l'ajouter pour chaque fichier JS qui en a besoin)
const express = require('express');
// AJout d'un routeur Express, nécessaire pour faire nos routes en utilisant les fonctionnalités d'Express
const router = express.Router();

// Déclaration de nos routes (une seule dans le cas présent puisque l'application marche sur une seule URL)
const ROUTES = {
    PRODUCTS: '/products',
    PRODUCTS_VIEW: '/products/view',
    PRODUCTS_ADD: '/product/add'
};

// Import du middleware d'authentification
const auth = require('./../middlewares/auth');

// Appel de notre contrôleur
const productController = require('../controllers/product.controller');

// ** Création de la logique de l'application **

// Ici Express nous permet d'utiliser ses méthodes prédéfinies,
// en fonction des méthodes des requêtes de l'utilisateur :
// - .get()
// - .post()
// - .put()
// - .delete()

// Pour chaque méthode, on utilise toujours ROUTES.PRODUCTS (qui est égale à "/products")
// Il s'agit d'un cas exceptionnel car une application gère normalement plusieurs URL,
// dans notre cas on peut se permettre d'utiliser seulement une.

// Express va nous permettre de récuperer l'ID d'un produit grâce à la construction de l'URL
// sous la forme : products/:id => ":id" est la partie dynamique de l'URL,
// Express va donc pouvoir nous délivrer l'ID via req.params.id

// * Ajout d'un produit *
// URL : /products
// Méthode POST -> l'utilisateur va envoyer des données pour ajouter un produit
// => C'est la méthode utilisée pour la création de données
// === Obligation d'être connecté, on ajout donc le middleware entre les deux ===
router.post(ROUTES.PRODUCTS,auth,productController.createProduct);
// Ajout d'un produit via formulaire
router.get(ROUTES.PRODUCTS_ADD,auth,productController.showProductForm);

// * Affichage des produits *
// URL : /products
// Méthode GET -> l'utilisateur demande seulement la liste des produits
// => C'est la méthode utilisée pour l'affichage de données
// === Pour afficher un produit, pas besoin d'être connecté ===
router.get(ROUTES.PRODUCTS,productController.getAllProducts);
// Affichage des produits en HTML
router.get(ROUTES.PRODUCTS_VIEW,productController.getAllProductsView);

// * Affichage d'un produit en particulier *
// URL : /products/:id
// Méthode GET : pareil que l'affichage de la liste des produits,
// l'utilisateur ne demande que l'affichage d'informations, ici les détails d'un produit
router.get(`${ROUTES.PRODUCTS}/:id`,productController.getProductById);

// * Modification d'un produit en particulier *
// URL : /products/:id
// Méthode PUT : l'utilisateur va vouloir modifier les informations d'un produit en particulier
// => C'est la méthode utilisée pour la modification de données précises
router.put(`${ROUTES.PRODUCTS}/:id`,auth,productController.updateProduct);

// * Suppression d'un produit en particulier *
// URL : /products/:id
// Méthode DELETE : l'utilisateur va vouloir supprimer un produit en particulier
// => C'est la méthode utilisée pour la suppression de données précises
router.delete(`${ROUTES.PRODUCTS}/:id`,auth,productController.deleteProduct);

// On exporte notre router Express (variable router)
module.exports = router;
