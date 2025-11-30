// Ajout des modules nodes necéssaires
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');


// Ajout des variables de l'environement local pour obtenir notre port d'écoute
require('dotenv').config();

// Instanciation de l'application
const app = new express();

// Lecture des requêtes POST et PUT en JSON, pour lire les données
// envoyées par l'utilisateur lors de la création et la modification d'article
app.use(express.json());
// Utilisation du CORS permettant d'autoriser les requêtes depuis d'autres domaines
app.use(cors());

// Mise en place de la convertion du corps brut de la requête en objet JavaScript lisible,
// permettant de récuperer le JSON envoyé par le navigateur de l'utilisateur
const bodyParser = require('body-parser');
app.use(bodyParser.urlencoded({extended: true}));

// Ajout du port d'écoute à notre application depuis l'env
const PORT = process.env.PORT;


// ** Système de logs **

// Ajout de Morgan, permettant de loger l'activité HTTP du serveur
const morgan = require('morgan');
// Ajout de RFS pour un système de logs sur fichiers logs access et error
// Cela va permettre de séparer les logs en fonction des jours et/ou d'une taille limite
const rfs = require('rotating-file-stream');
// Permet d'interagir avec le file system du serveur, permettant d'accéder au dossier des logs depuis node
const path = require('path');

// Obtention du chemin du dossier des logs
const logDirectory = path.join(__dirname, 'logs');

// Stream pour les logs d'accès
const accessLogStream = rfs.createStream(
    // Nom du fichier log
    'access.log',
    {
        // Rotation quotidienne
        interval: '1d',
        // Rotation si +10 Mo (optionnel)
        size: '10M',
        // Au chemin spécifié
        path: logDirectory
    }
);

// Stream pour les logs d’erreurs (status >= 400)
const errorLogStream = rfs.createStream('error.log', {
    interval: '1d',
    size: '10M',
    path: logDirectory
});

// Morgan : logs dans la console
app.use(morgan('dev'));

// Morgan : logs accès → access.log
// On précise à Morgan d'envoyer ses logs dans les fichiers, via le stream que l'on a défini
app.use(morgan('combined', { stream: accessLogStream }));

// Morgan : logs erreurs → error.log
// Ici on ne stocke que les erreurs HTTP, on filtre donc sur le code de statut de la réponse de la page
app.use(
    morgan('combined', {
        skip: (req, res) => res.statusCode < 400,
        stream: errorLogStream
    })
);


// ** Connexion à MongoDB **

// C'est une connexion à un serveur, donc un processus qui peut prendre du temps -> la fonction est asynchrone
async function connectDB() {
    try {
        // Connexion à la base de données 'store' dans MongoDB
        await mongoose.connect('mongodb://localhost:27017/store');

        console.log("MongoDB connecté");
    } catch (error) {
        console.error("Erreur de connexion MongoDB", error);
        
        // On arrête complètement l'exécution du serveur Node.js si la connexion à MongoDB n'a pas pu s'effectuer,
        // inutile de continuer l'exécutuon du serveur
        process.exit(1);
    }
}
connectDB();


// Montage des routeurs sur notre application
const productRouter = require('./routes/product.routes');
const authRouter = require('./routes/auth.routes');
const cartRouter = require('./routes/cart.routes');
app.use('/', productRouter);
app.use('/', authRouter);
app.use('/', cartRouter);

// Ouverture du port d'écoute de notre application
app.listen(PORT, () => {
    console.log(`Serveur lancé sur http://localhost:${PORT}`);
});
