module.exports = {
    port: 8001,
    tables: [
        {
            TableName: `sample-template-table`,
            KeySchema: [
                { AttributeName: 'id', KeyType: 'HASH' },
                { AttributeName: 'type', KeyType: 'RANGE' },
            ],
            AttributeDefinitions: [
                { AttributeName: 'id', AttributeType: 'S' },
                { AttributeName: 'type', AttributeType: 'S' },
            ],
            ProvisionedThroughput: {
                ReadCapacityUnits: 1,
                WriteCapacityUnits: 1,
            },
        },
    ],
};
