const bcrypt = require('bcrypt');
const {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  UpdateItemCommand
} = require("@aws-sdk/client-dynamodb");


const client = new DynamoDBClient({ region: "us-east-1" });

const getMeById = async (userId) => {

  const getItemCommand = new GetItemCommand({
    Key: {
      _id: {
        S: userId 
      }
    },
    TableName: 'localizer-users',
    ExpressionAttributeNames: {
        "#ID": "_id"
    },
    ProjectionExpression: "#ID, email, firstName, lastName, isAdmin",
  });

  const response = await client.send(getItemCommand);

  if (!response.Item)
    throw new ServiceException("User not found", 404);

  return response.Item;

};


const updateMyPassword = async (userId, {password, newPassword}) => {

    const getItemCommand = new GetItemCommand({
      Key: {
        _id: {
          S: userId 
        }
      },
      TableName: 'localizer-users',
      ProjectionExpression: "password",
    });

    const response = await client.send(getItemCommand);

    if (!response.Item)
      throw new ServiceException("User not found", 404);

    const user = response.Item;

    const validPassword = await bcrypt.compare(user.password, password);
    if (!validPassword) throw new ServiceException('Invalid password.', 400);
    const salt = await bcrypt.genSalt(10);
    user.password = await bcrypt.hash(newPassword, salt);

    const command = new UpdateItemCommand({
      Key: {
        _id: {
          S: userId,
        },
      },
      TableName: "localizer-users",
      UpdateExpression: "set #password = :password",
      ExpressionAttributeNames: {
        "#password": "password",
      },
      ExpressionAttributeValues: {
        ":password": { S: user.password },
      },
      ReturnValues: "ALL_NEW",
    });

    response = await client.send(command);

    return response.Attributes;
}; 

module.exports = {
    getMeById,
    updateMyPassword
};
