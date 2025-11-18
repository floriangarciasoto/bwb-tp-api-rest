// *** Middleware pour gérer l'accès ***

// Fonction de vérification d'authentification user
// On ajoute l'utilisaton de next
module.exports = (req, res, next) => {

    // Ce qui nous permet de passer à la fonction du contrôleur
    next();
}
