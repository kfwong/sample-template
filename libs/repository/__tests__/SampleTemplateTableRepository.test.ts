import SampleTemplateTableRepository from '../SampleTemplateTableRepository';

describe('SampleTemplateTableRepository', () => {
    const repo = new SampleTemplateTableRepository(
        {
            region: process.env.REGION,
            endpoint: process.env.SAMPLE_TEMPLATE_TABLE_ENDPOINT,
        },
        process.env.SAMPLE_TEMPLATE_TABLE_NAME,
    );
    it('should return created entry in the response', async () => {
        await repo.create({
            id: 'apple',
            type: 'gala',
            price: 1,
        });

        const result = await repo.get({
            id: 'apple',
            type: 'gala',
        });

        expect(result).toStrictEqual({
            id: 'apple',
            type: 'gala',
            price: 1,
        });
    });

    it('should return a list of entries', async () => {
        await repo.create({
            id: 'apple',
            type: 'gala',
            price: 1,
        });
        await repo.create({
            id: 'apple',
            type: 'fuji',
            price: 2,
        });
        await repo.create({
            id: 'apple',
            type: 'jonagold',
            price: 3,
        });

        const result = await repo.list('apple');

        expect(result).toStrictEqual([
            {
                id: 'apple',
                price: 2,
                type: 'fuji',
            },
            {
                id: 'apple',
                price: 1,
                type: 'gala',
            },
            {
                id: 'apple',
                price: 3,
                type: 'jonagold',
            },
        ]);
    });
});
