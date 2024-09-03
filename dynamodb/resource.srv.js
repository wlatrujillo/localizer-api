const { Resource } = require('../models/resource');
const ServiceException = require('../exceptions/service.exception');
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
  return response.Items;

}

const createResource = async ({code, value}) => {


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
        M: {
            locale: { S: "es" },
            value: { S: value }
        }
    };

    let translations = [];
    translations.push(translation);

  const command = new PutItemCommand({
    TableName: "localizer-resources",
    Item: {
      code: { S: code },
      translations: { L: translations } 
    },
    ReturnValues: "ALL_OLD",
  });

  response = await client.send(command);

  return command.input.Item;
    
}

const updateResource = async (id, {code}) => {

    const resource = await Resource.findByIdAndUpdate(id, { code: code }, { new : true });

    if (!resource) throw new ServiceException('The resource with the given ID was not found.', 404);

    return resource;
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
