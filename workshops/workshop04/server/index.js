const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const mongoose = require('mongoose');
const path = require('path');
const Course = require('./models/course');
const Professor = require('./models/professor');
const { authenticateToken, generateToken, registerUser } = require('./controllers/auth-jwt');

// MongoDB: Uso local en workshop01-isw-711
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/workshop01-isw-711';
mongoose
  .connect(MONGODB_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Database Connected'))
  .catch((error) => console.error('MongoDB connection error:', error.message));

const app = express();

app.use(bodyParser.json());
app.use(cors({
  domains: '*',
  methods: '*'
}));

// AUTH
app.post('/auth/register', registerUser);
app.post('/auth/token', generateToken);

// POST - Creamos profesor
app.post('/professor', authenticateToken, async (req, res) => {
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

// GET - Obtener profesor(es)
app.get('/professor', authenticateToken, async (req, res) => {
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

// PUT - Actualizar profesor
app.put('/professor', authenticateToken, async (req, res) => {
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

// DELETE - Eliminamos profesor
app.delete('/professor', authenticateToken, async (req, res) => {
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

// POST - Creamos curso
app.post('/course', authenticateToken, async (req, res) => {
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

// GET - Obtener todos los cursos
app.get('/course', authenticateToken, async (req, res) => {
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

// PUT - Actualizar
app.put('/course', authenticateToken, async (req, res) => {
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

app.delete('/course', authenticateToken, async (req, res) => {
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


app.use(express.static(path.join(__dirname, '../client')));

app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, '../client/index.html'));
});


const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`UTN API service listening on port ${PORT}!`);
  console.log(`Frontend available at http://localhost:${PORT}`);
});