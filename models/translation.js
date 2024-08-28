const mongoose = require('mongoose');

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

exports.Translation = Translation  
exports.translationSchema = translationSchema;
