const express = require('express');
const router = express.Router();
const controller = require('../controllers/project.ctrl');

router.get('/', controller.getAllProjects);

router.post('/', controller.createProject);

router.put('/:id', controller.updateProject);

router.delete('/:id', controller.deleteProject);

router.get('/:id', controller.getProjectById);

module.exports = router;
