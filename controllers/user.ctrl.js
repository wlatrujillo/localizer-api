const service = require('../services/user.srv');

const getMe = async (req, res) => {

    console.log('req.user', req.user);
    const user = await service.getMeById(req.user._id); 
    if(!user) return res.status(404).send('User not found');

    res.send(user);
};

module.exports = {
    getMe
}; 
