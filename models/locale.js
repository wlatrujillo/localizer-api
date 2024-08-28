const mongoose = require('mongoose');

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

exports.localeSchema = localeSchema;
exports.Locale = Locale  
