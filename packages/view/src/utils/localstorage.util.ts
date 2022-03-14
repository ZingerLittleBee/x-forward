export const computeIfPresent = (key: string, candidate: string | undefined): string | undefined => {
    if (localStorage.getItem(key)) {
        return localStorage.getItem(key) as string
    }
    localStorage.setItem(key, candidate ? candidate : '')
    return candidate
}
