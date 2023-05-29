import { 
  GetCommand, 
  PutCommand, 
  UpdateCommand, 
  DeleteCommand,
  ScanCommand 
} from '@aws-sdk/lib-dynamodb';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from "aws-lambda";
import * as yup from 'yup'
import { randomUUID } from 'crypto';
import { ddbDocClient } from './lib/ddbDocClient'

const tabName = "UsersTable";

const schema = yup.object().shape({
  name: yup.string().required(),
  email: yup.string().email().required()
})

class HttpError extends Error {
  constructor(public statusCode: number, body: Record<string, unknown> = {}) {
    super(JSON.stringify(body));
  }
};

const handleError = (e: unknown) => {
  if(e instanceof yup.ValidationError) {
    return {
      statusCode: 400,
      body: JSON.stringify({
        errors: e.errors
      })
    }
  };

  if(e instanceof SyntaxError) {
     return {
      statusCode: 400,
      body: JSON.stringify({
        error: `invalid request body format : "${e.message}"`
      }),
    };
  }

  if (e instanceof HttpError) {
    return {
      statusCode: e.statusCode,
      body: e.message
    }
  };
  throw e
};

const fetchProductById = async (id: string) => {
  const params = {
    TableName: tabName,
    Key: {
      userID: id
    }
  }

  const user = await ddbDocClient.send(new GetCommand(params))

  if (!user.Item) {
    throw new HttpError(404, { error: 'Not found' })
  };

  return user.Item;
};

export const createUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const reqBody = JSON.parse(event.body as string);

    await schema.validate(reqBody, { abortEarly: false });

    const params = {
      TableName: tabName,
      Item: {
        userID: randomUUID(),
        ...reqBody,
      }
    }

    const user = await ddbDocClient.send(new PutCommand(params))
    
    return {
      statusCode: 201,
      body: JSON.stringify(
        {
          message: "Success",
          input: user,
        },
      ),
    };
  } catch (error) {
    return {
      statusCode: 400,
      body: JSON.stringify({Error: error}),
    };
  }
};


export const getUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => { 
  try {
    const user = await fetchProductById(event.pathParameters?.id as string)
    
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Success",
          input: user,
        },
      ),
    }

  } catch (error) {
   return handleError(error)
  }

};

export const updateUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => { 
  try {
    const id = event.pathParameters?.id as string
    
    await fetchProductById(id)

    const reqBody = JSON.parse(event.body as string)

    await schema.validate(reqBody, { abortEarly: false });

    const params = {
      TableName: tabName,
      Key: {
        userID: id,
      },
      UpdateExpression: "set #name = :name, #email = :email",
      ExpressionAttributeNames: {
        '#name': 'name',
        '#email': 'email'
       },
      ExpressionAttributeValues: {
        ":name": reqBody.name,
        ":email": reqBody.email,
      },
    }

    await ddbDocClient.send(new UpdateCommand(params))

    const updateUser = await fetchProductById(id)

    
    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Success",
          input: updateUser,
        },
      ),
    }

  } catch (error) {
    return handleError(error)
  }
};

export const deleteUser = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try {
    const id = event.pathParameters?.id as string
    
    await fetchProductById(id)

    const params = {
      TableName: tabName,
      Key: {
        userID: id,
      },
    }

    const deleteResponse = await ddbDocClient.send(new DeleteCommand(params))

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Success",
          input: deleteResponse,
        },
      ),
    }

  } catch (error) {
    return handleError(error)
  }
};

export const listUsers = async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
  try{
    const params = { TableName: tabName }

    const { Count, Items } = await ddbDocClient.send(new ScanCommand(params))

    return {
      statusCode: 200,
      body: JSON.stringify(
        {
          message: "Success",
          Count,
          Items
        },
      ),
    }

  } catch (error) {
    return handleError(error)
  }
};
