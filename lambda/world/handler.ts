import middy from '@middy/core';
import jsonBodyParser from '@middy/http-json-body-parser';
import httpSecurityHeaders from '@middy/http-security-headers';
import httpHeaderNormalizer from '@middy/http-header-normalizer';
import { errorHandler } from '../../libs/middleware/errorHandler';
import { APIGatewayProxyHandler } from 'aws-lambda';
import SampleTemplateTableRepository, {
    Fruit,
} from '../../libs/repository/SampleTemplateTableRepository';
import { DynamoDBClientConfig } from '@aws-sdk/client-dynamodb';
import { InvokeCommand, LambdaClient, LogType } from '@aws-sdk/client-lambda';

let repo: SampleTemplateTableRepository;

const lambda: APIGatewayProxyHandler = async (event, context) => {
    console.log(event);
    console.log(context);

    if (!repo) {
        repo = new SampleTemplateTableRepository(
            config(),
            process.env.SAMPLE_TEMPLATE_TABLE_NAME,
        );
    }

    const payload = (event.body as unknown as Fruit[]) || [];

    await Promise.all(payload.map((entry) => repo.create(entry)));

    const invokeResult = await invokeHello();

    console.log(invokeResult);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'world',
        }),
    };
};

const invokeHello = async () => {
    const client = new LambdaClient({ region: 'ap-southeast-1' });
    const command = new InvokeCommand({
        FunctionName: 'sample-template-dev-bacon',
        Payload: JSON.stringify({}),
        LogType: LogType.Tail,
    });

    const { Payload, LogResult } = await client.send(command);
    const result = Buffer.from(Payload as never).toString();
    const logs = Buffer.from(LogResult as never, 'base64').toString();
    return { logs, result };
};

export const main = middy(lambda)
    .use(httpHeaderNormalizer())
    .use(jsonBodyParser())
    .use(httpSecurityHeaders())
    .use(errorHandler());

export const config = () => ({}) as DynamoDBClientConfig;
