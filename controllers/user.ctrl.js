const {User, validate} = require('../models/user');


const getMe = async (req, res) => {
  const user = await User.findById(req.user._id).select('-password');
  res.send(user);
};

module.exports = {
    getMe
}; 
