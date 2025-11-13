// Ajout des modules nodes necéssaires
const express = require("express");
const cors = require("cors");

// Ajout des variables de l'environement local pour obtenir notre port d'écoute
require('dotenv').config();

// Instanciation de l'application
const app = new express();

// Lecture des requêtes POST et PUT en JSON, pour lire les données
// envoyées par l'utilisateur lors de la création et la modification d'article
app.use(express.json());
// Utilisation du CORS permettant d'autoriser les requêtes depuis d'autres domaines
app.use(cors());

// Ajout des routes
const router = require("./routes/product.routes");
// Ajout du port d'écoute à notre application depuis l'env
const PORT = process.env.PORT;

// Montage du routeur sur notre application
app.use('/', router);
// Ouverture du port d'écoute de notre application
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
