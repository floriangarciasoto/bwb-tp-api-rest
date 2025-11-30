// *** Contrôleur de notre application ***
// Ensemble des fonctions permettant de gérer la logique du traitement des données

// Ajout du modèle d'un produit
const Product = require('../models/products');

// Ajout des vues produits
const productListView = require('../view/product/productListView');
const createProductView = require('../view/product/createProductView');

/**
 * Renvoie une liste paginée de produits depuis la base de données.
 *
 * @param {number} page - numéro de la page (>= 1)
 * @returns {Promise<Product[]>} - tableau de documents Product correspondant à la page demandée
 */
async function getAllProductsFromDB(page) {
    // On évite les pages négatives (ça n'existe pas :) )
    if (page < 1) page = 1;
    // On met une limite arbitraire à 10 éléments par page
    const limit = 10;

    // On détermine l'offset des produits, correspondants à ceux des pages d'avant
    const offset = (page - 1) * limit;

    // Puis on applique le filtrage lors de la recherche en base de données
    // On applique des méthodes en chaine sur le Query object renvoyé par .find()
    return await Product.find().skip(offset).limit(limit);
}

// * Création d'un produit *
exports.createProduct = async (req, res) => {
    try {
        // Si l'ajout d'une entrée en base de données a fonctionné, on renvoit un statut de réussite (20X),
        // ici le statut 201 qui correspond à la réussite de création.
        // En plus du statut, on renvoit en format JSON le retour de la méthode .create(),
        // qui retourne automatiquement le JSON envoyé en paramètre, soit dans le cas présent
        // le body de la requête, vu que notre application nous permet d'envoyer directement du JSON à notre serveur.
        res.status(201).json(await Product.create(req.body));
    } catch (error) {
        // Si l'ajout a échoué
        console.error(error);
        // On renvoit un JSON contenant l'erreur correspondante.
        // Comme notre application est une API, il est convenu d'emettre les réponses de celle-ci en JSON.
        res.status(500).json({ error: "Erreur lors de la création du produit" });
    }
}

// * Ajout d'un produit via formulaire HTML *
exports.showProductForm = (req, res) => {
    try {
        // On renvoi à l'utilisateur la vue correspondante à l'affichage
        // d'un formulaire HTML permettant d'ajouter un produit
        res.send(createProductView(req));
    } catch (error) {
        // Si l'affichage de la vue a produit une erreur
        console.error(error);
        // on renvoi à l'utilisateur l'erreur correspondante
        res.status(500).json({ error: error });
    }
}

// * Récupération de tous les produits - Affichage JSON *
exports.getAllProducts = async (req, res) => {
    try {
        // On récupère le numéro de la page demandé par l'utilisateur, via les paramètres query de la requête,
        // par défaut la première page si "&p=" n'est pas présent dans l'URL
        const page = parseInt(req.query.p) || 1;

        // Puis on récupère les produits avec la fonction correspondante
        const products = await getAllProductsFromDB(page);

        // Et on renvoit le résultat à l'utilisateur
        res.json(products);
    } catch (error) {
        // Si la recherche a échouée
        console.error(error);
        // C'est qu'il y a une erreur en base de données, la collection n'existe peut être pas
        // mais c'est une erreur très peu probable.
        res.status(500).json({ error: "Erreur lors de l'affichage des produits" });
    }
}

// * Récupération de tous les produits - Affichage HTML *
exports.getAllProductsView = async (req, res) => {
    try {
        // On récupère le numéro de la page de la même façon
        const page = parseInt(req.query.p) || 1;

        // Pareil pour la récupération des produits correspondant à la page demandée
        const products = await getAllProductsFromDB(page);

        // Sauf que cette fois-ci on renvoi la liste des produits en HTML via la vue correspondante
        res.send(productListView(req,products,page));
    } catch (error) {
        // Si la recherche a échouée
        console.error(error);
        // C'est qu'il y a une erreur en base de données, la collection n'existe peut être pas
        // mais c'est une erreur très peu probable.
        res.status(500).json({ error: "Erreur lors de l'affichage des produits" });
    }
}

