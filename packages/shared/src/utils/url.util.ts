import { fileNameRegExp } from '../regexps/url.regexp'

export const removeProtocol = (url: string) => {
    const protocols = ['http://', 'https://', 'file://']
    protocols.forEach(p => {
        if (url?.startsWith(p)) {
            url = url.replace(p, '')
        }
    })
    return url
}

export const isFile = (path: string) => {
    return (fileNameRegExp as RegExp).test(path)
}

export const splitFileName = (path: string) => {
    return path?.match(fileNameRegExp)?.[0]
}
