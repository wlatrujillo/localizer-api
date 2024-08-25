const express = require('express');
const authRoute = require('../routes/auth');
const users = require('../routes/users');
const auth = require('../middleware/auth');

module.exports = function(app) {

    app.use(express.json());
    app.use('/api/auth', authRoute);
    app.use('/api/users', auth, users);

}
