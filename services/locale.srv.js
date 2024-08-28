const { Locale } = require('../models/locale');
const ServiceException = require('../exceptions/service.exception');

const getAllLocales = async () => {
    const locales = await Locale
        .find()
        .sort('name');
    return locales;
}

const createLocale = async (locale) => {

    let localeResource = await Locale.findOne({ code: locale.code });
    if (localeResource) throw new ServiceException('Locale already registered.', 409);

    localeResource = new Locale({ name: locale.name , code: locale.code});

    await localeResource.save();

    return localeResource;

}

const updateLocale = async (id, locale) => {

    const localeResource = await Locale.findByIdAndUpdate(id, { name: locale.name }, { new : true });

    return localeResource;

}

const deleteLocale = async (id) => {

    const localeResource = await Locale.findByIdAndDelete(id);

    return localeResource;

}

const getLocaleById = async (id) => {

    const localeResource = await Locale.findById(id);
    return localeResource;
}


module.exports = {
    getAllLocales,
    createLocale,
    updateLocale,
    deleteLocale,
    getLocaleById
};
