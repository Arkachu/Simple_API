const mongoose = require('mongoose');
const lodash = require('lodash');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const monJwt = "eryttyyu946415kyuaygfuaf13546auygfefg"

// On crée un modèle pour les utilisateurs
const UserSchema = new mongoose.Schema({
    // Un utilisateur possède un email et un mot de passe
    email: {
        type: String,
        required: true,     // email obligatoire
        minlength: 1,       // au moins 1 caractère
        unique: true,       // email unique
        trim: true          // enlève les espaces en début et fin de chaîne
    },

    password: {
        type: String,
        required: true,     // mot de passe obligatoire
        minlength: 6        // au moins 6 caractères
    },
});

// On crée une méthode de renvoi des données de l'utilisateur
UserSchema.methods.toJSON = function() {
    let user = this;
    let userObject = user.toObject();

    // On ne renvoie pas le mot de passe par souci de sécurité
    return lodash.omit(userObject, ['password']);
};

const User = mongoose.model('User', UserSchema);

module.exports = {User};