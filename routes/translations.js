const express = require('express');
const router = express.Router();

const controller = require('../controllers/translation.ctrl');

router.get('/resources/:resourceId/translations', controller.getAll);

router.post('/resources/:resourceId/translations', controller.create);

router.put('/resources/:resourceId/translations/:id', controller.update);

router.delete('/resources/:resourceId/translations/:id', controller.remove);

router.get('/resources/:resourceId/translations/:id', controller.getById);

module.exports = router;
