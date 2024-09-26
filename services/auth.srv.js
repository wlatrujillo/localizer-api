const bcrypt = require('bcrypt');
const { User } = require('../models/user');
const ServiceException = require('../exceptions/service.exception');

const login = async (user) => {
    console.log('login srv', user);

    let userResource = await User.findOne({ email: user.email });
    if (!userResource) throw new ServiceException('Invalid email or password.', 400);

    const validPassword = await bcrypt.compare(user.password, userResource.password);
    if (!validPassword) throw new ServiceException('Invalid email or password.', 400);

    const token = userResource.generateAuthToken();

    return token;

}

const signup = async (user) => {

    let userResource = await User.findOne({ email: user.email });
    if (userResource) throw new ServiceException('User already registered.', 400);

    userResource = new User( {firstName: user.firstName, lastName: user.lastName, email: user.email});

    const salt = await bcrypt.genSalt(10);
    userResource.password = await bcrypt.hash(user.password, salt);

    await userResource.save();

    const token = userResource.generateAuthToken();

    return { token, data: {email: userResource.email, _id: userResource._id} };
    
}

module.exports = {
    login,
    signup
}
