const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { v4: uuidv4 } = require("uuid");
const ServiceException = require("../exceptions/service.exception");

const {
  DynamoDBClient,
  PutItemCommand,
  GetItemCommand,
  QueryCommand,
  ScanCommand
} = require("@aws-sdk/client-dynamodb");

const client = new DynamoDBClient({ region: "us-east-1" });
const TableName = "localizer-users";

const login = async (user) => {

    const input = {
        "ExpressionAttributeNames": {
          "#ID": "_id",
          "#EM": "email",
          "#FN": "firstName",
          "#LN": "LastName",
          "#PW": "password"
        },
        "ExpressionAttributeValues": {
          ":email": {
            "S": user.email 
          }
        },
        "FilterExpression": "email = :email",
        "ProjectionExpression": "#ID, #EM, #FN, #LN, #PW, isAdmin",
        "TableName": TableName 
      };
      const command = new ScanCommand(input);
      const response = await client.send(command);

    if (!response.Items || response.Items.length === 0)
      throw new ServiceException("Invalid email or password.", 400);


    const userResource = response.Items[0]; 

    const validPassword = await bcrypt.compare(
      user.password,
      userResource.password.S,
    );

    if (!validPassword)
      throw new ServiceException("Invalid email or password.", 400);

    console.log(userResource);

    const token = generateAuthToken(userResource._id.S, userResource.isAdmin.BOOL);

    return token;
};

const signup = async (user) => {
    const input = {
      "ExpressionAttributeNames": {
        "#ID": "_id",
        "#EM": "email",
        "#FN": "firstName",
        "#LN": "LastName",
        "#PW": "password"
      },
      "ExpressionAttributeValues": {
        ":email": {
          "S": user.email 
        }
      },
      "FilterExpression": "email = :email",
      "ProjectionExpression": "#ID, #EM, #FN, #LN, #PW",
      "TableName": TableName 
    };
    const command = new ScanCommand(input);
    const userResource = await client.send(command);

    if (userResource.Items && userResource.Items.length>0) throw new ServiceException("User already registered.", 400);

    const salt = await bcrypt.genSalt(10);
    const password = await bcrypt.hash(user.password, salt);
    const _id = uuidv4();

    const Item = {
        _id: { S: _id},
        email: { S: user.email },
        firstName: { S: user.firstName },
        lastName: { S: user.lastName },
        password: { S: password },
        isAdmin: { BOOL: true }
    }


    const putCommand = new PutItemCommand({
      TableName: TableName, 
      Item: Item,
      ReturnValues: "ALL_OLD"
    });

    const response = await client.send(putCommand);

    const token = generateAuthToken(_id, true);

    return { token, data: { email: Item.email, _id: Item._id } };
};

function generateAuthToken( _id, isAdmin ) {
  const token = jwt.sign(
    { _id, isAdmin },
    process.env.JWT_PRIVATE_KEY,
  );
  return token;
}

module.exports = {
  login,
  signup,
};
