const Joi = require('joi');
const service = require('../services/translation.srv');

const getAll = async (req, res) => {
    const translations = await service.getAll(req.params.resourceId); 
    res.send(translations);
}

const create = async (req, res) => {

    try {
        const resource = await service.create(req.params.resourceId, req.body); 
        res.send(resource);
    } catch (error) {
        console.error(error);
        res.status(error.code?error.code:500).send(error.message);
    }
}

const update = async (req, res) => {

    try {
        const resource = await service.update(req.params.resourceId, req.params.id, req.body); 
        res.send(resource);
    } catch (error) {
        console.error(error);
        res.status(error.code?error.code:500).send(error.message);
    }
}

const remove = async (req, res) => {

    try {
        const resource = await service.remove(req.params.resourceId, req.params.id); 
        res.send(resource);
    } catch (error) {
        console.error(error);
        res.status(error.code?error.code:500).send(error.message);
    }
}

const getById = async (req, res) => {

    try {
        const translation = await service.getById(req.params.resourceId, req.params.id);
        res.send(translation);
    } catch (error) {
        console.error(error);
        res.status(error.code?error.code:500).send(error.message);
    }
}

function validate(translation) {
    const schema = Joi.object({
        locale: Joi.string().min(2).max(5).required(),
        value: Joi.string().min(1).max(1024).required()
    });

    return schema.validate(translation);
}
module.exports = {
    getAll,
    create,
    update,
    remove,
    getById
};
