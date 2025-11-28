// *** Middleware pour gérer l'accès ***

// Ajout des packages nmp nécessaires, on aura besoin uniquement de vérifier la présence de token ou non,
// donc le package JWT pour la gestion des tokens et la clé dans l'env pour vérifier la signature du token
const jwt = require('jsonwebtoken');
require('dotenv').config();

// Fonction de vérification d'authentification user
// On ajoute l'argument next à notre fonction, une variable contenant elle-même une fonction permettant d'invoquer
// le contrôleur qui suit en fonction de la route choisie
module.exports = (req, res, next) => {
    try {
        // On récupère le token de l'utilisateur situé dans le header de la requête de l'utilisateur
        const token = req.headers.authorization;

        // S'il existe et qu'il commence par "Bearer ", c'est que l'on a bien à faire à un token JWT,
        // il faut maintenant vérifier sa validité
        if (token && /^Bearer /.test(token)) {
            // On récupère la clé privée du serveur
            const jwtSecretKey = process.env.JWT_SECRET_KEY;
            
            // Puis on effectue l'opération de vérification, en stockant le résultat de celle ci dans une variable
            // afin de pouvoir décider de quoi faire en fonction
            const verify = jwt.verify(token.replace(/^Bearer /,''),jwtSecretKey);

            // Si la vérification a réussie
            if (verify) {
                // Alors on continue avec la fonction de notre contrôleur
                // en fonction de la route choisie, il s'agit du troisième argument
                // lors de l'ajout de la route au routeur
                next();
            }
        }
        else {
            // S'il n'existe pas de token JWT valide, c'est que l'utilisateur n'est surement pas connecté.
            // On renvoit donc un message d'erreur et on empêche dans cette partie du code que next() soit exécuté,
            // empêchant notre utilisateur non connecté d'accéder aux requêtes necessitantes d'être authentifié.
            res.json({ error: "Vous devez être connecté pour réaliser ce type de requête" });
        }
    } catch (error) {
        // Si la vérification du token a provoqué une erreur, on renvoie ladite erreur à l'utilisateur
        res.json({ error: error });
    }
}
