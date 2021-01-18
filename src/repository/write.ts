import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { AWSError } from 'aws-sdk/lib/error';
import { PromiseResult } from 'aws-sdk/lib/request';

export const write = (): Promise<PromiseResult<DocumentClient.BatchWriteItemOutput, AWSError>> => {
  const mainTenant = `${process.env.MainTenant}`;
  const db = new DocumentClient();
  const TableName = `${process.env.TableName}`;
  return db.batchWrite({
    RequestItems: {
      [TableName]: [
        {
          PutRequest: {
            Item: {
              PK: mainTenant,
              SK: 'Item#1',
              PK1: mainTenant,
              SK1: 'Item#1',
            },
          },
        },
        {
          PutRequest: {
            Item: {
              PK: 'Tenant#2',
              SK: 'Item#2',
              PK1: 'Tenant#2',
              SK1: 'Item#2',
            },
          },
        },
        {
          PutRequest: {
            Item: {
              PK: 'Tenant#2',
              SK: 'Item#3',
              PK1: mainTenant,
              SK1: 'Item#3',
            },
          },
        },
      ],
    },
  }).promise();
};