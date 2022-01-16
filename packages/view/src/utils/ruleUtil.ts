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

const ipCheck =
    /^(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])\.(\d{1,2}|1\d\d|2[0-4]\d|25[0-5])$/

const domainCheck =
    /^(?:(?:(?:[a-zA-z\-]+)\:\/{1,3})?(?:[a-zA-Z0-9])(?:[a-zA-Z0-9\-\.]){1,61}(?:\.[a-zA-Z]{2,})+|\[(?:(?:(?:[a-fA-F0-9]){1,4})(?::(?:[a-fA-F0-9]){1,4}){7}|::1|::)\]|(?:(?:[0-9]{1,3})(?:\.[0-9]{1,3}){3}))(?:\:[0-9]{1,5})?$/

export const hostRule = () => {
    return () => ({
        validator(_: any, value: any) {
            if (!value) {
                return Promise.resolve()
            }
            if (!domainCheck.test(value) && ipCheck.test(value)) {
                return Promise.resolve()
            }
            if (!ipCheck.test(value) && domainCheck.test(value)) {
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
            if (!value || /[0-9]+(s|m|h|d)$/.test(value)) return Promise.resolve()
            return Promise.reject(new Error('The time must end with an s|m|h|d'))
        }
    })
}
