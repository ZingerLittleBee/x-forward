import {
    ArgumentsHost,
    BadRequestException,
    Catch,
    ExceptionFilter,
    HttpException,
    HttpStatus,
    Logger
} from '@nestjs/common'
import { Request, Response } from 'express'
import { CannotCreateEntityIdMapError, EntityNotFoundError, QueryFailedError } from 'typeorm'

@Catch()
export class GlobalExceptionFilter implements ExceptionFilter {
    catch(exception: unknown, host: ArgumentsHost) {
        const ctx = host.switchToHttp()
        const response = ctx.getResponse<Response>()
        const request = ctx.getRequest<Request>()
        let message = (exception as any).message.message
        let code = 'HttpException'

        Logger.error(message, (exception as any).stack, `${request.method} ${request.url}`)

        let status = HttpStatus.INTERNAL_SERVER_ERROR

        switch (exception.constructor) {
            case BadRequestException:
                status = (exception as BadRequestException).getStatus()
                const response = (exception as BadRequestException).getResponse()
                if (response) {
                    const msg = (response as any)?.message
                    message = Array.isArray(msg) ? msg.join('\n') : msg
                } else {
                    message = exception
                }
                break
            case HttpException:
                status = (exception as HttpException).getStatus()
                message = exception
                break
            case QueryFailedError: // this is a TypeOrm error
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as QueryFailedError).message
                code = (exception as any).code
                break
            case EntityNotFoundError: // this is another TypeOrm error
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as EntityNotFoundError).message
                code = (exception as any).code
                break
            case CannotCreateEntityIdMapError: // and another
                status = HttpStatus.UNPROCESSABLE_ENTITY
                message = (exception as CannotCreateEntityIdMapError).message
                code = (exception as any).code
                break
            default:
                status = HttpStatus.INTERNAL_SERVER_ERROR
                message = exception
        }
        response.status(status).json(GlobalResponseError(status, message, code, request))
    }
}

export const GlobalResponseError: (
    statusCode: number,
    message: string,
    code: string,
    request: Request
) => IResponseError = (statusCode: number, message: string, code: string, request: Request): IResponseError => {
    return {
        success: false,
        statusCode: statusCode,
        message,
        code,
        timestamp: new Date().toISOString(),
        path: request.url,
        method: request.method
    }
}

export interface IResponseError {
    statusCode: number
    message: string
    code: string
    timestamp: string
    path: string
    method: string
    success: boolean
}
