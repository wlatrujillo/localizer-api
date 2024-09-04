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

const getAllResources = async () => {
  const command = new ScanCommand({
    TableName: TableName,
  });

  const response = await client.send(command);
  return response.Items.map((item) => attr.unwrap(item));

}

const createResource = async ({ code, value }) => {


  const getItemCommand = new GetItemCommand({
    Key: {
      code: {
        S: code
      }
    },
    TableName: TableName
  });

  let response = await client.send(getItemCommand);

  console.log("Resource:", response);

  if (response.Item)
    throw new ServiceException("Resource already exists", 409);


  // TODO: insert all translations
  const translation = {
      locale:  "es" ,
      value:  value 
  };

  let translations = [];
  translations.push(translation);

  const newResource = {
    code:  code ,
    translations:  translations 
  };

  console.log("New Resource:", attr.wrap(newResource));

  const command = new PutItemCommand({
    TableName: TableName,
    Item: attr.wrap(newResource), 
    ReturnValues: "ALL_OLD",
  });

  response = await client.send(command);

  return newResource;

}

const updateResource = async (id, { code }) => {

  const getItemCommand = new GetItemCommand({
    Key: {
      code: {
        S: id,
      },
    },
    TableName: TableName,
  });

  let response = await client.send(getItemCommand);

  if (!response.Item) throw new ServiceException("Resource not found.", 404);

  const command = new UpdateItemCommand({
    Key: {
      code: {
        S: id,
      },
    },
    TableName: TableName,
    UpdateExpression: "set #code= :code",
    ExpressionAttributeNames: {
      "#code": "code",
    },
    ExpressionAttributeValues: {
      ":code": { S: code },
    },
    ReturnValues: "ALL_NEW",
  });

  response = await client.send(command);

  return response.Attributes;

}

const deleteResource = async (id) => {

  const command = new DeleteItemCommand({
    Key: {
      code: {
        S: id,
      },
    },
    ReturnValues: "ALL_OLD",
    TableName: TableName,
  });

  const response = await client.send(command);

  return response.Attributes;


}

const getResourceById = async (id) => {

  const getItemCommand = new GetItemCommand({
    Key: {
      code: {
        S: id,
      },
    },
    TableName: TableName,
  });

  let response = await client.send(getItemCommand);

  return attr.unwrap(response.Item);
}


module.exports = {
  getAllResources,
  createResource,
  updateResource,
  deleteResource,
  getResourceById
};
