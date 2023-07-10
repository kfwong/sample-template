import { MiddlewareObj } from '@middy/core';
import { StatusCodes } from 'http-status-codes';
import { createMetricsLogger, Unit } from 'aws-embedded-metrics';

export enum E400 {
    RECORD_NOT_FOUND = 'Unable to find the record',
}

export enum E500 {
    SAMPLE_TEMPLATE_TABLE_FAIL_TO_CREATE = 'Unable to create record in sample-template-table',
    UNKNOWN_ERROR = 'Unknown error',
}

export const errorHandler = (): MiddlewareObj => {
    return {
        onError: async (request) => {
            const error = request.error?.message || '';
            const metrics = createMetricsLogger();
            metrics.setNamespace('sample-template');
            metrics.setDimensions({
                Stage: <string>process.env.STAGE,
                ServiceName: request.context.functionName,
            });

            if (isErrorTypeOf(E400, error)) {
                metrics.putMetric('E400', 1, Unit.Count);
                metrics.putMetric(isErrorTypeOf(E400, error), 1, Unit.Count);
                metrics.setProperty('RequestId', request.context.awsRequestId);
                metrics.setProperty('Error', error);
                await metrics.flush();
                return {
                    statusCode: StatusCodes.BAD_REQUEST,
                    body: JSON.stringify({
                        message: error,
                    }),
                };
            }

            if (isErrorTypeOf(E500, error)) {
                metrics.putMetric('E500', 1, Unit.Count);
                metrics.putMetric(isErrorTypeOf(E500, error), 1, Unit.Count);
                metrics.setProperty('RequestId', request.context.awsRequestId);
                metrics.setProperty('Error', error);
                await metrics.flush();
                return {
                    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    body: JSON.stringify({
                        message: error,
                    }),
                };
            }

            // else catch-all unknown error as 500 internal server error
            metrics.putMetric('E500', 1, Unit.Count);
            metrics.putMetric(E500.UNKNOWN_ERROR, 1, Unit.Count);
            metrics.setProperty('RequestId', request.context.awsRequestId);
            metrics.setProperty('Error', error);
            await metrics.flush();

            return {
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                body: JSON.stringify({
                    message: E500.UNKNOWN_ERROR,
                }),
            };
        },
    };
};

const isErrorTypeOf = (errorTypeToCheck, error) => {
    return Object.keys(errorTypeToCheck)[
        Object.values(errorTypeToCheck).indexOf(error)
    ];
};
