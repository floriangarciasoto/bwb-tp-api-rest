// Vue permettant d'afficher le formulaire d'ajout de produit

function createProductView(req) {
  return `
<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Ajout d'un produit</title>
  <style>
    form {
      background-color: #2C2A2A;
      font-size: 110%;
      display: flex;
      flex-direction:column;
      align-items: center;
      justify-content: center;
      color: white;
    }
    button {
      color: white;
      background-color: black;
      margin: 15px;
      font-size: 110%;
    }

    .florian-le-boss {
      border: 5px solid black;
      transition: 0.3s ease;
    }
    .florian-le-boss:hover {
      border: 5px solid black;
      scale:1.5;
      transform: rotate(460deg);
    }
  </style>
</head>
<body>
  <main>
    <h1>Création d'un produit</h1>
    <form action="/products" method="post" class="florian-le-boss">
      <label for="name">Nom :</label><br>
      <input type="text" name="name" id="name"><br><br>
      
      <label for="description">Description :</label><br>
      <textarea name="description" id="description"></textarea><br><br>

      <label for="price">Prix :</label><br>
      <input type="number" step="0.01" name="price" id="price"><br><br>

      <label for="quantity">Quantité :</label><br>
      <input type="number" name="quantity" id="quantity"><br><br>

      <label for="category">Catégorie :</label>
      <select name="category" id="category">
        <option value="Nourriture">Nourriture</option>
        <option value="Produits ménagers">Produits ménagers</option>
        <option value="Accessoires">Accessoires</option>
        <option value="Jeux">Jeux</option>
      </select>

      <input type="submit" value="Envoyer">
    </form>
  </main>
</body>
</html>
    `;
}

module.exports = createProductView;
