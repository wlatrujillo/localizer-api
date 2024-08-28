const {User, validate} = require('../models/user');
const bcrypt = require('bcrypt');

const getMeById = async (userId) => {
    const user = await User.findById(userId).select('-password');
    return user;
};


const updateMyPassword = async (userId, {password, newPassword}) => {

    const user = await User.findById(userId);
    if (!user) throw new ServiceException('User not found.', 404);

    const validPassword = await bcrypt.compare(user.password, password);
    if (!validPassword) throw new ServiceException('Invalid password.', 400);

    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    await user.save();
    return user;
}; 

module.exports = {
    getMeById,
    updateMyPassword
}; 
