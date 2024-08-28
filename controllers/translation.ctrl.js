const { Resource, validate } = require('../models/resource');
const { Translation } = require('../models/translation');

const getAll = async (req, res) => {
    const translations = await Resource.findById(req.params.resourceId).select('translations');
    res.send(translations);
}

const create = async (req, res) => {

    let resource = await Resource.findById(req.params.resourceId);
    if (!resource) return res.status(404).send('Resource with the given id not found.');

    let translation = new Translation({
        locale: req.body.locale,
        value: req.body.value
    });

    resource.translations.push(translation);

    await resource.save();

    res.send(resource);
}

const update = async (req, res) => {

    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) return res.status(404).send('The resource with the given ID was not found.');

    const translationIndex = resource.translations.findIndex(t => t._id == req.params.id);
    if (translationIndex === -1) return res.status(404).send('The translation with the given ID was not found.');

    resource.translations[translationIndex].value = req.body.value;

    await Resource.updateOne({ _id: req.params.resourceId }, { $set: { translations: resource.translations } });

    res.send(resource);
}

const remove = async (req, res) => {

    const resource = await Resource.findById(req.params.resourceId);
    if (!resource) return res.status(404).send('The resource with the given ID was not found.');

    const translationIndex = resource.translations.findIndex(t => t._id == req.params.id);
    if (translationIndex === -1) return res.status(404).send('The translation with the given ID was not found.');

    resource.translations.splice(translationIndex, 1);

    await Resource.updateOne({ _id: req.params.resourceId }, { $set: { translations: resource.translations } });

    res.send(resource);
}

const getById = async (req, res) => {

    const resource = await Resource.findById(req.params.resourceId).select('translations');
    if (!resource ) return res.status(404).send('The resource with the given ID was not found.');
    res.send(resource.translations.find(t => t._id == req.params.id));
}

module.exports = {
    getAll,
    create,
    update,
    remove,
    getById
};
