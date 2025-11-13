// Ajout de la connexion à la base de données MongoDB en important le module
const mongoose = require("mongoose");

// Création de la structure d'un produit
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    description: { type: String },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, default: 0 },
    createdAt: { type: Date, default: new Date() }
});

// On exporte le modèle de notre produit pour qu'il soit utilisable
// dans le contrôleur lors des opérations avec la base de données.
// En choisissant de mettre "Product", mongoose va automatiquement
// connecter notre schéma à la collection store.products,
// en déduisant son nom en y ajoutant le "s".
module.exports = mongoose.model("Product", productSchema);
