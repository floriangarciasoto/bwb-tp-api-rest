// *** Contrôleur user authentification JWT ***

const jwt = require('jsonwebtoken');
require('dotenv').config();

// Ajout du modèle user
const User = require('../models/users');

// Création du contrôleur
const controller = {};

// * Générer un token *
controller.generateToken = (req, res) => {
    try {
        
    } catch (error) {
        console.error(error);
    }
}

// * Valider un token *
controller.validateToken = (req, res) => {
    try {
        
    } catch (error) {
        console.error(error);
    }
}

// Exportation de toutes les fonctions
module.exports = controller;
