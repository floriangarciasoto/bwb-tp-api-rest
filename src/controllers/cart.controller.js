// *** Contrôleur pour la gestion du panier d'achat d'un utilisateur ***

// Etant donné que le projet de base fait référence à une API REST, l'implémentation d'un
// panier d'achat n'est pas réaliste dans la façon de procéder à l'ajout et à la suppression de produit.
// On va faire simple pour cette implémentation en permettant l'ajout d'un produit
// en fournissant les ID user et product par le body de la requête de l'utilisateur (qu'il aurait déclenché au clic).

// Ajout du modèle user pour gérer son panier via sa propriété cart
const User = require('../models/users');
// On va aussi prendre le modèle d'un produit afin de faire de la vérification et de l'ajout de détails de produit
const Product = require('../models/products');

// * Ajout d'un produit dans le panier *
exports.addToCart = async (req, res) => {
    try {
        // On récupère les ID de l'user et du produit pour pouvoir ajouter le produit que l'on veut
        // dans le panier de l'utilisateur que l'on veut
        const userId = req.body.userId;
        const productId = req.body.productId;

        // On récupère notre utilisateur pour avoir son panier
        const user = await User.findById(userId);

        // Si l'ID de l'utilisateur fournit n'existe pas
        if (!user) {
            // On renvoit une erreur 404 car l'utilisateur n'a pas été trouvé
            return res.status(404).json({ message: "L'utilisateur n'existe pas" });
        }

        // Il faut alors vérifier dans un premier temps si l'ID fournit
        // par l'utilisateur correspond à un produit existant.
        // On alors cherche le produit dans MongoDB avec son ID.
        const product = await Product.findById(productId);

        // Si le produit fournit par l'utilisateur n'existe pas en base de données
        if (!product) {
            // On renvoit à l'utilisateur que le produit qu'il souhaite ajouter n'existe pas
            return res.status(404).json({ message: "Le produit à ajouter au panier n'existe pas" });
        }

        // Pour pouvoir ajouter un produit, il faut qu'il soit en stock.
        // Si la quantité du produit à ajouter est nulle
        if (product.quantity === 0) {
            // On renvoit à l'utilisateur un message d'erreur de type 401 : Non autorisé
            return res.status(401).json({ message: "Le produit à ajouter au panier n'est plus en stock" });
        }

        // On décrémente dans un premier temps la quantité du produit à ajouter
        product.quantity--;

        // On cherche si un produit avec le même ID est déjà présent dans le panier
        // On utilise la méthode .equals() sur l'ID du produit afin de pouvoir comparer la valeur
        // de l'ObjectID en base de données avec la valeur de la chaîne de caractères fournie par l'utilisateur
        const productFromCart = user.cart.find(i => i.productId.equals(productId));

        // Si c'est le cas
        if (productFromCart) {
            // Alors on incrémente sa quantité
            productFromCart.quantity += 1;
        } else {
            // Sinon, on a alors un nouveau produit à ajouter au panier.
            user.cart.push({ productId: productId });
        }

        // Puis on sauvegarde l'état des objets en base de données, afin que les modifications faites
        // aux objets user et product issus des modèles User et Product soient enregistrées dans MongoDB
        await user.save();
        await product.save();
        
        // On peut enfin afficher un message de succés à l'utilisateur
        res.json({ message: "Produit ajouté au panier avec succés" });
    } catch (error) {
        // Si l'ajout d'un produit au panier a provoqué une erreur
        console.error(error);
        // On renvoie un JSON d'erreur avec un code d'erreur côté serveur
        res.status(500).json({ error: "Erreur lors de l'ajout d'un produit au panier" });
    }
}

