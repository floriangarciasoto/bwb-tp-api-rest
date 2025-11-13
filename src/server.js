// Ajout des modules nodes necéssaires
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

// Ajout des variables de l'environement local pour obtenir notre port d'écoute
require("dotenv").config();

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

// ** Connexion à MongoDB **
// C'est une connexion à un serveur, donc un processus qui peut prendre du temps -> la fonction est asynchrone
async function connectDB() {
    try {
        // Connexion à la base de données "store" dans MongoDB
        await mongoose.connect("mongodb://127.0.0.1:27017/store");

        console.log("MongoDB connecté");
    } catch (error) {
        console.error("Erreur de connexion MongoDB", error);
        
        // On arrête complètement l'exécution du serveur Node.js si la connexion à MongoDB n'a pas pu s'effectuer,
        // inutile de continuer l'exécutuon du serveur
        process.exit(1);
    }
}
connectDB();

// Montage du routeur sur notre application
app.use("/", router);
// Ouverture du port d'écoute de notre application
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
