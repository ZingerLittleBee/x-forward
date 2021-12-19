import DefaultEnum from '../enums/default.enum'
import { isUndef } from './common.util'

// process.env util
export const getEnvSetting = (key: string): string => {
    return isUndef(process.env[key]) ? (isUndef(DefaultEnum[key]) ? '' : DefaultEnum[key]) : process.env[key]
}
