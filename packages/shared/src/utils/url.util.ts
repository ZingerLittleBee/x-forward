export const removeProtocol = (url: string) => {
    const protocols = ['http://', 'https://', 'file://']
    protocols.forEach(p => {
        if (url?.startsWith(p)) {
            url = url.replace(p, '')
        }
    })
    return url
}
