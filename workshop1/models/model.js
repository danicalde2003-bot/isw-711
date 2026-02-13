const mongoose = require('mongoose');

// Definimos el esquema de los datos
const dataSchema = new mongoose.Schema({
    name: {
        required: true,
        type: String
    },
    age: {
        required: true,
        type: Number
    }
});

module.exports = mongoose.model('Data', dataSchema);