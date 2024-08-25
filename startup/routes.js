const express = require('express');
const authRoute = require('../routes/auth');
const auth = require('../middleware/auth');
const users = require('../routes/users');
const locales = require('../routes/locales');
const resources = require('../routes/resources');
const translations = require('../routes/translations');

module.exports = function(app) {

    app.use(express.json());
    app.use('/api/auth', authRoute);
    app.use('/api/users', auth, users);
    app.use('/api/locales', auth, locales);
    app.use('/api/resources',auth, resources);
    app.use('/api',auth, translations);

}
