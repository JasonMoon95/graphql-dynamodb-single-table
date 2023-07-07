import { Stack, StackProps } from 'aws-cdk-lib';
import { AttributeType, BillingMode, Table } from 'aws-cdk-lib/aws-dynamodb';
import { Construct } from 'constructs';
import { AuthorizationType, FieldLogLevel, GraphqlApi, MappingTemplate, Schema } from "@aws-cdk/aws-appsync-alpha";
import { CfnApiKey } from 'aws-cdk-lib/aws-appsync';
import { CfnOutput } from 'aws-cdk-lib';

export class SingleTableCdkStack extends Stack {
  constructor(scope: Construct, id: string, props?: StackProps) {
    super(scope, id, props);

    const dynamodbTable = new Table(this, 'DynamoDBTable', {
      partitionKey: { name: 'PK', type: AttributeType.STRING},
      sortKey: { name: 'SK', type: AttributeType.STRING},
      billingMode: BillingMode.PAY_PER_REQUEST
    })


    const api = new GraphqlApi(this, 'Api', {
      name: 'DynamoDBSingleTable',
      schema: Schema.fromAsset('lib/schema.graphql'),
      authorizationConfig: {
        defaultAuthorization: {
          authorizationType: AuthorizationType.API_KEY
        }
      },
      logConfig: {
        fieldLogLevel: FieldLogLevel.ALL
      },
      xrayEnabled: true
    })

    const tableDatasource = api.addDynamoDbDataSource('DynamoDBTable', dynamodbTable)

    tableDatasource.createResolver({
      typeName: 'Query',
      fieldName: 'getUser',
      requestMappingTemplate: MappingTemplate.fromFile('lib/mapping-templates/Query.getUser.request.vtl'),
      responseMappingTemplate: MappingTemplate.fromFile('lib/mapping-templates/Query.getUser.response.vtl'),
    })

    tableDatasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createUser',
      requestMappingTemplate: MappingTemplate.fromFile('lib/mapping-templates/Mutation.createUser.request.vtl'),
      responseMappingTemplate: MappingTemplate.fromFile('lib/mapping-templates/Mutation.createUser.response.vtl'),
    })

    tableDatasource.createResolver({
      typeName: 'Query',
      fieldName: 'getImage',
      requestMappingTemplate: MappingTemplate.fromFile('lib/mapping-templates/Query.getImage.request.vtl'),
      responseMappingTemplate: MappingTemplate.fromFile('lib/mapping-templates/Query.getImage.response.vtl'),
    })

    tableDatasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createImage',
      requestMappingTemplate: MappingTemplate.fromFile('lib/mapping-templates/Mutation.createImage.request.vtl'),
      responseMappingTemplate: MappingTemplate.fromFile('lib/mapping-templates/Mutation.createImage.response.vtl'),
    })

    tableDatasource.createResolver({
      typeName: 'Mutation',
      fieldName: 'createOwnedImage',
      requestMappingTemplate: MappingTemplate.fromFile('lib/mapping-templates/Mutation.createOwnedImage.request.vtl'),
      responseMappingTemplate: MappingTemplate.fromFile('lib/mapping-templates/Mutation.createOwnedImage.response.vtl'),
    })

    tableDatasource.createResolver({
      typeName: 'Query',
      fieldName: 'getRandomImage',
      requestMappingTemplate: MappingTemplate.fromFile('lib/mapping-templates/Query.getRandomImage.request.vtl'),
      responseMappingTemplate: MappingTemplate.fromFile('lib/mapping-templates/Query.getRandomImage.response.vtl'),
    })

    tableDatasource.createResolver({
      typeName: 'Query',
      fieldName: 'getOwnedImageForImage',
      requestMappingTemplate: MappingTemplate.fromFile('lib/mapping-templates/Query.getOwnedImageForImage.request.vtl'),
      responseMappingTemplate: MappingTemplate.fromFile('lib/mapping-templates/Query.getOwnedImageForImage.response.vtl'),
    })

    tableDatasource.createResolver({
      typeName: 'Query',
      fieldName: 'getOwnedImageForUser',
      requestMappingTemplate: MappingTemplate.fromFile('lib/mapping-templates/Query.getOwnedImageForUser.request.vtl'),
      responseMappingTemplate: MappingTemplate.fromFile('lib/mapping-templates/Query.getOwnedImageForUser.response.vtl'),
    })

    

    const apiKey = new CfnApiKey(this, 'GraphQLApiKey', {
      apiId: api.apiId
    })

    new CfnOutput(this, 'GraphQLURLOutput', {
      value: api.graphqlUrl,
      exportName: 'GraphQLURL'
    })

    new CfnOutput(this, 'GraphQLApiKeyOutput', {
      value: apiKey.attrApiKey,
      exportName: 'GraphQLApiKey'
    })
  }
}
