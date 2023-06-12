// On importe les modules nécessaires :
// Module express pour le serveur
const express = require('express');
// Module jsonwebtoken pour les tokens
const jwt = require('jsonwebtoken');
// Module cookie-session pour les cookies
const cookieParser = require('cookie-session');
// Module bcryptjs pour le hashage des mots de passe
const bcrypt = require('bcryptjs');
// Module cors pour les requêtes cross-domain
const cors = require('cors');

// On importe la base de données
const {mongoose} = require('./db/mongoose');

// On importe le modèle User
const {User} = require('./models/User');

// On crée l'application express
const app = express();

// On importe le body-parser pour pouvoir utiliser les données envoyées par le client sous forme de JSON
app.use(express.json());

// Headers de CORS
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "http://localhost:4200");
    res.header("Access-Control-Allow-Methods", "GET, POST, HEAD, OPTIONS, PUT, PATCH, DELETE");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, x-access-token, x-refresh-token, _id");
    res.header('Access-Control-Expose-Headers', 'x-access-token, x-refresh-token');
    next();
});

// On configure CORS pour qu'il accepte les requêtes cross-domain
app.use(cors({ origin: 'http://localhost:4200', credentials: true }));

// On configure le cookie-session
app.use(cookieParser({
    secret: 'Strategin-secret-1234'
}));

// On définit le port du serveur
app.listen(3000, () => {
    console.log('Le serveur a démarré sur le port 3000');
});

// On définit le secret pour le token
const jwtSecret = "Strategin-secret-1234";



/* MIDDLEWARES */

// Méthode pour vérifier que les informations envoyées par le client sont valides
const verifyRegister = async (req, res, next) => {
    // On vérifie que l'email est valide
    if (req.body.email.match(/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/) === null) {
        res.statusMessage = "Veuillez entrer une adresse email valide";
        res.status(400).send();
    }
    // On vérifie que le mot de passe n'est pas vide
    else if (!req.body.password) {
        res.statusMessage = "Veuillez entrer un mot de passe";
        res.status(400).send();
    } 
    // On vérifie que le mot de passe contient au moins 6 caractères
    else if (req.body.password.length < 6) {
        res.statusMessage = "Le mot de passe doit contenir au moins 6 caractères";
        res.status(400).send();
    } else {
        // On vérifie que l'email n'est pas déjà utilisé
        User.findOne({
            email: req.body.email
        }).then(user => {
            if(user) {
                res.statusMessage = "Email déjà utilisé";
                res.status(400).send();
            } else {
                next();
            }
        });
    }
};

// Méthode pour vérifier que les informations de connexions sont les bonnes
const verifyLogin = (req, res, next) => {
    // On vérifie que l'email existe dans la base de données
    let email = req.body.email;
    let password = req.body.password;

    // On vérifie que l'email est valide
    if (req.body.email.match(/^[a-z0-9._-]+@[a-z0-9._-]{2,}\.[a-z]{2,4}$/) === null) {
        res.statusMessage = "Veuillez entrer une adresse email valide";
        res.status(400).send();
    }
    // On vérifie que le mot de passe n'est pas vide
    else if (!req.body.password) {
        res.statusMessage = "Veuillez entrer un mot de passe";
        res.status(400).send();
    } else {
        // On vérifie que l'email existe dans la base de données
        User.findOne({
            email: email
        }).then(async user => {
            if (!user) {
                res.statusMessage = "Aucun compte n'est associé à cet email";
                res.status(400).send();
            }
            // On vérifie que le mot de passe est le bon
            const mdpOK = await bcrypt.compare(password, user.password);
            if (!(mdpOK)) {
                res.statusMessage = "Mot de passe incorrect";
                res.status(400).send();
            } else {
                next();
            }
        });
    }
};

// Méthode pour vérifier que le token est valide
const verifyToken = (req, res, next) => {
    if (req.headers.cookie) {
        // On récupère le token dans le cookie
        let token = req.headers.cookie.split('=')[1];

        // On vérifie que le token existe
        if (!token) {
            res.statusMessage = "Pas de token";
            res.status(401).send();
        } else {
            // On vérifie que le token est valide
            jwt.verify(token, jwtSecret, (err, decoded) => {
                if (err) {
                    res.statusMessage = "Token invalide";
                    res.status(401).send();
                } else {
                    next();
                }
            });
        }
    } else {
        // Si le cookie n'existe pas
        res.statusMessage = "Pas de token";
        res.status(401).send();
    }
};



/* ROUTES */

// Pour ajouter un utilisateur à la liste (quand le client s'inscrit)
app.post('/register', verifyRegister, async (req, res) => {
    // On crée un nouvel utilisateur avec les données envoyées par le client
    const pass = await bcrypt.hash(req.body.password, 8);

    let user = new User({
        email: req.body.email,
        password: pass
    });

    // On enregistre l'utilisateur dans la base de données
    user.save().then((user) => {
        res.send(user);
    }).catch((e) => {
        res.statusMessage = `Erreur lors de l'inscription : ${e}`;
        res.status(400).send();
    });
});

// Pour connecter un utilisateur
app.post('/login', verifyLogin, (req, res) => {
    // On récupère l'utilisateur
    User.findOne({
        email: req.body.email
    }).then(user => {
        // On crée un token pour l'utilisateur
        let token = jwt.sign(
            {id: user._id, email: user.email},
            jwtSecret,
            {expiresIn: '1h'}
        );

        // On enregistre le token dans un cookie
        res.cookie('token', token, {
            httpOnly: false,
            maxAge: 24 * 60 * 60 * 1000,
            secure: false,
            sameSite: 'none'
        });

        res.send(user);
    }).catch((e) => {
        res.statusMessage = `Erreur lors de la connexion : ${e}`;
        res.status(400).send();
    });
});

// Pour obtenir tous les utilisateurs (une fois connecté)
app.get('/users', verifyToken, (req, res) => {
    // On récupère tous les utilisateurs
    User.find().then((users) => {
        res.send(users);
    }).catch((e) => {
        res.statusMessage = `Erreur lors de la récupération des utilisateurs : ${e}`;
        res.status(400).send();
    });
});

// Pour se déconnecter
app.post('/users', (req, res) => {
    // On récupère le token
    let token = req.headers.cookie.split('=')[1];

    // On vérifie que le token existe
    if (!token) {
        res.statusMessage = "Pas de token";
        res.status(401).send();
    } else {
        // On le supprime
        res.clearCookie('token');
        res.send();
    }
});