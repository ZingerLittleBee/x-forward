/**
 * remove invalid field that null or undefined from object
 * @param value array or object
 * @returns
 */
export const removeInvalidField = (value: any[] | any) => {
    const handlerObject = (obj: any) => {
        const res = {}
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
        const res = []
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
    return Array.isArray(value) ? handlerArray(value) : handlerObject(value)
}
