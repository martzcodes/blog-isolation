import { LambdaIntegration, RestApi } from '@aws-cdk/aws-apigateway';
import { AttributeType, ProjectionType, Table } from '@aws-cdk/aws-dynamodb';
import { ArnPrincipal, Role } from '@aws-cdk/aws-iam';
import { NodejsFunction } from '@aws-cdk/aws-lambda-nodejs';
import { App, Construct, RemovalPolicy, Stack, StackProps } from '@aws-cdk/core';

export class BlogIsolationStack extends Stack {
  constructor(scope: Construct, id: string, props: StackProps = {}) {
    super(scope, id, props);

    const TableName = 'blogIsolationTable';
    const table = new Table(this, TableName, {
      partitionKey: { name: 'PK', type: AttributeType.STRING },
      sortKey: { name: 'SK', type: AttributeType.STRING },
      removalPolicy: RemovalPolicy.DESTROY,
      tableName: TableName,
    });
    table.addGlobalSecondaryIndex({
      indexName: 'gsi',
      partitionKey: {
        name: 'PK1',
        type: AttributeType.STRING,
      },
      sortKey: {
        name: 'SK1',
        type: AttributeType.STRING,
      },
      projectionType: ProjectionType.ALL,
    });

    const lambdaProps = {
      entry: './src/lambdas/reader.ts',
      environment: {
        TableName,
        TableArn: table.tableArn,
        MainTenant: 'Tenant#1',
      },
    };

    const initFunction = new NodejsFunction(this, 'blogIsolationInitFn', {
      ...lambdaProps,
      entry: './src/lambdas/init.ts',
      handler: 'handler',
    });

    const grantFunction = new NodejsFunction(this, 'blogIsolationGrantFn', {
      ...lambdaProps,
      handler: 'handler',
    });

    const noGrantFunction = new NodejsFunction(this, 'blogIsolationNoGrantFn', {
      ...lambdaProps,
      handler: 'handler',
    });

    const grantAuthRole = new Role(this, 'grantFnRole', {
      assumedBy: new ArnPrincipal(grantFunction.role!.roleArn),
    });
    grantFunction.addEnvironment('AuthRole', grantAuthRole.roleArn);
    const noGrantAuthRole = new Role(this, 'noGrantFnRole', {
      assumedBy: new ArnPrincipal(noGrantFunction.role!.roleArn),
    });
    noGrantFunction.addEnvironment('AuthRole', noGrantAuthRole.roleArn);

    table.grantReadWriteData(initFunction);
    table.grantReadData(grantFunction);
    table.grantReadData(grantAuthRole);

    const api = new RestApi(this, 'blogIsolationApi');
    const initResource = api.root.addResource('init');
    initResource.addMethod('GET', new LambdaIntegration(initFunction));

    const grant = api.root.addResource('grant');
    const grantWhat = grant.addResource('{what}');
    grantWhat.addMethod('GET', new LambdaIntegration(grantFunction));
    const grantWhatWho = grantWhat.addResource('{gsi}');
    grantWhatWho.addMethod('GET', new LambdaIntegration(grantFunction));

    const noGrant = api.root.addResource('noGrant');
    const noGrantWhat = noGrant.addResource('{what}');
    noGrantWhat.addMethod('GET', new LambdaIntegration(noGrantFunction));
    const noGrantWhatWho = noGrantWhat.addResource('{gsi}');
    noGrantWhatWho.addMethod('GET', new LambdaIntegration(noGrantFunction));
  }
}

// for development, use account/region from cdk cli
const devEnv = {
  account: process.env.CDK_DEFAULT_ACCOUNT,
  region: process.env.CDK_DEFAULT_REGION,
};

const app = new App();

new BlogIsolationStack(app, 'blogIsolationStack', { env: devEnv });

app.synth();