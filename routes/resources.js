const express = require('express');
const router = express.Router({ mergeParams: true });

const controller = require('../controllers/resource.ctrl');


router.post('/', controller.createResource);

router.put('/:id', controller.updateResource);

router.delete('/:id', controller.deleteResource);

router.get('/', controller.getAllResources);

router.get('/:id', controller.getResourceById);

module.exports = router;
