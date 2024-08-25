const mongoose = require('mongoose');

module.exports = function() {
    
    const mongoDBUrl = process.env.MONGODB_URI || 'mongodb://localhost/localizer';
    mongoose.connect(mongoDBUrl)
    .then(() => console.log('Connected to MongoDB...'))
    .catch(err => console.error('Could not connect to MongoDB...'));

}
