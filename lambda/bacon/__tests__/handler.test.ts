import * as handler from '../handler';

describe('hello', () => {
    it('should return message hello in the body', async () => {
        const event = {
            key: 'value',
        };
        const result = await handler.main(event);

        expect(JSON.parse(result.body)).toStrictEqual({
            message: 'bacon',
        });
    });
});
