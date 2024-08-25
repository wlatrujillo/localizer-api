const mongoose = require('mongoose');
const Joi = require('joi');

const translationSchema = new mongoose.Schema({
    locale: {
        type: String,
        required: true,
        minlength: 2,
        maxlength: 5,
        trim: true,
        uppercase: true
    },
    value: {
        type: String,
        required: true,
        minlength: 1,
        maxlength: 1024,
        trim: true
    }
});

const Translation = mongoose.model('Translation', translationSchema);

function validateTranslation(locale) {
    const schema = Joi.object({
        locale: Joi.string().min(2).max(5).required(),
        value: Joi.string().min(1).max(1024).required()
    });

    return schema.validate(locale);
}

exports.Translation = Translation  
exports.translationSchema = translationSchema;
exports.validate = validateTranslation;
