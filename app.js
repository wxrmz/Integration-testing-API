const express = require('express');
const bodyParser = require('body-parser');

const app = express();
const port = 3000;

app.use(bodyParser.json());

let tasks = [];
let nextId = 1;

// POST
app.post('/tasks', (req, res) => {
    const { title, description = '', completed = false } = req.body;
    if (!title || typeof title !== 'string' || title.trim() === '') {
        return res.status(400).json({ error: 'Title is required and must be a non-empty string' });
    }
    const task = { id: nextId++, title, description, completed };
    tasks.push(task);
    res.status(201).json(task);
});

// GET /tasks
app.get('/tasks', (req, res) => {
    const { completed } = req.query;
    let filteredTasks = tasks;
    if (completed !== undefined) {
        const isCompleted = completed === 'true';
        filteredTasks = tasks.filter(task => task.completed === isCompleted);
    }
    res.json(filteredTasks);
});

// GET /tasks/:id
app.get('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const task = tasks.find(t => t.id === id);
    if (!task) {
        return res.status(404).json({ error: 'Task not found' });
    }
    res.json(task);
});

// PUT /tasks/:id
app.put('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    const { title, description, completed } = req.body;
    if (title !== undefined) tasks[taskIndex].title = title;
    if (description !== undefined) tasks[taskIndex].description = description;
    if (completed !== undefined) tasks[taskIndex].completed = completed;
    res.json(tasks[taskIndex]);
});

// DELETE /tasks/:id
app.delete('/tasks/:id', (req, res) => {
    const id = parseInt(req.params.id);
    const taskIndex = tasks.findIndex(t => t.id === id);
    if (taskIndex === -1) {
        return res.status(404).json({ error: 'Task not found' });
    }
    tasks.splice(taskIndex, 1);
    res.status(204).send();
});

app.listen(port, () => {
    console.log(`Server running on http://localhost:${port}`);
});