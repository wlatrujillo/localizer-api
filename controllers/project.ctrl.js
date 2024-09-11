const Joi = require("joi");
const projectService = require("../dynamodb/project.srv");

const getAllProjects = async (req, res) => {
    const { page, pageSize, q } = req.query;
    const pagination = { page, pageSize, q };
    const projects = await projectService.getAllProjects(pagination);
    res.send(projects);
};

const createProject = async (req, res) => {
    try {
        const { error } = validate(req.body);
        if (error) return res.status(400).send(error.details[0].message);

        const project = await projectService.createProject(req.body);

        res.send(project);
    } catch (error) {
        console.log(error);
        return res.status(error.code ? error.code : 500).send(error.message);
    }
};

const updateProject = async (req, res) => {
    try {
        const project = await projectService.updateProject(req.params.id, req.body);

        if (!project)
            return res
                .status(404)
                .send("The project with the given ID was not found.");

        res.send(project);
    } catch (error) {
        console.log(error);
        return res.status(error.code ? error.code : 500).send(error.message);
    }
};

const deleteProject = async (req, res) => {
    const project = await projectService.deleteProject(req.params.id);

    if (!project)
        return res.status(404).send("The project with the given ID was not found.");

    res.send(project);
};

const getProjectById = async (req, res) => {
    const project = await projectService.getProjectById(req.params.id);
    if (!project)
        return res.status(404).send("The project with the given ID was not found.");
    res.send(project);
};

function validate(project) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        description: Joi.string().max(820),
    });

    return schema.validate(project);
}

module.exports = {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
};
