const express = require('express');
const app = express();
// database connection
const mongoose = require("mongoose");
// Se recomienda usar la IP 127.0.0.1 para evitar problemas de resolución de nombres en algunos sistemas
const db = mongoose.connect("mongodb://127.0.0.1:27017/todo-api");

// Importamos las funciones del controlador. 
// Nota: Agregamos 'taskDelete' que es la que creamos para el requerimiento del workshop.
const {
  taskPatch,
  taskPost,
  taskGet,
  taskDelete // <--- Asegúrate de que este nombre coincida con el export en taskController.js
} = require("./controllers/taskController.js");

// parser for the request body (required for the POST and PUT methods)
const bodyParser = require("body-parser");
app.use(bodyParser.json());

// check for cors
const cors = require("cors");
app.use(cors({
  origin: '*', // Cambiado 'domains' por 'origin' que es el estándar de la librería cors
  methods: "*"
}));

/**
 * RUTAS DEL API
 */

// Listar todas las tareas (GET) - Requerimiento: "list all courses/tasks"
app.get("/api/tasks", taskGet);

// Crear una tarea (POST) - Requerimiento: "lets you create a course/task"
app.post("/api/tasks", taskPost);

// Actualizar una tarea (PUT) - Requerimiento: "Implement the PUT function"
// Usamos taskPatch que ya maneja la lógica de actualización por ID
app.put("/api/tasks", taskPatch);

// Eliminar una tarea (DELETE) - Requerimiento: "Implement the DELETE function"
app.delete("/api/tasks", taskDelete);

// Mantener patch por compatibilidad
app.patch("/api/tasks", taskPatch);

app.listen(3000, () => console.log(`Server running on port 3000! 🔥`))