const ServiceException = require('../exceptions/service.exception');
const attr = require('dynamodb-data-types').AttributeValue;
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

const TableName = 'localizer-resources';

const getAll = async (resourceId) => {

  const command = new GetItemCommand({
    TableName: TableName,
    Key: {
      code: {
        S: resourceId,
      }
    },
    ProjectionExpression: "translations"
  });

  const response = await client.send(command);
  return attr.unwrap(response.Item);
}

const create = async (resourceId, { locale, value }) => {


  let command = new GetItemCommand({
    TableName: TableName,
    Key: {
      code: {
        S: resourceId,
      }
    },
    ProjectionExpression: "translations"
  });

  let response = await client.send(command);

  console.log(response);

  let translation = response.Item.translations.L.find(t => t.M.locale.S == locale);
  if (translation) throw new ServiceException(`Translation with the given locale already exists.`, 400);

  translation = {
    M: {
      locale: { S: locale },
      value: { S: value }
    }
  };

  response.Item.translations.L.push(translation);

  console.log(response.Item.translations);

  command = new UpdateItemCommand({
    Key: {
      code: {
        S: resourceId,
      },
    },
    TableName: TableName,
    UpdateExpression: "set #T= :translations",
    ExpressionAttributeNames: {
      "#T": "translations",
    },
    ExpressionAttributeValues: {
      ":translations": response.Item.translations
    },
    ReturnValues: "ALL_NEW",
  });

  response = await client.send(command);


  return response.Attributes;
}

const update = async (resourceId, locale, { value }) => {

  let command = new GetItemCommand({
    TableName: TableName,
    Key: {
      code: {
        S: resourceId,
      }
    },
    ProjectionExpression: "translations"
  });

  let response = await client.send(command);

  if (!response.Item) throw new ServiceException('The resource with the given ID was not found.', 404);

  const translationIndex = response.Item.translations.L.findIndex(t => t.M.locale.S == locale);
  if (translationIndex === -1) throw new ServiceException('The translation with the given ID was not found.', 404);

  response.Item.translations.L[translationIndex].M.value.S = value;

  command = new UpdateItemCommand({
    Key: {
      code: {
        S: resourceId,
      },
    },
    TableName: TableName,
    UpdateExpression: "set #T= :translations",
    ExpressionAttributeNames: {
      "#T": "translations",
    },
    ExpressionAttributeValues: {
      ":translations": response.Item.translations
    },
    ReturnValues: "ALL_NEW",
  });

  response = await client.send(command);


  return response.Attributes;
}

const remove = async (resourceId, locale) => {

  let command = new GetItemCommand({
    TableName: TableName,
    Key: {
      code: {
        S: resourceId,
      }
    },
    ProjectionExpression: "translations"
  });

  let response = await client.send(command);

  if (!response.Item) throw new ServiceException('The resource with the given ID was not found.', 404);

  const translationIndex = response.Item.translations.L.findIndex(t => t.M.locale.S == locale);
  if (translationIndex === -1) throw new ServiceException('The translation with the given ID was not found.', 404);

  const deletedTranslation = response.Item.translations.L.splice(translationIndex, 1);

  console.log(response.Item.translations.L);

  command = new UpdateItemCommand({
    Key: {
      code: {
        S: resourceId,
      },
    },
    TableName: TableName,
    UpdateExpression: "set #T= :translations",
    ExpressionAttributeNames: {
      "#T": "translations",
    },
    ExpressionAttributeValues: {
      ":translations": response.Item.translations
    },
    ReturnValues: "ALL_NEW",
  });


  response = await client.send(command);
  return deletedTranslation[0];
}


const getById = async (resourceId, locale) => {

  let command = new GetItemCommand({
    TableName: TableName,
    Key: {
      code: {
        S: resourceId,
      }
    },
    ProjectionExpression: "translations"
  });

  let response = await client.send(command);

  if (!response.Item) throw new ServiceException('The resource with the given ID was not found.', 404);

  const translation = attr.unwrap(response.Item).translations.find(t => t.locale == locale);
  if (!translation) throw new ServiceException('The translation with the given ID was not found.', 404);

  return translation;
}

module.exports = {
  getAll,
  create,
  update,
  remove,
  getById
};
