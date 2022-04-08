import { domainRegExp, ipRegExp } from '@forwardx/shared'
// eslint-disable-next-line @typescript-eslint/ban-ts-comment
// @ts-ignore
import type { RuleType } from 'rc-field-form/lib/interface'

export const requiredRule = (description: string) => {
    const rule: { required: boolean; message?: string } = { required: true }
    return description ? { ...rule, message: `请输入${description}` } : rule
}

export const portRule = (min = 0, max = 65535) => {
    return () => ({
        validator(_: any, value: any) {
            if (!value || (value >= min && value <= max)) return Promise.resolve()
            return Promise.reject(new Error('Port must range in 0 to 65535'))
        }
    })
}

export const hostRule = () => {
    return () => ({
        validator(_: any, value: any) {
            if (!value) {
                return Promise.resolve()
            }
            if (!domainRegExp.test(value) && ipRegExp.test(value)) {
                return Promise.resolve()
            }
            if (!ipRegExp.test(value) && domainRegExp.test(value)) {
                return Promise.resolve()
            }
            return Promise.reject(new Error('Please input valid domain or ip'))
        }
    })
}

export const typeRule = (type: RuleType, message?: string) => {
    return {
        type,
        message: message ? message : `Field must be type of ${type}`
    }
}

// [0-9]+(s|m|h|d)$
export const timeRule = () => {
    return () => ({
        validator(_: any, value: any) {
            if (!value || /[0-9]+([smhd])$/.test(value)) return Promise.resolve()
            return Promise.reject(new Error('The time must end with an s|m|h|d'))
        }
    })
}
