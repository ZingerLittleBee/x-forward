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

export const getValuesOfEnum = (enums: any) => {
    return Object.keys(enums).filter(key => {
        return enums[key] !== undefined
    })
}

export const getKeysOfEnum = (enums: any) => {
    return getValuesOfEnum(enums)?.map(e => enums[e])
}
