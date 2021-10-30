import { removeInvalidField } from 'src/utils/object.util'

const optimizedMetadataKey = Symbol('optimized')

/**
 * 参数预处理
 * 配置 @Optimized() 标识注解使用
 * @returns Function
 */
export function Preprocess() {
    return function (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
        let method = descriptor.value!
        descriptor.value = function () {
            let optimizedParameters: number[] = Reflect.getOwnMetadata(optimizedMetadataKey, target, propertyName)
            if (optimizedParameters) {
                for (let parameterIndex of optimizedParameters) {
                    let value = arguments[parameterIndex]
                    if (typeof value === 'object') {
                        arguments[parameterIndex] = removeInvalidField(value)
                    }
                }
            }
            return method.apply(this, arguments)
        }
    }
}

/**
 * 清除未初始化的字段
 * @returns Function
 */
export function Optimized() {
    return function (target: Object, propertyKey: string | symbol, parameterIndex: number) {
        let existingRequiredParameters: number[] = Reflect.getOwnMetadata(optimizedMetadataKey, target, propertyKey) || []
        existingRequiredParameters.push(parameterIndex)
        Reflect.defineMetadata(optimizedMetadataKey, existingRequiredParameters, target, propertyKey)
    }
}
