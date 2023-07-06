export async function main(event) {
    console.log(event);

    return {
        statusCode: 200,
        body: JSON.stringify({
            message: 'hello',
        }),
    };
}
