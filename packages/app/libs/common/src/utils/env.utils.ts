import { isUndef } from '@x-forward/shared'
import { CommonEnvKeyEnum, DefaultEnum } from '..'

// process.env util
export const getEnvSetting = (key: string, defaultEnum: Record<any, any> = DefaultEnum): string => {
    return isUndef(process.env[key]) ? (isUndef(defaultEnum[key]) ? '' : defaultEnum[key]) : process.env[key]
}

export const getCommunicationKey = () => {
    return process.env[CommonEnvKeyEnum.CommunicationKey]
}
