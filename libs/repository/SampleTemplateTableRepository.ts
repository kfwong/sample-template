import {DynamoDBClient, DynamoDBClientConfig} from '@aws-sdk/client-dynamodb';
import {
    DynamoDBDocumentClient,
    GetCommand,
    PutCommand,
    QueryCommand,
} from '@aws-sdk/lib-dynamodb';
import { E500 } from "../middleware/errorHandler"

export default class SampleTemplateTableRepository {
    private readonly config: DynamoDBClient;
    private readonly db: DynamoDBDocumentClient;
    private readonly tableName;

    constructor(
        config: DynamoDBClientConfig,
        tableName = 'sample-template-repository',
    ) {
        this.config = new DynamoDBClient(config);
        this.db = DynamoDBDocumentClient.from(this.config);
        this.tableName = tableName;
    }

    async create(fruit: Fruit) {
        try {
            const command = new PutCommand({
                TableName: this.tableName,
                Item: fruit,
            });

            return this.db.send(command);
        } catch (e) {
            throw new Error(E500.SAMPLE_TEMPLATE_TABLE_FAIL_TO_CREATE)
        }
    }

    async get(fruit: Fruit) {
        const command = new GetCommand({
            TableName: this.tableName,
            Key: fruit,
        });

        return this.db.send(command).then((result) => result.Item);
    }

    async list(id: string) {
        const command = new QueryCommand({
            TableName: this.tableName,
            KeyConditionExpression: 'id = :id',
            ExpressionAttributeValues: {
                ':id': id,
            },
        });

        return this.db.send(command).then((result) => result.Items);
    }
}

export type Fruit = {
    id: string;
    type: string;
    price?: number;
};
