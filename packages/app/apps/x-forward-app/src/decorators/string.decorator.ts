import { EOL } from 'os'

/**
 * 移除返回值的 EOL
 * @returns value remove EOL
 */
export const RemoveEndOfLine = () => {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value
        descriptor.value = async function (...args: any[]) {
            const res = (await Reflect.apply(originalMethod, this, args)) as string
            return res.replace(EOL, '')
        }
        return descriptor
    }
}
