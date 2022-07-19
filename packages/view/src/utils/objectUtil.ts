export const getKeyByValue = <T = any>(object: Record<any, T>, value: T) => {
    return Object.keys(object).find(key => object[key] === value)
}
