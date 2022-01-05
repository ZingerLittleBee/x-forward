import { removeInvalidField } from '@x-forward/common'

const optimizedMetadataKey = Symbol('optimized')

/**
 * 参数预处理
 * 配置 @Optimized() 标识注解使用
 * @returns Function
 */
export function Preprocess() {
    // eslint-disable-next-line @typescript-eslint/ban-types
    return function (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
        const method = descriptor.value
        descriptor.value = function (...rest: any[]) {
            const optimizedParameters: number[] = Reflect.getOwnMetadata(optimizedMetadataKey, target, propertyName)
            if (optimizedParameters) {
                for (const parameterIndex of optimizedParameters) {
                    const value = rest[parameterIndex]
                    if (typeof value === 'object') {
                        rest[parameterIndex] = removeInvalidField(value)
                    }
                }
            }
            return method.apply(this, rest)
        }
    }
}

/**
 * 清除未初始化的字段
 * @returns Function
 */
export function Optimized() {
    return function (target: unknown, propertyKey: string | symbol, parameterIndex: number) {
        const existingRequiredParameters: number[] =
            Reflect.getOwnMetadata(optimizedMetadataKey, target, propertyKey) || []
        existingRequiredParameters.push(parameterIndex)
        Reflect.defineMetadata(optimizedMetadataKey, existingRequiredParameters, target, propertyKey)
    }
}
