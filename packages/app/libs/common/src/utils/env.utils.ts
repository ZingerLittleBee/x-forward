import { isUndef } from '@x-forward/shared'
import { EnvKeyEnum, DefaultEnum } from '..'

/**
 * Firstly, try to get value from ${process.env[key]}
 * Secondly, try to get value from `${defaultEnum[key]}`
 * @param key key
 * @param defaultEnum defaultEnum
 */
export const getEnvSetting = (key: string, defaultEnum: Record<any, any> = DefaultEnum): string => {
    return isUndef(process.env[key]) ? (isUndef(defaultEnum[key]) ? '' : defaultEnum[key]) : process.env[key]
}

/**
 * get communication key from process env
 */
export const getCommunicationKey = () => {
    return process.env[EnvKeyEnum.CommunicationKey]
}
