Ce projet est constitué de deux dossiers :

Dans api/, on trouve tout le backend et tout le frontend dans front/.

J'ai eu quelques choix à faire et voici les principaux :
  - Utilisation d'Angular pour le front
  - Utilisation des cookies pour stocker les jsonwebtokens

Utilisation de l'application :

On lance le serveur en utilisant la commande "nodemon app.js" dans le dossier api/
On utilise ensuite la commande "ng serve" dans le dossier front/
On peut ensuite consulter l'application à partir d'un navigateur en rentrant l'url "http://localhost:4200".
Nous sommes alors redirigés vers une page /register. Une fois enregistrés, nous pouvons nous connecter à partir de la page /login.
La consultation de la page /users se fait automatiquement (et uniquement) après s'être connecté. Autrement, cette page redirige vers la page /register.
Un bouton pour se déconnecter est présent sur la page /users.

J'ai également ajouté des liens "Déja inscrit ?" et "Pas encore inscrit ?" sur les pages /register et /login respectivement.

La base de données est une base de donnée MongoDB sur Atlas.
