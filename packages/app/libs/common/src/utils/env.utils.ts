import { isUndef } from '@x-forward/shared'
import { DefaultEnum } from '..'

// process.env util
export const getEnvSetting = (key: string): string => {
    return isUndef(process.env[key]) ? (isUndef(DefaultEnum[key]) ? '' : DefaultEnum[key]) : process.env[key]
}
