const mongoose = require('mongoose');
const Joi = require('joi');
const localeSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minlength: 5,
        maxlength: 50,
        unique: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 5,
        trim: true,
        uppercase: true
    },
});

const Locale = mongoose.model('Locale ', localeSchema);

function validateLocale(locale) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        code: Joi.string().min(2).max(5).required()
    });

    return schema.validate(locale);
}

exports.localeSchema = localeSchema;
exports.Locale = Locale  
exports.validate = validateLocale;
