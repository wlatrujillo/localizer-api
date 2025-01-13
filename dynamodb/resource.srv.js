const ServiceException = require("../exceptions/service.exception");
const ProjectService = require("./project.srv");
const attr = require("dynamodb-data-types").AttributeValue;
const {
    DynamoDBClient,
    QueryCommand,
    ScanCommand,
    PutItemCommand,
    GetItemCommand,
    DeleteItemCommand,
    UpdateItemCommand,
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });

const TableName = "localizer-resources";

const getItemCommand = function (key) {
    console.log("key", key);
    return new GetItemCommand({
        Key: attr.wrap(key),
        TableName: TableName,
    });
};

const getAllResources = async (projectId, { page, pageSize, q }) => {

    if (!projectId) throw new ServiceException("ProjectId is required", 400);

    if(!q) { q = ""}

    const params = {
      "TableName": TableName, // Replace with your table name
      "FilterExpression": "#projectId = :projectIdValue and (contains(#translations, :translationValue) or contains(#code, :codeValue))",
      "ExpressionAttributeNames": {
        "#projectId": "projectId",
        "#code": "code",
        "#translations": "translations",
      },
      "ExpressionAttributeValues": {
        ":projectIdValue": {
            "S": projectId
        },
        ":codeValue": {
            "S": q
        },
        ":translationValue": {
            "S": q
        }
      }
    };

    const command = new ScanCommand(params);

    const response = await client.send(command);
    console.log("response", response.Items);
    return response.Items
                    .map((item) => {
                        item.translations.S = JSON.parse(item.translations.S);
                        return attr.unwrap(item)
                    });
};

const createResource = async (projectId, { code, value }) => {

    const project = await ProjectService.getProjectById(projectId);
    console.log(project);
    if (!project._id) throw new ServiceException("Project not found", 404);

    const getCommand = getItemCommand({ projectId, code });
    let response = await client.send(getCommand);
    if (response.Item) throw new ServiceException("Resource already exists", 409);
    
    let translations = [];

    project.locales.forEach((locale) => {
        translations.push({locale: locale.code, value: value});
    });

    const newResource = {
        projectId: projectId,
        code: code,
        translations: JSON.stringify(translations),
    };

    const command = new PutItemCommand({
        TableName: TableName,
        Item: attr.wrap(newResource),
        ReturnValues: "ALL_OLD",
    });

    response = await client.send(command);

    return newResource;
};

const updateResource = async (projectId, id, { code }) => {


    const key = { projectId: projectId, code: id};

    console.log("resource.srv.js - updateResource - key", key);

    const getCommand = getItemCommand(key);

    let response = await client.send(getCommand);

    if (!response.Item) throw new ServiceException("Resource not found.", 404);

    console.log("resource.srv.js - updateResource - response.Item", response?.Item);

    const command = new UpdateItemCommand({
        Key: attr.wrap(key),
        TableName: TableName,
        UpdateExpression: "set #c= :code",
        ExpressionAttributeNames: {
            "#c": "code",
        },
        ExpressionAttributeValues: {
            ":code": { S: code },
        },
        ReturnValues: "ALL_NEW",
    });

    console.log("resource.srv.js - updateResource - command", command);

    response = await client.send(command);

    return response.Attributes;
};

const deleteResource = async (projectId, code) => {
    const command = new DeleteItemCommand({
        Key: attr.wrap({ projectId, code }),
        ReturnValues: "ALL_OLD",
        TableName: TableName,
    });

    const response = await client.send(command);

    return response.Attributes;
};

const getResourceById = async (projectId, code) => {
    const getCommand = getItemCommand({ projectId, code });
    let response = await client.send(getCommand);

    if (!response.Item) throw new ServiceException("Resource not found.", 404);

    response.Item.translations.S = JSON.parse(response.Item.translations.S);

    return attr.unwrap(response.Item);
};

module.exports = {
    getAllResources,
    createResource,
    updateResource,
    deleteResource,
    getResourceById,
};
