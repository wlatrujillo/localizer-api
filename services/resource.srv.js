const { Resource } = require('../models/resource');
const { Translation } = require('../models/translation');
const ServiceException = require('../exceptions/service.exception');

const getAllResources = async () => {

    const resources = await Resource
        .find();
    return resources;

}

const createResource = async ({code, value}) => {

    let resource = await Resource.findOne({ code });
    if (resource) throw new ServiceException(`Resource with code ${code} already registered.`, 400); 


    // TODO: insert all translations
    let translation = new Translation({
        locale: 'ES',
        value: value
    });

    let translations = [];
    translations.push(translation);
    
    resource = new Resource({ 
        code: code, 
        translations: translations 
    });

    await resource.save();

    return resource;

}

const updateResource = async (id, {code}) => {

    const resource = await Resource.findByIdAndUpdate(id, { code: code }, { new : true });

    if (!resource) throw new ServiceException('The resource with the given ID was not found.', 404);

    return resource;
}

const deleteResource = async (id) => {

    const resource = await Resource.findByIdAndDelete(id);

    if (!resource) throw new ServiceException('The resource with the given ID was not found.', 404);

    return resource;
}

const getResourceById = async (id) => {

    const resource = await Resource.findById(id);
    return resource;
}


module.exports = {
    getAllResources,
    createResource,
    updateResource,
    deleteResource,
    getResourceById
};
