const Joi = require('joi');
const service = require('../dynamodb/resource.srv');

const getAllResources = async (req, res) => {

    const {projectId}  = req.params; 

    if (!projectId) return res.status(400).send('ProjectId is required.');

    console.log('Getting all resources...', req.query);

    const resources = await service.getAllResources(projectId, req.query);
    res.send(resources);
}

const createResource = async (req, res) => {

    try {

        const {projectId}  = req.params; 

        if (!projectId) return res.status(400).send('ProjectId is required.');

        const { error } = validate(req.body);

        if (error) return res.status(400).send(error.details[0].message);

        const resource = await service.createResource(projectId, req.body); 

        res.send(resource);

    } catch (error) {
        console.error('Error creating resource', error);

        res.status(error.code?error.code:500).send(error.message);
    }
}

const updateResource = async (req, res) => {

    const resource = await service.updateResource(req.params.id, req.body);

    if (!resource) return res.status(404).send('The resource with the given ID was not found.');

    res.send(resource);
}

const deleteResource = async (req, res) => {

    const resource = await service.deleteResource(req.params.id); 

    if (!resource) return res.status(404).send('The resource with the given ID was not found.');

    res.send(resource);
}

const getResourceById = async (req, res) => {

    const resource = await service.getResourceById(req.params.id); 
    if (!resource) return res.status(404).send('The resource with the given ID was not found.');
    res.send(resource);
}


function validate(resource) {
    const schema = new Joi.object({
        code: Joi.string().required(),
        value: Joi.string().required(),
        link: Joi.string().optional(),
        tags: Joi.array().optional(),
        translations: Joi.array().optional()
    });

    return schema.validate(resource);
}
module.exports = {
    getAllResources,
    createResource,
    updateResource,
    deleteResource,
    getResourceById
};
