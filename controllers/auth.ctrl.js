const Joi = require('joi');
const service = require('../dynamodb/auth.srv');

const login = async (req, res) => {
    console.log('login');

    try {

        const { error } = validate(req.body);
        console.log('login ctrl validate error', error);
        if (error) return res.status(400).send(error.details[0].message);

        console.log('login ctrl req.body', req.body);
        const token = await service.login(req.body);

        console.log('login ctrl token from srv', token);
        res.send(token);

        console.log('response sent');

    } catch (error) {
        console.error(error);
        res.status(error.code?error.code:500).send(error.message);
    }

}

const signup = async (req, res) => {
    console.log('signup');

    try {

        const { error } = validate(req.body); 
        if (error) return res.status(400).send(error.details[0].message);

        const response = await service.signup(req.body);

        res.header('x-auth-token', response.token).send(response.data);

    } catch (error) {
        console.error(error);
        res.status(error.code?error.code:500).send(error.message);
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
