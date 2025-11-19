// Vue permettant d'afficher la liste des produits

function productListView(req, listProduct, page) {
    return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Affichage des produits - Page ${page}</title>
</head>
<body>
  <main>
    <h1>Liste des produits - Page ${page}</h1>
    <a href="?p=${page > 1 ? page - 1 : 1}">Page précédente</a>
    <a href="?p=${page + 1}">Page suivante</a>
    ${
      listProduct.map(product => `
        <ul>
            <li>Nom : ${product.name}</li>
            ` + (product.description ? `<li>Description : ${product.description}</li>` : ``) + `
            <li>Prix : ${product.price} €</li>
            <li>Quantité : ${product.quantity}</li>
            <li>Catégorie : ${product.category}</li>
        </ul>
      `).join('')
    }
  </main>
</body>
</html>
    `;
}

module.exports = productListView;
