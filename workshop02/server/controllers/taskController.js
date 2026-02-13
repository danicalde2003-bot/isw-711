const Task = require("../models/taskModel");

/**
 * Get all tasks or one by ID
 */
const taskGet = (req, res) => {
  if (req.query && req.query.id) {
    Task.findById(req.query.id, function (err, task) {
      if (err || !task) {
        res.status(404);
        return res.json({ error: "Task doesnt exist" });
      }
      res.json(task);
    });
  } else {
    Task.find(function (err, tasks) {
      if (err) {
        res.status(422);
        return res.json({ "error": err });
      }
      res.json(tasks);
    });
  }
};

/**
 * Creates a task
 */
const taskPost = (req, res) => {
  let task = new Task();
  task.title = req.body.title;
  task.detail = req.body.detail;

  if (task.title && task.detail) {
    task.save(function (err) {
      if (err) {
        res.status(422);
        return res.json({ error: 'There was an error saving the task' });
      }
      res.status(201);
      res.json(task);
    });
  } else {
    res.status(422);
    res.json({ error: 'No valid data provided for task' });
  }
};

/**
 * Updates a task (PUT/PATCH)
 */
const taskPatch = (req, res) => {
  if (req.query && req.query.id) {
    Task.findById(req.query.id, function (err, task) {
      if (err || !task) {
        res.status(404);
        return res.json({ error: "Task doesnt exist" });
      }
      task.title = req.body.title ? req.body.title : task.title;
      task.detail = req.body.detail ? req.body.detail : task.detail;

      task.save(function (err) {
        if (err) {
          res.status(422);
          return res.json({ error: 'Error updating task' });
        }
        res.status(200);
        res.json(task);
      });
    });
  } else {
    res.status(404);
    res.json({ error: "No ID provided" });
  }
};

/**
 * Deletes a task (DELETE) - REQUERIMIENTO WORKSHOP
 */
const taskDelete = (req, res) => {
  if (req.query && req.query.id) {
    Task.findByIdAndDelete(req.query.id, function (err, task) {
      if (err) {
        res.status(422);
        return res.json({ error: "Error deleting task" });
      }
      res.status(204).send(); // Éxito, sin contenido
    });
  } else {
    res.status(404);
    res.json({ error: "No ID provided" });
  }
};

module.exports = {
  taskGet,
  taskPost,
  taskPatch,
  taskDelete // Este nombre debe ser el mismo que usamos en el index.js
};