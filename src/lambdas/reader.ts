import middy from '@middy/core';
// eslint-disable-next-line import/no-unresolved
import { APIGatewayProxyEvent, Context } from 'aws-lambda';
import { Credentials } from 'aws-sdk';
import { readItems } from '../repository/read';
import { getCredentials } from '../util/getCredentials';

interface CredentialContext extends Context {
  credentials?: Credentials;
}

const _handler = async (event: APIGatewayProxyEvent, context: CredentialContext) => {
  const pathParameters = event.pathParameters ? event.pathParameters : {};
  const { what, gsi } = pathParameters;
  const readRes = await readItems(`${what}`, context.credentials, gsi);
  return {
    statusCode: 200,
    body: JSON.stringify({ readRes }),
  };
};

export const handler = middy(_handler).use({
  before: async (lambdaHandler, next: () => void) => {
    const queryParams = lambdaHandler.event.queryStringParameters || {};
    if (queryParams.credentials) {
      const credentials = await getCredentials(queryParams.credentials);
      Object.assign(lambdaHandler.context, { credentials });
    }
    next();
  },
});