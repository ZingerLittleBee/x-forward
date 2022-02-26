import { Logger } from '@nestjs/common'
import { inspect } from 'util'
import { IResult } from '../interfaces'

/**
 * auto wrapper try catch on async func which returns IResult
 * @param func async func
 * @param funcName to error message
 * @returns T
 */
export const errorHandleWarpper = async <T>(func: () => Promise<any>, funcName: string) => {
    let res: IResult<T>
    try {
        res = await func()
        if (res?.success) {
            Logger.verbose(`invoke ${funcName} data: ${inspect(res)}, success`)
        } else {
            Logger.error(`invoke ${funcName} occurred fault: ${res?.message}`)
        }
    } catch (e) {
        Logger.error(`invoke ${funcName} occurred error: ${(e as Error)?.message ? (e as Error)?.message : inspect(e)}`)
    }
    return res?.data
}
