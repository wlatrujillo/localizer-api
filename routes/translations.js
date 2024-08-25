const express = require('express');
const { Resource, validate } = require('../models/resource');
const { Translation } = require('../models/translation');
const router = express.Router();


router.get('/resources/:resourceId/translations', async (req, res) => {
    const translations = await Resource.findById(req.params.resourceId).select('translations');
    res.send(translations);
});

router.post('/resources/:resourceId/translations', async (req, res) => {


    let resource = await Resource.findById(req.params.resourceId);
    if (!resource) return res.status(404).send('Resource with the given id not found.');

    let translation = new Translation({
        locale: req.body.locale,
        value: req.body.value
    });

    resource.translations.push(translation);

    await resource.save();

    res.send(resource);
});

router.put('/resources/:resourceId/translations/:id', async (req, res) => {

    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) return res.status(404).send('The resource with the given ID was not found.');

    const translationIndex = resource.translations.findIndex(t => t._id == req.params.id);
    if (translationIndex === -1) return res.status(404).send('The translation with the given ID was not found.');

    resource.translations[translationIndex].value = req.body.value;

    await resource.save();

    res.send(resource);
});

router.delete('/resources/:resourceId/translations/:id', async (req, res) => {

    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) return res.status(404).send('The resource with the given ID was not found.');

    const translationIndex = resource.translations.findIndex(t => t._id == req.params.id);
    if (translationIndex === -1) return res.status(404).send('The translation with the given ID was not found.');

    resource.translations.splice(translationIndex, 1);
    await resource.save();

    res.send(resource);
});

router.get('/resources/:resourceId/translations/:id', async (req, res) => {
    const resource = await Resource.findById(req.params.resourceId).select('translations');
    if (!resource ) return res.status(404).send('The resource with the given ID was not found.');
    res.send(resource.translations.find(t => t._id == req.params.id));
});



module.exports = router;
