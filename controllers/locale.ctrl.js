const { Locale, validate } = require('../models/locale');


const getLocales = async (req, res) => {
    const locales = await Locale
        .find()
        .sort('name');
    res.send(locales);
}

const createLocale = async (req, res) => {

    const { error } = validate(req.body);
    if (error) return res.status(400).send(error.details[0].message);

    let locale = await Locale.findOne({ code: req.body.code });
    if (locale) return res.status(409).send('Locale already registered.');

    locale = new Locale({ name: req.body.name , code: req.body.code});
    await locale.save();

    res.send(locale);
}

const updateLocale = async (req, res) => {

    const locale = await Locale.findByIdAndUpdate(req.params.id, { name: req.body.name}, { new : true });

    if (!locale) return res.status(404).send('The locale with the given ID was not found.');

    res.send(locale );
}

const deleteLocale = async (req, res) => {

    const locale = await Locale.findByIdAndDelete(req.params.id);

    if (!locale) return res.status(404).send('The locale with the given ID was not found.');

    res.send(locale);
}

const getLocaleById = async (req, res) => {

    const locale = await Locale.findById(req.params.id);
    if (!locale) return res.status(404).send('The locale with the given ID was not found.');
    res.send(locale);
}


module.exports = {
    getLocales,
    createLocale,
    updateLocale,
    deleteLocale,
    getLocaleById
};
