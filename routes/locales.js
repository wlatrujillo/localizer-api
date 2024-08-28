const express = require('express');
const router = express.Router();
const controller = require('../controllers/locale.ctrl');

router.get('/', controller.getLocales);

router.post('/', controller.createLocale);

router.put('/:id', controller.updateLocale);

router.delete('/:id', controller.deleteLocale);

router.get('/:id', controller.getLocaleById);

module.exports = router;
