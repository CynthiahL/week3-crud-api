require('dotenv').config();

const express = require('express');
const app = express();
app.use(express.json()); // Parse JSON bodies

let todos = [
  { id: 1, task: 'Learn Node.js', completed: false },
  { id: 2, task: 'Build CRUD API', completed: false },
  { id: 3, task: 'Test API', completed: true },
  { id: 4, task: 'Deploy API', completed: true },
];

//return only completed todos
app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed);
});

// GET All – Read
app.get('/todos', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed);
  res.status(200).json(todos); // Send array as JSON
});

//return a specific todo by id
app.get('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id));
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  res.status(200).json(todo); // Send object as JSON
});



// POST New – Create
app.post('/todos', (req, res) => {
  const { task, completed } = req.body;
  const errors = [];
  if (!task || typeof task !== 'string' || task.trim() === '') {
    errors.push('`task` is required and must be a non-empty string');
  }
  if (completed !== undefined && typeof completed !== 'boolean') {
    errors.push('`completed` must be a boolean when provided');
  }
  if (errors.length) return res.status(400).json({ errors });

  const nextId = todos.length ? Math.max(...todos.map((t) => t.id)) + 1 : 1;
  const newTodo = { id: nextId, task: task.trim(), completed: completed ?? false };
  todos.push(newTodo);
  res.status(201).json(newTodo); // Echo back
});

// PATCH Update – Partial
app.patch('/todos/:id', (req, res) => {
  const todo = todos.find((t) => t.id === parseInt(req.params.id)); // Array.find()
  if (!todo) return res.status(404).json({ message: 'Todo not found' });
  Object.assign(todo, req.body); // Merge: e.g., {completed: true}
  res.status(200).json(todo);
});

// DELETE Remove
app.delete('/todos/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const initialLength = todos.length;
  todos = todos.filter((t) => t.id !== id); // Array.filter() – non-destructive
  if (todos.length === initialLength)
    return res.status(404).json({ error: 'Not found' });
  res.status(204).send(); // Silent success
});

app.get('/todos/completed', (req, res) => {
  const completed = todos.filter((t) => t.completed);
  res.json(completed); // Custom Read!
});

app.use((err, req, res, next) => {
  res.status(500).json({ error: 'Server error!' });
});

const PORT = process.env.PORT ||  3002;
app.listen(PORT, () => console.log(`Server on port ${PORT}`));
