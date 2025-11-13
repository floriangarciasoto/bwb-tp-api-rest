// Ajout d'Express (Express n'est pas déclaré globalement dans l'application,
// il faut l'ajouter pour chaque fichier JS qui en a besoin)
const express = require("express");
// AJout d'un routeur Express, nécessaire pour faire nos routes en utilisant les fonctionnalités d'Express
const router = express.Router();

// Déclaration de nos routes (une seule dans le cas présent puisque l'application marche sur une seule URL)
const ROUTES = {
    PRODUCTS: "/products"
};

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

// * Affichage des produits *
// URL : /products
// Méthode GET -> l'utilisateur demande seulement la liste des produits
// => C'est la méthode utilisée pour l'affichage de données
router.get(ROUTES.PRODUCTS, (req, res) => {
    res.send("Liste de tous les produits");
});

// * Ajout d'un produit *
// URL : /products
// Méthode POST -> l'utilisateur va envoyer des données pour ajouter un produit
// => C'est la méthode utilisée pour la création de données
router.post(ROUTES.PRODUCTS, (req, res) => {
    res.send("Création d\'un produit");
});

// * Affichage d'un produit en particulier *
// URL : /products/:id
// Méthode GET : pareil que l'affichage de la liste des produits,
// l'utilisateur ne demande que l'affichage d'informations, ici les détails d'un produit
router.get(`${ROUTES.PRODUCTS}/:id`, (req, res) => {
    res.send(`Récupération du produit ${req.params.id}`);
});

// * Modification d'un produit en particulier *
// URL : /products/:id
// Méthode PUT : l'utilisateur va vouloir modifier les informations d'un produit en particulier
// => C'est la méthode utilisée pour la modification de données précises
router.put(`${ROUTES.PRODUCTS}/:id`, (req, res) => {
    res.send(`Modification du produit ${req.params.id}`);
});

// * Suppression d'un produit en particulier *
// URL : /products/:id
// Méthode DELETE : l'utilisateur va vouloir supprimer produit en particulier
// => C'est la méthode utilisée pour la suppression de données précises
router.delete(`${ROUTES.PRODUCTS}/:id`, (req, res) => {
    res.send(`Suppression du produit ${req.params.id}`);
});

// On exporte notre router Express (variable router)
module.exports = router;
