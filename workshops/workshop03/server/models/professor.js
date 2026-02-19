const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const professorSchema = new Schema({
  nombre: { type: String, required: true },
  apellidos: { type: String, required: true },
  cedula: { type: String, required: true, unique: true },
  edad: { type: Number, required: true }
});

module.exports = mongoose.model('Professor', professorSchema);
