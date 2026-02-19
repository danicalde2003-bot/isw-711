const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const Course = require('./models/course');
const Professor = require('./models/professor');

// MongoDB: local usa workshop01-isw-711; para Atlas definir MONGODB_URI en el entorno
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workshop01-isw-711';
mongoose.connect(MONGODB_URI);
const database = mongoose.connection;

database.on('error', (error) => {
  console.log(error);
});

database.once('connected', () => {
  console.log('Database Connected');
});

const app = express();

// middlewares
app.use(bodyParser.json());
app.use(cors({
  domains: '*',
  methods: '*'
}));

// routes

// ====== PROFESSOR ROUTES ======

// POST - Create professor
app.post('/professor', async (req, res) => {
  const professor = new Professor({
    nombre: req.body.nombre,
    apellidos: req.body.apellidos,
    cedula: req.body.cedula,
    edad: req.body.edad
  });

  try {
    const professorCreated = await professor.save();
    res.header('Location', `/professor?id=${professorCreated._id}`);
    res.status(201).json(professorCreated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET - Get all professors or single professor
app.get('/professor', async (req, res) => {
  try {
    if (!req.query.id) {
      const data = await Professor.find();
      return res.status(200).json(data);
    }
    const data = await Professor.findById(req.query.id);
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update professor
app.put('/professor', async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ message: 'id is required' });

    const update = {};
    if (req.body.nombre !== undefined) update.nombre = req.body.nombre;
    if (req.body.apellidos !== undefined) update.apellidos = req.body.apellidos;
    if (req.body.cedula !== undefined) update.cedula = req.body.cedula;
    if (req.body.edad !== undefined) update.edad = req.body.edad;

    const updated = await Professor.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    );

    if (!updated) return res.status(404).json({ message: 'Professor not found' });

    res.header('Location', `/professor?id=${updated._id}`);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// DELETE - Delete professor
app.delete('/professor', async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ message: 'id is required' });

    const deleted = await Professor.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: 'Professor not found' });

    return res.status(200).json({ message: 'Professor deleted', deleted });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// ====== COURSE ROUTES ======

// POST - Create course
app.post('/course', async (req, res) => {
  const course = new Course({
    nombre: req.body.nombre,
    codigo: req.body.codigo,
    descripcion: req.body.descripcion,
    profesor_id: req.body.profesor_id
  });

  try {
    const courseCreated = await course.save();
    res.header('Location', `/course?id=${courseCreated._id}`);
    res.status(201).json(courseCreated);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// GET - Get all courses or single course
app.get('/course', async (req, res) => {
  try {
    if (!req.query.id) {
      const data = await Course.find().populate('profesor_id');
      return res.status(200).json(data);
    }
    const data = await Course.findById(req.query.id).populate('profesor_id');
    res.status(200).json(data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// PUT - Update course
app.put('/course', async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ message: 'id is required' });

    const update = {};
    if (req.body.nombre !== undefined) update.nombre = req.body.nombre;
    if (req.body.codigo !== undefined) update.codigo = req.body.codigo;
    if (req.body.descripcion !== undefined) update.descripcion = req.body.descripcion;
    if (req.body.profesor_id !== undefined) update.profesor_id = req.body.profesor_id;

    const updated = await Course.findByIdAndUpdate(
      id,
      update,
      { new: true, runValidators: true }
    ).populate('profesor_id');

    if (!updated) return res.status(404).json({ message: 'Course not found' });

    res.header('Location', `/course?id=${updated._id}`);
    return res.status(200).json(updated);
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// DELETE - Delete course
app.delete('/course', async (req, res) => {
  try {
    const id = req.query.id;
    if (!id) return res.status(400).json({ message: 'id is required' });

    const deleted = await Course.findByIdAndDelete(id);

    if (!deleted) return res.status(404).json({ message: 'Course not found' });

    return res.status(200).json({ message: 'Course deleted', deleted });
  } catch (error) {
    return res.status(500).json({ message: error.message });
  }
});

// Serve static files from the client directory
app.use(express.static(path.join(__dirname, '../client')));

// For any other route, serve the index.html (SPA fallback)
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});

// start the app
const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`UTN API service listening on port ${PORT}!`);
  console.log(`Frontend available at http://localhost:${PORT}`);
});
