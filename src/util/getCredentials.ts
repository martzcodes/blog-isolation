import { Effect } from '@aws-cdk/aws-iam';
import { STS } from 'aws-sdk';

const sts = new STS();

export const getCredentials = async(who: string) => {
  const Policy = JSON.stringify({
    Statement: [
      {
        Action: 'dynamodb:Query',
        Condition: {
          'ForAllValues:StringLike': {
            'dynamodb:LeadingKeys': [`Tenant#${who}`],
          },
        },
        Effect: Effect.ALLOW,
        Resource: `${process.env.TableArn}`,
      },
      // When using GSIs the below is required...
      {
        Action: 'dynamodb:Query',
        Condition: {
          'ForAllValues:StringLike': {
            'dynamodb:LeadingKeys': [`Tenant#${who}`],
          },
        },
        Effect: Effect.ALLOW,
        Resource: `${process.env.TableArn}/*`,
      },
    ],
  });
  const { Credentials } = await sts.assumeRole({
    RoleArn: `${process.env.AuthRole}`,
    RoleSessionName: `userSession${new Date().getTime().toString()}`,
    Policy,
  }).promise();
  return {
    accessKeyId: Credentials!.AccessKeyId,
    secretAccessKey: Credentials!.SecretAccessKey,
    sessionToken: Credentials!.SessionToken,
  };
};