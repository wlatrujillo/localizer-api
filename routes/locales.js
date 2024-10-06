const express = require('express');
const router = express.Router();
const controller = require('../controllers/locale.ctrl');

router.get('/', controller.getLocales);

router.get('/:id', controller.getLocaleById);

module.exports = router;
