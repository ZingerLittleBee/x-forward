/**
 * get key by value in enum
 * @param value value in enum
 * @param enums enum
 */
export const getEnumKeyByValue = (value: any, enums: any) => {
    return Object.keys(enums)
        .filter(key => {
            return enums[key] !== undefined
        })
        .find(l => enums[l] === value)
}

/**
 * use for api docs desc
 * @param enums enum
 */
export const enumToString = (enums: any) => {
    return Object.keys(enums)
        .filter(key => {
            return enums[key] !== undefined
        })
        .map(e => `${enums[e]}: ${e}`)
}

/**
 * get enum values
 * @param enums enum
 */
export const getValuesOfEnum = (enums: Record<string, string | number>) => {
    return Object.keys(enums)
        .filter(key => !(parseInt(key) >= 0))
        .map(e => enums[e])
}

/**
 * get enum keys
 * @param enums
 */
export const getKeysOfEnum = (enums: any) => {
    return Object.keys(enums).filter(key => !(parseInt(key) >= 0))
}
