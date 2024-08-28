const mongoose = require('mongoose');
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

module.exports.Resource = Resource;
