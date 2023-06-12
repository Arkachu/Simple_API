const mongoose = require('mongoose');

// On se connecte à la base de données
mongoose.connect('mongodb+srv://nroehlly:mongodbroehlly@strategin.pwldgii.mongodb.net/?retryWrites=true&w=majority', {useNewUrlParser: true}).then(() => {
    console.log('Connecté à la base de données');
}).catch((e) => {
    console.log(`Erreur lors de la tentative de connection à la base de données : ${e}`);
});

module.exports = {mongoose};