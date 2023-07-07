export async function main(event) {
    const authorizationToken =
        event.headers.authorization || event.headers.Authorization;

    if (authorizationToken === 'allow') {
        return {
            principalId: 'allowedUser',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Allow',
                        Resource: '*',
                    },
                ],
            },
        };
    } else {
        return {
            principalId: 'deniedUser',
            policyDocument: {
                Version: '2012-10-17',
                Statement: [
                    {
                        Action: 'execute-api:Invoke',
                        Effect: 'Deny',
                        Resource: '*',
                    },
                ],
            },
        };
    }
}
