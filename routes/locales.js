const express = require('express');
const { Locale, validate } = require('../models/locale');
const router = express.Router();


router.get('/', async (req, res) => {
    const locales = await Locale
        .find()
        .sort('name');
    res.send(locales);
});

router.post('/', async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let locale = new Locale({ name: req.body.name , code: req.body.code});
    locale = await locale.save();
    res.send(locale);
});

router.put('/:id', async (req, res) => {
    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    const locale = await Locale.findByIdAndUpdate(req.params.id, { name: req.body.name, code: req.body.code}, { new : true });

    if (!locale) return res.status(404).send('The locale with the given ID was not found.');

    res.send(locale );
});

router.delete('/:id', async (req, res) => {

    const locale = await Locale.findByIdAndDelete(req.params.id);

    if (!locale) return res.status(404).send('The locale with the given ID was not found.');

    res.send(locale);
});

router.get('/:id', async (req, res) => {
    const locale = await Locale.findById(req.params.id);
    if (!locale) return res.status(404).send('The locale with the given ID was not found.');
    res.send(locale);
});



module.exports = router;
