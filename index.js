const express = require('express');

const server = express();

server.use(express.json());

const projects = []
let count = 0;

server.use((req, res, next) => {
  count++;
  console.log(count);
  return next();
})

function checkIdTitle(req, res, next) {
  if (!req.body.id) {
    return res.status(400).json({ error: 'The field id is required' });
  } else if (!req.body.title) {
    return res.status(400).json({ error: 'The field title is required' });
  }
  return next();
}

function checkProjectInArray(req, res, next) {
  var foundIndex = projects.findIndex(proj => proj.id == req.params.id);
  const project = projects[foundIndex];
  if (!project) {
    return res.status(400).json({ error: 'Project id does not exists' });
  }
  req.project = project;

  return next();
}

server.get('/projects', (req, res) => {
  return res.json(projects);
})

server.post('/projects', checkIdTitle, (req, res) => {
  const { id, title } = req.body;
  const newProject = {
    id, title, tasks: []
  }
  projects.push(newProject);

  return res.json(projects);
})

server.post('/projects/:id/tasks', checkProjectInArray, (req, res) => {
  const { title } = req.body;
  const project = req.project;
  project.tasks.push(title);

  return res.json(projects);
})

server.put('/projects/:id', checkProjectInArray, (req, res) => {
  const { title } = req.body
  req.project.title = title;

  return res.json(projects);
})

server.delete('/projects/:id', checkProjectInArray, (req, res) => {
  const { id } = req.params;
  const foundIndex = projects.findIndex(proj => proj.id = id);
  projects.splice(foundIndex, 1);

  return res.json(projects);
})

server.listen(3000);