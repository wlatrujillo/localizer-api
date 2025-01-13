const ServiceException = require("../exceptions/service.exception");
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
    return new GetItemCommand({
        TableName: TableName,
        Key: attr.wrap(key),
        ProjectionExpression: "translations",
    });
};

const getAll = async (projectId, code) => {
    const command = getItemCommand({ projectId, code });
    const response = await client.send(command);
    return JSON.parse(attr.unwrap(response.Item).translations);
};

const create = async (projectId, code, { locale, value }) => {

    const key = { projectId, code };
    let command = getItemCommand(key);
    let response = await client.send(command);

    let translations = JSON.parse(response.Item.translations.S);

    let translation = translations.S.find(
        (t) => t.locale == locale,
    );

    if (translation)
        throw new ServiceException(
            `Translation with the given locale already exists.`,
            400,
        );

    translations.push({ locale, value });

    command = new UpdateItemCommand({
        Key: attr.wrap(key),
        TableName: TableName,
        UpdateExpression: "set #T= :translations",
        ExpressionAttributeNames: {
            "#T": "translations",
        },
        ExpressionAttributeValues: {
            ":translations": {"S": JSON.stringify(translations)},
        },
        ReturnValues: "ALL_NEW",
    });

    response = await client.send(command);

    return response.Attributes;
};

const update = async (projectId, code, locale, { value }) => {

    const key = { projectId, code };

    let command = getItemCommand(key);
    let response = await client.send(command);

    if (!response.Item)
        throw new ServiceException(
            "The resource with the given ID was not found.",
            404,
        );

    let translations = JSON.parse(response.Item.translations.S);

    const translationIndex = translations.findIndex(
        (t) => t.locale == locale,
    );
    if (translationIndex === -1)
        throw new ServiceException(
            "The translation with the given ID was not found.",
            404,
        );

    translations[translationIndex].value = value;

    command = new UpdateItemCommand({
        Key: attr.wrap(key),
        TableName: TableName,
        UpdateExpression: "set #T= :translations",
        ExpressionAttributeNames: {
            "#T": "translations",
        },
        ExpressionAttributeValues: {
            ":translations": {"S": JSON.stringify(translations)},
        },
        ReturnValues: "ALL_NEW",
    });

    response = await client.send(command);

    return response.Attributes;
};

const remove = async (projectId, code, locale) => {

    const key = { projectId, code };
    let command = getItemCommand(key);

    let response = await client.send(command);

    if (!response.Item)
        throw new ServiceException(
            "The resource with the given ID was not found.",
            404,
        );

    const translationIndex = response.Item.translations.L.findIndex(
        (t) => t.M.locale.S == locale,
    );
    if (translationIndex === -1)
        throw new ServiceException(
            "The translation with the given ID was not found.",
            404,
        );

    const deletedTranslation = response.Item.translations.L.splice(
        translationIndex,
        1,
    );

    console.log(response.Item.translations.L);

    command = new UpdateItemCommand({
        Key: attr.wrap(key),
        TableName: TableName,
        UpdateExpression: "set #T= :translations",
        ExpressionAttributeNames: {
            "#T": "translations",
        },
        ExpressionAttributeValues: {
            ":translations": response.Item.translations,
        },
        ReturnValues: "ALL_NEW",
    });

    response = await client.send(command);
    return deletedTranslation[0];
};

const getById = async (projectId, code, locale) => {
    const key = { projectId, code };
    const command = getItemCommand(key);
    let response = await client.send(command);

    if (!response.Item)
        throw new ServiceException(
            "The resource with the given ID was not found.",
            404,
        );

   let translations = JSON.parse(response.Item.translations.S);

    const translation = translations.find((t) => t.locale == locale);

    if (!translation)
        throw new ServiceException(
            "The translation with the given ID was not found.",
            404,
        );

    return translation;
};

module.exports = {
    getAll,
    create,
    update,
    remove,
    getById,
};
