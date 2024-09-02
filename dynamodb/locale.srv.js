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

const getAllLocales = async () => {
  const command = new ScanCommand({
    TableName: "localizer-locales",
  });

  const response = await client.send(command);
  return response.Items;
};

const createLocale = async (locale) => {
  const getItemCommand = new GetItemCommand({
    Key: {
      code: {
        S: locale.code,
      },
    },
    TableName: "localizer-locales",
  });

  let response = await client.send(getItemCommand);

  if (response.Item)
    throw new ServiceException("Locale already registered.", 409);

  const command = new PutItemCommand({
    TableName: "localizer-locales",
    Item: {
      code: { S: locale.code },
      name: { S: locale.name },
    },
    ReturnValues: "ALL_OLD",
  });

  response = await client.send(command);

  return command.input.Item;
};

const updateLocale = async (id, locale) => {
  const getItemCommand = new GetItemCommand({
    Key: {
      code: {
        S: id,
      },
    },
    TableName: "localizer-locales",
  });

  let response = await client.send(getItemCommand);

  if (!response.Item) throw new ServiceException("Locale not found.", 404);

  const command = new UpdateItemCommand({
    Key: {
      code: {
        S: id,
      },
    },
    TableName: "localizer-locales",
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
    Key: {
      code: {
        S: id,
      },
    },
    ReturnValues: "ALL_OLD",
    TableName: "localizer-locales",
  });
  const response = await client.send(command);

  return response.Attributes;
};

const getLocaleById = async (id) => {
  const getItemCommand = new GetItemCommand({
    Key: {
      code: {
        S: id,
      },
    },
    TableName: "localizer-locales",
  });

  let response = await client.send(getItemCommand);

  return response.Item;
};

module.exports = {
  getAllLocales,
  createLocale,
  updateLocale,
  deleteLocale,
  getLocaleById,
};
