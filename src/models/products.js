// Ajout du module mongoose pour pouvoir créer notre schéma de produit
// Aucune connexion à MongoDB ici
const mongoose = require('mongoose');

// Création de la structure d'un produit
// C'est ici que l'on peut élaborer notre validation d'entrées en base de données (dans le cas suivant les produits).
// Cela va permettre de rendre opérationnelles les validations aux deux niveaux de requêtes BDD necéssaires,
// où c'est l'utilisateur qui va transmettre des données (create et update)
const productSchema = new mongoose.Schema({
    // Le nom d'un produit peut faire de 2 à 100 caractères,
    // on enlève les espaces inutiles au début et à la fin avec trim à true.
    name: {
        type: String,
        required: true,
        trim: true,
        minlength: 2,
        maxlength: 100
    },

    // Une description doit elle aussi être limitée (500 caractères dans le cas suivant),
    // cela pourrait être mis en adéquation avec le max d'un textarea côté client.
    description: {
        type: String,
        trim: true,
        maxlength: 500
    },

    // Un prix ne peut être négatif -> minimum 0 (gratuité possible)
    price: {
        type: Number,
        required: true,
        min: 0
    },

    // La quantité d'un produit ne peut être négative, mais possible à 0 pour stock vide.
    // Contrairement au prix, la quantité ne peut pas être décimale, on utilise donc
    // un validateur spécial afin de vérifier que la quantité soit bien entière (soit Integer).
    quantity: {
        type: Number,
        required: true,
        default: 0,
        min: 0,
        // Validation spéciale
        validate: {
            // Booléen résultant du test à effectuer
            validator: Number.isInteger,
            // Message à afficher lors de l'échec du test
            message: "La quantité doit être un entier"
        }
    },

    // La catégorie de produit ne peut être qu'une valeur disponible parmi une liste bien définie de catégories,
    // enum permet donc d'effectuer totalement la validation.
    category: {
        type: String,
        required: true,
        enum: ["Nourriture", "Produits ménagers", "Accessoires", "Jeux"]
    },

    // Il faut éviter que la date de création envoyée par l'utilisateur soit absurde,
    // on donne donc une plage arbitraire correspondante à l'an 2000.
    createdAt: {
        type: Date,
        default: Date.now,
        min: new Date('2000-01-01'),
        max: new Date('2100-01-01')
    }
});

// On exporte le modèle de notre produit pour qu'il soit utilisable
// dans le contrôleur lors des opérations avec la base de données.
// En choisissant de mettre 'Product', mongoose va automatiquement
// connecter notre schéma à la collection store.products,
// en déduisant son nom en y ajoutant le "s".
module.exports = mongoose.model('Product', productSchema);