// * Affichage d'un panier *
exports.showCart = async (req, res) => {
    try {
        // On récupère l'ID de l'utilsateur via les paramètres GET de la requête /cart/:userId,
        // (normalement stocké dans la session de l'utilisateur dans un cas concret d'application web)
        const userId = req.params.userId;

        // On sélectionne l'user dans MongoDB par l'ID
        // C'est à ce moment-là que l'on va pouvoir utiliser la puissance des liaisons de modèles avec mongoose.
        // On utilise la méthode .populate("cart.productId") afin de demander à mongoose d'aller chercher les données
        // du produit dans la collection produtcs, par l'ID contenu dans le produit du panier cart.productId.
        // A ce moment-là productId ne sera plus un ObjectID mais directement l'objet du produit correspondant.
        const user = await User.findById(userId).populate('cart.productId');

        // Si l'ID de l'utilisateur fournit n'existe pas
        if (!user) {
            // On renvoit une erreur 404 car l'utilisateur n'a pas été trouvé
            return res.status(404).json({ message: "L'utilisateur n'existe pas" });
        }

        // Optionnel : on peut faire un mapping pour modifier les données du panier à renvoyer pour
        // ne montrer que ce qui est intéressant de savoir dans son panier (pas besoin de savoir à
        // ce moment-là le stock de chaque produit par exemple)
        const cart = user.cart.map(item => ({
            name: item.productId.name,
            description: item.productId.description,
            price: item.productId.price,
            category: item.productId.category,
            quantity: item.quantity
        }));

        // Puis on renvoit le panier que l'on a stocké dans la constante cart (qui est déjà un objet JSON)
        res.json(cart);
    } catch (error) {
        // Si l'ajout d'un produit au panier a provoqué une erreur
        console.error(error);
        // On renvoie un JSON d'erreur avec un code d'erreur côté serveur
        res.status(500).json({ error: "Erreur lors de l'ajout d'un produit au panier" });
    }
}

// * Suppression d'un produit dans le panier *
exports.removeFromCart = async (req, res) => {
    try {
        // On récupère l'ID de l'utilisateur ainsi que l'ID du produit à supprimer
        // de la même façon que l'ajout d'un produit
        const userId = req.body.userId;
        const productId = req.body.productId;

        // On récupère l'user depuis MongoDB avec son ID
        const user = await User.findById(userId);

        if (!user) {
            // On renvoit une erreur 404 car l'utilisateur n'a pas été trouvé
            return res.status(404).json({ message: "L'utilisateur n'existe pas" });
        }

        // Il faut alors vérifier dans un premier temps si l'ID fournit
        // par l'utilisateur correspond à un produit existant.
        // On alors cherche le produit dans MongoDB avec son ID.
        const product = await Product.findById(productId);

        // Si le produit fournit par l'utilisateur n'existe pas en base de données
        if (!product) {
            // On renvoit à l'utilisateur que le produit qu'il souhaite ajouter n'existe pas
            return res.status(404).json({ message: "Le produit à supprimer n'existe pas" });
        }

        // On va contrôler la suppression d'un produit du panier ou non
        let productNotFoundInCart = true;

        // Pour chaque produit dans le panier
        user.cart.forEach(productFromCart => {
            // Si l'ID du produit correspond à celui que l'on veut supprimer
            if (productFromCart.productId.equals(productId)) {
                // Alors on décrémente sa quantité
                productFromCart.quantity--;
                // Puis on incrémente le stock du produit
                product.quantity++;
                // On peut dire que le produit à supprimer du panier a été trouvé
                productNotFoundInCart = false;
            }
        });

        // Si le produit à supprimer n'a pas été trouvé dans le panier
        if (productNotFoundInCart) {
            // Alors on renvoi un message d'erreur à l'utilisateur
            return res.status(404).send({ error: "Le produit à supprimer n'a pas été trouvé dans le panier" });
        }

        // Après ça, on applique un filtre sur tous les produits du panier,
        // afin de suprimmer les produits avec une quantité de 0.
        // Donc avec cette condition de filtrage seul les produits
        // avec une quantité supérieure à 0 seront conservés.
        user.cart = user.cart.filter(product => product.quantity > 0);

        // On sauvegarde l'état du panier et du produit en base de données
        await user.save();
        await product.save();

        // Puis on affiche un message de succès
        res.json({ message: "Produit retiré du panier avec succés" });
    } catch (error) {
        // Si la suppression d'un produit au panier a provoqué une erreur
        console.error(error);
        // On renvoie l'erreur à l'utilisateur
        res.status(500).json({ error: "Erreur lors de la suppression d'un produit au panier" });
    }
}
