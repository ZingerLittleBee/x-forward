import { Logger } from '@nestjs/common'
import { inspect } from 'util'
import { IResult } from '../interfaces'

export const subscriberHandler = <T>(successFunc: (data: T) => void, funcName: string) => {
    return {
        next: (value: IResult<T>) => {
            if (value?.success) {
                Logger.verbose(`${funcName} request data: ${inspect(value?.data)} success`)
                successFunc(value?.data)
            } else {
                Logger.error(`${funcName} fault: ${value?.message}`)
            }
        },
        error: e =>
            Logger.error(
                `invoke ${funcName} occurred error: ${(e as Error)?.message ? (e as Error)?.message : inspect(e)}`
            )
    }
}
