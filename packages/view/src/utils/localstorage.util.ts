export const computeIfPresent = (key: string, candidate: string | undefined) => {
    if (localStorage.getItem(key)) return localStorage.getItem(key)
    localStorage.setItem(key, candidate ? candidate : '')
    return candidate
}
