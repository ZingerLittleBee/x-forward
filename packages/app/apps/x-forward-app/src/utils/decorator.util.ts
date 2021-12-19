export const simpleAop = (cb: (res: any) => void) => {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        const originalMethod = descriptor.value
        descriptor.value = async function (...args: any[]) {
            const res = await Reflect.apply(originalMethod, this, args)
            cb(res)
            return res
        }
        return descriptor
    }
}
