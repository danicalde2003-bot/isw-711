const mongoose = require('mongoose');

const courseSchema = new mongoose.Schema({
  nombre: {
    required: true,
    type: String,
    trim: true
  },
  codigo: {
    required: true,
    type: String,
    trim: true
  },
  descripcion: {
    required: true,
    type: String,
    trim: true
  },
  profesor_id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Professor',
    required: true
  }
});

module.exports = mongoose.model('Course', courseSchema);