const Joi = require('joi');
const localeService = require('../dynamodb/locale.srv');


const getLocales = async (req, res) => {
    const locales = await localeService.getAllLocales();
    res.send(locales);
}

const getLocaleById = async (req, res) => {

    const locale = await localeService.getLocaleById(req.params.id); 
    if (!locale) return res.status(404).send('The locale with the given ID was not found.');
    res.send(locale);
}

function validate(locale) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        code: Joi.string().min(2).max(5).required()
    });

    return schema.validate(locale);
}

module.exports = {
    getLocales,
    getLocaleById
};