// * Récupération d'un produit par ID *
exports.getProductById = async (req, res) => {
    try {
        // On récupere l'ID qui se situe directement dans l'URL
        // Express permet de définir l'ID en tant que paramètre de la requête grâce à la structuration
        // de l'URL en products/:id, la partie ":id" va pouvoir être détachée de l'URL
        const id = req.params.id;

        // On peut donc aller chercher le produit qui nous intéresse en fournissant directement l'ID
        // que l'on a obtenu des paramètres GET, en le passant dans l'argument dans la méthode .findById()
        const product = await Product.findById(id);

        // Si aucun produit n'est trouvé, product sera égal à false
        if (!product) {
            // Dans le cas écheant, cela veut dire que l'on a pas trouvé
            // le produit, on renvoit donc la fameuse erreur 404
            return res.status(404).json({ error: `Le produit avec l'ID ${id} est introuvable` });
        }

        // Si un produit a été trouvé, on peut renvoyer alors directement sa valeur JSON.
        // Pas besoin de préciser le code HTTP 200 (pour indique la réussite de la requête),
        // car c'est celui qui sera renvoyé par défaut lors de l'envoit de la réponse.
        res.json(product);
    } catch (error) {
        // Si la recherche d'un produi a échouée
        console.error(error);
        // C'est que l'ID fournit par l'utilisateur est mal formé, ce qui résulte une Bad Request (erreur 400)
        res.status(400).json({ error: "ID invalide" });
    }
}

// * Mise à jour d'un produit *
exports.updateProduct = async (req, res) => {
    try {
        // On récupere l'ID de la même façon
        const id = req.params.id;

        // On va stocker ici le retour de la méthode .findByIdAndUpdate(),
        // ce qui va nous permettre de faire état de sa réussite ou non.
        const updatedProduct = await Product.findByIdAndUpdate(
            // Cette méthode a deux paramètres necéssaires :
            id, // l'ID de l'entrée à modifier
            req.body, // la valeur JSON contenant les paramètres à remplacer dans l'entrée
    
            // Objet optionnel représentant les options.
            {
                // En précisant new à true, on va demander à la fonction de nous
                // retourner le JSON que l'utilisateur a envoyé,
                // et qui a remplacé l'entrée en base de données.
                new: true,

                // Permet de vérifier les données utilisateur, aussi pour l'opération d'update,
                // par défaut mongoose ne le fait pas.
                runValidators: true
            }
        );

        // Si la mise à jour du produit a échouée
        if (!updatedProduct) {
            // C'est que l'ID du produit est introuvable en base de données -> erreur 404
            return res.status(404).json({ error: `Le produit avec l'ID ${id} est introuvable` });
        }

        // Après la mise a jour, on renvoit le JSON du produit lui même, comme on l'avait prévu
        res.json(updatedProduct);
    } catch (error) {
        // Si la mise à jour en base de données a échouée
        console.error(error);
        // C'est que l'ID ou les données transmises par l'utilisateur sont éronées -> 400 Bad Request
        res.status(400).json({ error: "ID invalide ou données incorrectes" });
    }
}

// * Suppression d'un produit *
exports.deleteProduct = async (req, res) => {
    try {
        // On récupere l'ID de la même façon
        const id = req.params.id;

        // On récupère de la même façon que pour la mise à jour le retour
        // de la méthode .findByIdAndDelete(), pour attester de même de sa réussite ou non.
        const deletedProduct = await Product.findByIdAndDelete(id);

        // Si le produit à supprimer n'a pas été trouvé
        if (!deletedProduct) {
            // On renvoit à l'utilisateur que le produit à supprimer est introuvable -> erreur 404
            return res.status(404).json({ error: `Le produit avec l'ID ${id} est introuvable` });
        }

        // Ici on ne renvoit pas le JSON du produit que l'on a supprimé, car ce n'est pas son contenu
        // qui nous intéresse mais uniquement savoir qu'il a bien été supprimé.
        res.json({ message: "Produit supprimé avec succès" });
    } catch (error) {
        // Si le produit n'a pas pu être supprimé en base de données
        console.error(error);
        // Il s'agit surement de l'ID du produit à supprimer qui a mal été formé -> 400 Bad Request
        res.status(400).json({ error: "ID invalide" });
    }
}
