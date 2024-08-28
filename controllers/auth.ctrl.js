const Joi = require('joi');
const _ = require('lodash');
const service = require('../services/auth.srv');

const login = async (req, res) => {

    try {

        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const token = await service.login(req.body);

        res.send(token);

    } catch (error) {
        console.error(error);
        res.status(error.code).send(error.message);
    }

  
}

const signup = async (req, res) => {

    try {

        const { error } = validate(req.body); 
        if (error) return res.status(400).send(error.details[0].message);

        const user = await service.signup(req.body);

        res.header('x-auth-token', user.token).send(_.pick(user.data, ['_id', 'email']));

    } catch (error) {
        console.error(error);
        res.status(error.code).send(error.message);
    }
}

function validate(req) {
  const schema = new Joi.object({
    firstName: Joi.string().min(2).max(100),
    lastName: Joi.string().min(3).max(100),
    email: Joi.string().min(5).max(255).required().email(),
    password: Joi.string().min(5).max(500).required()
  });

  return schema.validate(req);
}

module.exports.login = login; 
module.exports.signup = signup; 
