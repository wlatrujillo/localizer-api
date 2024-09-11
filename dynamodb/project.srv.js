const attr = require("dynamodb-data-types").AttributeValue;
const { v4: uuidv4 } = require("uuid");
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

const ServiceException = require("../exceptions/service.exception");

const TableName = "localizer-projects";

const getItemCommand = function ({ _id }) {
    return new GetItemCommand({
        Key: attr.wrap({ _id }),
        TableName: TableName,
    });
};

const getAllProjects = async ({ page, pageSize, q }) => {
    console.log("Starting getAllProjects...", { page, pageSize, q });
    const command = new ScanCommand({
        TableName: TableName,
        Limit: Number(pageSize),
    });

    const response = await client.send(command);
    console.log("Scan response: ", response);
    return response.Items.map((item) => attr.unwrap(item));
};

const createProject = async (project) => {
    console.log("Starting createProject...", project);

    if (!project.name)
        throw new ServiceException("Project name is required.", 400);

    const queryCommand = new ScanCommand({
        FilterExpression: "#name = :projectName",
        // For more information about data types,
        // see https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/HowItWorks.NamingRulesDataTypes.html#HowItWorks.DataTypes and
        // https://docs.aws.amazon.com/amazondynamodb/latest/developerguide/Programming.LowLevelAPI.html#Programming.LowLevelAPI.DataTypeDescriptors
        ExpressionAttributeValues: {
            ":projectName": { S: project.name },
        },
        ExpressionAttributeNames: {
            "#name": "name",
        },
        ProjectionExpression: "#name, description",
        TableName: TableName,
    });

    let response = await client.send(queryCommand);

    console.log("Query response: ", response);

    if (response.Items && response.Items.length > 0)
        throw new ServiceException(
            `Project with name ${project.name} already registered.`,
            409,
        );

    const generatedId = uuidv4();

    const command = new PutItemCommand({
        TableName: TableName,
        Item: attr.wrap({
            _id: generatedId,
            name: project.name,
            description: project.description,
        }),
        ReturnValues: "ALL_OLD",
    });

    response = await client.send(command);

    return command.input.Item;
};

const updateProject = async (_id, project) => {
    const getCommand = getItemCommand({ _id });
    let response = await client.send(getCommand);

    if (!response.Item) throw new ServiceException("Project not found.", 404);

    const command = new UpdateItemCommand({
        Key: attr.wrap({ _id }),
        TableName: TableName,
        UpdateExpression: "set #name = :name, #description = :description",
        ExpressionAttributeNames: {
            "#name": "name",
            "#description": "description",
        },
        ExpressionAttributeValues: {
            ":name": { S: project.name || response.Item.name.S },
            ":description": { S: project.description || response.Item.description.S },
        },
        ReturnValues: "ALL_NEW",
    });

    response = await client.send(command);

    return response.Attributes;
};

const deleteProject = async (_id) => {
    const command = new DeleteItemCommand({
        Key: attr.wrap({ _id }),
        ReturnValues: "ALL_OLD",
        TableName: TableName,
    });
    const response = await client.send(command);

    return response.Attributes;
};

const getProjectById = async (_id) => {
    const command = getItemCommand({ _id });
    let response = await client.send(command);
    return attr.unwrap(response.Item);
};

module.exports = {
    getAllProjects,
    createProject,
    updateProject,
    deleteProject,
    getProjectById,
};
