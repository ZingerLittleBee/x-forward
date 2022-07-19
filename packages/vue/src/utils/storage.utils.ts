const namespace = '@x-forward/view/'

export const set = (key: string, value: unknown) => {
    localStorage.setItem(namespace + key, JSON.stringify(value))
}

export const get = (key: string) => {
    const value = localStorage.getItem(namespace + key)
    try {
        return value ? JSON.parse(value) : undefined
    } catch {
        return value
    }
}
