const optimizedMetadataKey = Symbol('optimized')

/**
 * 参数预处理
 * 配置 @Optimized() 标识注解使用
 * @returns Function
 */
export function Preprocess() {
    return function (target: any, propertyName: string, descriptor: TypedPropertyDescriptor<Function>) {
        let method = descriptor.value!

        const handlerObject = (obj: Object) => {
            let res = {}
            for (const key in obj) {
                if (typeof obj[key] !== 'object' && obj[key] != undefined) {
                    res[key] = obj[key]
                    continue
                }
                if (Array.isArray(obj[key])) {
                    if (handlerArray(obj[key]).length !== 0) res[key] = handlerArray(obj[key])
                } else {
                    if (Object.keys(handlerObject(obj[key])).length !== 0) res[key] = handlerObject(obj[key])
                }
            }
            return res
        }

        const handlerArray = (array: any[]) => {
            let res = []
            for (const arr of array) {
                if (typeof arr !== 'object' && typeof arr != undefined) {
                    res.push(arr)
                    continue
                }
                if (Array.isArray(arr)) {
                    if (handlerArray(arr).length !== 0) res.push(handlerArray(arr))
                } else {
                    if (Object.keys(handlerObject(arr)).length !== 0) res.push(handlerObject(arr))
                }
            }
            return res
        }

        descriptor.value = function () {
            let optimizedParameters: number[] = Reflect.getOwnMetadata(optimizedMetadataKey, target, propertyName)
            if (optimizedParameters) {
                for (let parameterIndex of optimizedParameters) {
                    let value = arguments[parameterIndex]
                    if (typeof value === 'object') {
                        arguments[parameterIndex] = Array.isArray(value) ? handlerArray(value) : handlerObject(value)
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
