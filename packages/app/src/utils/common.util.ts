export function isUndef(v: any): boolean {
    return v === undefined || v === null
}

export function isDef(v: any): boolean {
    return v !== undefined && v !== null
}

export function isTrue(v: any): boolean {
    return v === true
}

export function isFalse(v: any): boolean {
    return v === false
}

/**
 * Check if value is primitive.
 */
export function isPrimitive(value: any): boolean {
    return (
        typeof value === 'string' ||
        typeof value === 'number' ||
        typeof value === 'symbol' ||
        typeof value === 'boolean'
    )
}

export function isObject(obj: any): boolean {
    return obj !== null && typeof obj === 'object'
}

export function removeEOL(str: string) {}
