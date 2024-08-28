const Joi = require('joi');
const service = require('../services/locale.srv');


const getLocales = async (req, res) => {
    const locales = await service.getAllLocales();
    res.send(locales);
}

const createLocale = async (req, res) => {

    try {

        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const locale = await service.createLocale(req.body); 

        res.send(locale);

    } catch (error) {
        console.log(error);
      return res.status(error.code?error.code:500).send(error.message);
         
    }
}

const updateLocale = async (req, res) => {

    const locale = await service.updateLocale(req.params.id, req.body);  

    if (!locale) return res.status(404).send('The locale with the given ID was not found.');

    res.send(locale );
}

const deleteLocale = async (req, res) => {

    const locale = await service.deleteLocale(req.params.id); 

    if (!locale) return res.status(404).send('The locale with the given ID was not found.');

    res.send(locale);
}

const getLocaleById = async (req, res) => {

    const locale = await service.getLocaleById(req.params.id); 
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
    createLocale,
    updateLocale,
    deleteLocale,
    getLocaleById
};
