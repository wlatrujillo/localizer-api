const locales = require("../data/locales.json");
const ServiceException = require("../exceptions/service.exception");

const getAllLocales = async () => {
    return Promise.resolve(locales); 
};

const getLocaleById = async (id) => {
    if (!id) {
        throw new ServiceException("Id is required", 400);
    }
    let locale = locales.find((locale) => locale.code === id);
    return Promise.resolve(locale);
};

module.exports = {
    getAllLocales,
    getLocaleById
};
