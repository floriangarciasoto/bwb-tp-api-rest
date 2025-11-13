// *** Contrôleur de notre application ***
// Ensemble des fonctions permettant de gérer la logique du traitement des données

// Ajout du modèle d'un produit
const Product = require("../models/products");

// * Création d'un produit *
async function createProduct(req, res) {
    try {
        res.send("Création d'un produit");
    } catch (error) {
        console.error(error);
    }
}

// * Récupération de tous les produits *
async function getAllProducts(req, res) {
    try {
        res.send("Liste de tous les produits");
    } catch (error) {
        console.error(error);
    }
}

// * Récupération d'un produit par ID *
async function getProductById(req, res) {
    try {
        res.send(`Récupération du produit ${req.params.id}`);
    } catch (error) {
        console.error(error);
    }
}

// * Mise à jour d'un produit *
async function updateProduct(req, res) {
    try {
        res.send(`Modification du produit ${req.params.id}`);
    } catch (error) {
        console.error(error);
    }
}

// * Suppression d'un produit *
async function deleteProduct(req, res) {
    try {
        res.send(`Suppression du produit ${req.params.id}`);
    } catch (error) {
        console.error(error);
    }
}

// Exportation de toutes les fonctions
module.exports = {
    createProduct,
    getAllProducts,
    getProductById,
    updateProduct,
    deleteProduct
};
