export const getEnumKeyByValue = (value: any, enums: any) => {
    return Object.keys(enums)
        .filter(key => {
            return enums[key] !== undefined
        })
        .find(l => enums[l] === value)
}

// enum to ['value: key']
export const enumToString = (enums: any) => {
    return Object.keys(enums)
        .filter(key => {
            return enums[key] !== undefined
        })
        .map(e => `${enums[e]}: ${e}`)
}

export const getValuesOfEnum = (enums: Record<string, string | number>) => {
    return Object.keys(enums)
        .filter(key => !(parseInt(key) >= 0))
        .map(e => enums[e])
}

export const getKeysOfEnum = (enums: any) => {
    return Object.keys(enums).filter(key => !(parseInt(key) >= 0))
}
