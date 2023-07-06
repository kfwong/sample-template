import {MiddlewareObj} from "@middy/core";
import {StatusCodes} from "http-status-codes";

export enum E400 {
    RECORD_NOT_FOUND = "Unable to find the record"
}
export enum E500 {
    SAMPLE_TEMPLATE_TABLE_FAIL_TO_CREATE = "Unable to create record in sample-template-table",
    UNKNOWN_ERROR = "Unknown error"
}

export const errorHandler = (): MiddlewareObj => {
    return {
        onError: async (request) => {
            const error = request.error?.message || ""

            if (isErrorTypeOf(E400, error)) {
                return {
                    statusCode: StatusCodes.BAD_REQUEST,
                    body: JSON.stringify({
                        message: error
                    })
                }
            }

            if (isErrorTypeOf(E500, error)) {
                return {
                    statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                    body: JSON.stringify({
                        message: error
                    })
                }
            }

            console.log(error)

            return {
                statusCode: StatusCodes.INTERNAL_SERVER_ERROR,
                body: JSON.stringify({
                    message: E500.UNKNOWN_ERROR
                })
            }
        }
    }
}

const isErrorTypeOf = (errorTypeToCheck, error) => {
    return Object.keys(errorTypeToCheck)[Object.values(errorTypeToCheck).indexOf(error)]
}