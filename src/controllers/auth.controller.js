// *** Contrôleur user authentification JWT ***

// Ajout des packages nmp necéssaires, BCRYPT pour le hashage de mot de passe,
// JWT pour la création de token lors de la connexion et dotenv pour la récupération
// de la clé privée du serveur ainsi que le paramètre d'expiration stockés dans l'env
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
require('dotenv').config();

// Ajout du modèle user, pour pouvoir créer un utilisateur dans la BDD lors de l'inscription
// et récuperer un utilisateur lors de la connexion pour la vérification de mot de passe
const User = require('../models/users');

// * Inscription *
exports.register = async (req, res) => {
    try {
        // On récupère l'email et le mot de passe envoyés via le formulaire d'inscription de l'utilisateur
        const email = req.body.email;
        const password = req.body.password;

        // On configure puis on effectue le hashage du mot de passe.
        // Le hash d'un mot de passe est la signature de celui-ci après l'avoir passé dans un algorithme
        // de cryptographie, rendant la marche arrière impossible sans connaître le mot de passe.
        // Cela permet donc de stocker la vérification du mot de passe de l'utilisateur dans la base de données,
        // sans devoir renseigner directement le mot de passe dans la BDD, pour des raisons de sécurité.
        // -
        // saltRounds permet de paramétrer le niveau de complexité du hash du mot de passe.
        // Détermine le temps que prend un essai de vérification :
        // - trop bas = nombres de tentatives par secondes trop élevées pour un pirate
        // - trop haut = risque de provoquer un ralentissement serveur
        const saltRounds = 10;
        const hash = await bcrypt.hash(password,saltRounds);

        // On récupere un utilisateur avec le même email afin de savoir s'il n'existe pas
        const user = await User.findOne({ email: email });

        // Si un utilisateur est trouvé
        if (user) {
            // Alors on ne peut pas ajouter le nouvel utilisateur à la base de données
            return res.status(400).json({ message: "Un utilisateur avec le même email existe déjà" });
        }
        
        // On ajout alors l'email et le hash du mot de passe de l'utilisateur, pas son mot de passe directement
        await User.create({ email: email, hash: hash });

        // Une fois que l'inscription a fonctionné, on renvoie un message à l'utilisateur
        res.json({ message: "Utilisateur inscrit" });
    } catch (error) {
        // Si l'inscription a provoqué une erreur
        console.error(error);
        // On renvoie un JSON d'erreur avec un code d'erreur côté serveur
        res.status(500).json({ error: "Erreur lors de la création d'un utilisateur" });
    }
}

// * Connexion *
exports.login = async (req, res) => {
    try {
        // On récupère l'email et le mot de passe envoyés via le formulaire de connexion de l'utilisateur
        const email = req.body.email;
        const password = req.body.password;

        // On va chercher l'utilisateur grâce à son identifiant unique en BDD -> c'est à dire son email
        const user = await User.findOne({ email: email });

        // Si une entrée en base de données a été trouvée
        if (user) {
            // On effectue le test de validité du mot de passe. 
            // Le hash stocké en BDD contient déjà le type d'algorithme de cryptographie
            // à utiliser pour procéder à la vérification.
            const passwordTest = await bcrypt.compare(password,user.hash);

            // Si le mot de pass est correct
            if (passwordTest) {
                // On récupère la clé privée du serveur
                const jwtSecretKey = process.env.JWT_SECRET_KEY;
                // Ainsi que le paramètre d'expiration du token
                const jwtExpiresIn = process.env.JWT_EXPIRES_IN;

                // Puis on signe les données de notre utilisateur.
                // Cela va créer une chaîne de caractères représentant le token pour notre utilisateur,
                // c'est ça qu'il devra montrer plus tard à notre serveur pour accéder
                // aux requêtes necéssitantes une authentification.
                const token = jwt.sign(
                    // On renseigne d'abord le contenu sur lequel se baser pour signer,
                    // ici le contenu d'un utilisateur en prenant son ID en BDD et son email
                    { id: user._id, email: user.email },
                    // La clé privée de notre serveur
                    jwtSecretKey,
                    // Puis enfin les paramètres de signature, ici seulement l'expiration du token
                    { expiresIn: jwtExpiresIn }
                );

                // Une fois que la connexion a réussi, on affiche un message à l'utilisateur.
                // On donne aussi dans notre cas le token directement par cette voie.
                // Un navigateur serait lui capable de stocker directement la clé dans un emplacement précis
                // prévu à cet effet, sans besoin d'action necéssaire de la part de l'utilisateur.
                res.json({ message: "Utilisateur connecté", token: token });
            }
            else {
                // Si le test du mot de passe a échoué, c'est que ce dernier est incorrect
                res.status(400).json({ message: "Mot de passe incorrect" });
            }
        }
        else {
            // Si aucun utilisateur n'a été trouvé
            res.status(400).json({ message: "L'utilisateur n'existe pas" });
        }
    } catch (error) {
        // Si la recherche d'un utilisateur en BDD ou la vérification d'erreur a provoqué une erreur
        console.error(error);
        // On renvoie l'erreur à l'utilisateur
        res.status(500).json({ error: "Erreur lors de la connexion de l'utilisateur" });
    }
}
