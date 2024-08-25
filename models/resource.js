const mongoose = require('mongoose');
const Joi = require('joi');
const Translation = require('./translation');

const resourceSchema = new mongoose.Schema({
    code: {
        type: String,
        required: true,
        unique: true,
        trim: true
    },
    link: {
        type: String,
        required: false
    },
    tags: {
        type: [String],
        required: false
    },
    translations: {
        type: [Translation.schema],
        required: false
    }
});



const Resource = mongoose.model('Resource', resourceSchema);

function validateResource(resource) {
    const schema = new Joi.object({
        code: Joi.string().required(),
        value: Joi.string().required(),
        link: Joi.string().optional(),
        tags: Joi.array().optional(),
        translations: Joi.array().optional()
    });

    return schema.validate(resource);
}

module.exports.Resource = Resource;
module.exports.validate = validateResource;
