const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const courseSchema = new Schema({
  nombre: { type: String, required: true },
  codigo: { type: String, required: true, unique: true },
  descripcion: { type: String, required: true },
  profesor_id: { type: Schema.Types.ObjectId, ref: 'Professor', required: true }
});

module.exports = mongoose.model('Course', courseSchema);
