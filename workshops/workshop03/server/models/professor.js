const mongoose = require('mongoose');

const professorSchema = new mongoose.Schema({
  nombre: {
    required: true,
    type: String,
    trim: true
  },
  apellidos: {
    required: true,
    type: String,
    trim: true
  },
  cedula: {
    required: true,
    type: String,
    trim: true
  },
  edad: {
    required: true,
    type: Number
  }
});

module.exports = mongoose.model('Professor', professorSchema);