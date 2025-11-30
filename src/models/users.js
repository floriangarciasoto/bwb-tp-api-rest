// Ajout de mongoose pour la création du modèle d'un utilisateur
const mongoose = require('mongoose');

// Création de la structure d'un user dans MongoDB
// Version très simplifiée avec seulement un identifiant (le mail) et un mot de passe
const userSchema = new mongoose.Schema({
    // Ajout de l'email, obligatoire, pas plus de 100 caractères, mais aussi et surtout UNIQUE.
    // L'email doit pouvoir distinguer clairement un utilisateur d'un autre.
    email: {
        type: String,
        required: true,
        unique: true,
        trim: true,
        minlength: 3,
        maxlength: 100
    },

    // Résultat du mot de passe hashé de l'utilisateur lors de son inscription.
    // En utilisant BCRYPT, on sait exactement la taille que prend le hash d'un mot de passe,
    // on fixe alors la taille exactement à cette limite.
    hash: {
        type: String,
        required: true,
        minlength: 60,
        maxlength: 60
    },

    // Panier d'achat de l'utilisateur représenté par un array d'objets Product
    cart: [
        {
            // ID du produit correspondant exactement à l'ID d'un produit dans la collection products
            productId: {
                // On prend exactement le même type en se référant au type de l'ID d'un produit,
                // en allant le chercher dans la collection en question,
                // vu que l'on se réfere à une propriété ID d'une entrée de MongoDB que l'on a pas défini nous même.
                type: mongoose.Schema.Types.ObjectId,
                
                // On donne comme référence le modèle en question qui lie notre code à notre base de donneés
                ref: "Product"
            },

            // Quantité d'un produit : par défaut à 1 puis incrémentée si ajout d'un produit avec le même ID
            quantity: {
                type: Number,
                default: 1,
                min: 1,
                validate: {
                    validator: Number.isInteger,
                    message: "La quantité doit être un entier"
                }
            }
        }
    ],

    // On ajoute aussi la date de création du compte d'un user, de la même façon qu'un produit
    createdAt: {
        type: Date,
        default: Date.now,
        min: new Date('2000-01-01'),
        max: new Date('2100-01-01')
    }
});

// On exporte notre modèle User pour qu'il puisse être utilisé par nos contrôleurs.
// Mongoose sera qu'il faut s'adresser à la collection "users" dans la BDD MongoDB.
module.exports = mongoose.model('User', userSchema);
