import * as handler from '../handler';
import SampleTemplateTableRepository from '../../../libs/repository/SampleTemplateTableRepository';
import {E400, E500} from "../../../libs/middleware/errorHandler";

describe('world', () => {
    const repo = new SampleTemplateTableRepository(
        {
            region: process.env.REGION,
            endpoint: process.env.SAMPLE_TEMPLATE_TABLE_ENDPOINT,
        },
        process.env.SAMPLE_TEMPLATE_TABLE_NAME,
    );

    beforeEach(() => {
        jest.spyOn(handler, 'config').mockReturnValue({
            region: process.env.REGION,
            endpoint: process.env.SAMPLE_TEMPLATE_TABLE_ENDPOINT,
        });
    })

    afterEach(() => {
        jest.resetAllMocks();
        jest.restoreAllMocks();
        jest.useRealTimers();
    })

    it('should return 200 world and create record in db', async () => {
        const event = {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([
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
            ]),
        } as never;

        const result = await handler.main(event, {} as never);

        const tableResult = await repo.list('apple');

        expect(JSON.parse(result.body)).toStrictEqual({
            message: 'world',
        });
        expect(tableResult).toStrictEqual([
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

    it('should return 400', async () => {
        jest.spyOn(SampleTemplateTableRepository.prototype, 'create').mockRejectedValueOnce(new Error(E400.RECORD_NOT_FOUND));

        const event = {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([
                {
                    id: 'apple',
                    price: 2,
                    type: 'fuji',
                }
            ]),
        } as never;

        const result = await handler.main(event, {} as never);

        expect(result.statusCode).toBe(400);
        expect(JSON.parse(result.body)).toStrictEqual({
            "message": E400.RECORD_NOT_FOUND
        })
    })

    it('should return 500 unable to create record', async () => {
        jest.spyOn(SampleTemplateTableRepository.prototype, 'create').mockRejectedValueOnce(new Error(E500.SAMPLE_TEMPLATE_TABLE_FAIL_TO_CREATE));

        const event = {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([
                {
                    id: 'apple',
                    price: 2,
                    type: 'fuji',
                }
            ]),
        } as never;

        const result = await handler.main(event, {} as never);

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toStrictEqual({
            "message": E500.SAMPLE_TEMPLATE_TABLE_FAIL_TO_CREATE
        })
    })

    it('should return 500 unknown error', async () => {
        jest.spyOn(SampleTemplateTableRepository.prototype, 'create').mockRejectedValueOnce(new Error("something terrible happened"));

        const event = {
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([
                {
                    id: 'apple',
                    price: 2,
                    type: 'fuji',
                }
            ]),
        } as never;

        const result = await handler.main(event, {} as never);

        expect(result.statusCode).toBe(500);
        expect(JSON.parse(result.body)).toStrictEqual({
            "message": E500.UNKNOWN_ERROR
        })
    })
});
