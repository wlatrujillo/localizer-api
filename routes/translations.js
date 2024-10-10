const express = require('express');
const router = express.Router({ mergeParams: true });
const controller = require('../controllers/translation.ctrl');

router.get('/:id', controller.getById);
router.put('/:id', controller.update);
router.delete('/:id', controller.remove);

router.get('/', controller.getAll);
router.post('/', controller.create);

module.exports = router;
