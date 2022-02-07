import { isUndef } from '@x-forward/shared'
import { DefaultEnum } from '..'

// process.env util
export const getEnvSetting = (key: string): string => {
    console.log(`process.env[${key}]`, process.env[key])
    return isUndef(process.env[key]) ? (isUndef(DefaultEnum[key]) ? '' : DefaultEnum[key]) : process.env[key]
}
