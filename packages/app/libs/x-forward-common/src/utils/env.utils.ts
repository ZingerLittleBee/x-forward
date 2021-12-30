import { DefaultEnum } from '@app/x-forward-common'
import { isUndef } from './common.utils'

// process.env util
export const getEnvSetting = (key: string): string => {
    return isUndef(process.env[key]) ? (isUndef(DefaultEnum[key]) ? '' : DefaultEnum[key]) : process.env[key]
}
