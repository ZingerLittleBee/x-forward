import { ApiProperty } from '@nestjs/swagger'
import { IResult } from '../interfaces'

export class Result<T> {
    @ApiProperty({ description: '请求是否成功' })
    success: boolean

    @ApiProperty({ description: '提示信息' })
    message?: string

    @ApiProperty()
    data?: T

    static ok(): IResult<any> {
        return {
            success: true
        }
    }

    static okData(t: any): IResult<any> {
        return {
            success: true,
            data: t
        }
    }

    static okMsg(message: string): IResult<any> {
        return {
            success: true,
            message
        }
    }

    okWithData(t: T) {
        return {
            success: true,
            data: t
        }
    }

    static no(): IResult<any> {
        return {
            success: false
        }
    }

    static noWithMsg(message: string): IResult<any> {
        return {
            success: false,
            message
        }
    }
}
