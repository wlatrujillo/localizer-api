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

const ServiceException = require("../exceptions/service.exception");

const TableName = "localizer-locales";

const getItemCommand = function ({ code }) {
    return new GetItemCommand({
        Key: attr.wrap({ code: code }),
        TableName: TableName,
    });
};

const getAllLocales = async () => {
    const command = new ScanCommand({
        TableName: TableName,
    });

    const response = await client.send(command);
    return response.Items.map((item) => attr.unwrap(item));
};

const createLocale = async (locale) => {
    const get = getItemCommand({ code: locale.code });
    let response = await client.send(get);

    if (response.Item)
        throw new ServiceException("Locale already registered.", 409);

    const command = new PutItemCommand({
        TableName: TableName,
        Item: attr.wrap({ code: locale.code, name: locale.name }),
        ReturnValues: "ALL_OLD",
    });

    response = await client.send(command);

    return command.input.Item;
};

const updateLocale = async (id, locale) => {
    const getCommand = getItemCommand({ code: id });
    let response = await client.send(getCommand);

    if (!response.Item) throw new ServiceException("Locale not found.", 404);

    const command = new UpdateItemCommand({
        Key: attr.wrap({ code: id }),
        TableName: TableName,
        UpdateExpression: "set #name = :name",
        ExpressionAttributeNames: {
            "#name": "name",
        },
        ExpressionAttributeValues: {
            ":name": { S: locale.name },
        },
        ReturnValues: "ALL_NEW",
    });

    response = await client.send(command);

    return response.Attributes;
};

const deleteLocale = async (id) => {
    const command = new DeleteItemCommand({
        Key: attr.wrap({ code: id }),
        ReturnValues: "ALL_OLD",
        TableName: TableName,
    });
    const response = await client.send(command);

    return response.Attributes;
};

const getLocaleById = async (id) => {
    const command = getItemCommand({ code: id });
    let response = await client.send(command);
    return attr.unwrap(response.Item);
};

module.exports = {
    getAllLocales,
    createLocale,
    updateLocale,
    deleteLocale,
    getLocaleById,
};
