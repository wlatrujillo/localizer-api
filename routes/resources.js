const express = require('express');
const router = express.Router();

const controller = require('../controllers/resource.ctrl');

router.get('/', controller.getAllResources);

router.post('/', controller.createResource);

router.put('/:id', controller.updateResource);

router.delete('/:id', controller.deleteResource);

router.get('/:id', controller.getResourceById);

module.exports = router;
