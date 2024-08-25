const express = require('express');
const { Resource, validate } = require('../models/resource');
const { Translation } = require('../models/translation');
const router = express.Router();


router.get('/', async (req, res) => {
    const resources = await Resource
        .find();
    res.send(resources);
});

router.post('/', async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let resource = await Resource.findOne({ code: req.body.code });
    if (resource) return res.status(409).send('Resource already registered.');


    let translation = new Translation({
        locale: 'ES',
        value: req.body.value
    });

    let translations = [];
    translations.push(translation);
    

    resource = new Resource({ 
        code: req.body.code, 
        defaultLocale: req.body.defaultLocale,
        translations: translations 
    });

    await resource.save();

    res.send(resource);
});

router.put('/:id', async (req, res) => {

    const resource = await Resource.findByIdAndUpdate(req.params.id, { code: req.body.code, defaultLocale: req.body.defaultLocale }, { new : true });

    if (!resource) return res.status(404).send('The resource with the given ID was not found.');

    res.send(resource);
});

router.delete('/:id', async (req, res) => {

    const resource = await Resource.findByIdAndDelete(req.params.id);

    if (!resource) return res.status(404).send('The resource with the given ID was not found.');

    res.send(resource);
});

router.get('/:id', async (req, res) => {
    const resource = await Resource.findById(req.params.id);
    if (!resource) return res.status(404).send('The resource with the given ID was not found.');
    res.send(resource);
});



module.exports = router;
