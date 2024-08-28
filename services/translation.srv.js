const { Resource } = require('../models/resource');
const { Translation } = require('../models/translation');
const ServiceException = require('../exceptions/service.exception');

const getAll = async (resourceId) => {
    const translations = await Resource.findById(resourceId).select('translations');
    return translations;
}

const create = async (resourceId, {locale, value}) => {

    let resource = await Resource.findById(resourceId).select('translations');
    if (!resource) throw new ServiceException(`Resource with the given ID not found.`, 404);

    let translation = resource.translations.find(t => t.locale == locale);
    if (translation) throw new ServiceException(`Translation with the given locale already exists.`, 400);

    translation = new Translation({
        locale: locale,
        value: value
    });

    resource.translations.push(translation);

    await resource.save();
    
    return resource;
}

const update = async (resourceId, locale, {value}) => {

    const resource = await Resource.findById(resourceId).select('translations');
    if (!resource) throw new ServiceException('The resource with the given ID was not found.', 404);

    const translationIndex = resource.translations.findIndex(t => t.locale == locale);
    if (translationIndex === -1) throw new ServiceException('The translation with the given ID was not found.', 404);

    resource.translations[translationIndex].value = value;

    await Resource.updateOne({ _id: resourceId }, { $set: { translations: resource.translations } });

    return resource.translations[translationIndex];
}

const remove = async (resourceId, locale) => {

    const resource = await Resource.findById(resourceId).select('translations');
    if (!resource) throw new ServiceException('The resource with the given ID was not found.', 404);

    const translationIndex = resource.translations.findIndex(t => t.locale == locale);
    if (translationIndex === -1) throw new ServiceException('The translation with the given ID was not found.', 404);

    const deletedTranslation = resource.translations.splice(translationIndex, 1);

    await Resource.updateOne({ _id: resourceId }, { $set: { translations: resource.translations } });

    return deletedTranslation[0];
}

const getById = async (resourceId, locale) => {

    const resource = await Resource.findById(resourceId).select('translations');
    if (!resource ) throw new ServiceException('The resource with the given ID was not found.', 404);

    const translation = resource.translations.find(t => t.locale == locale);
    if (!translation) throw new ServiceException('The translation with the given ID was not found.', 404);

    return translation;
}

module.exports = {
    getAll,
    create,
    update,
    remove,
    getById
};
