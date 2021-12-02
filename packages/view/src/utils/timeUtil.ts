const zeroFill = (data: number | string) => {
    if (typeof data === 'number') {
        if (data < 10) return `0${data}`
    }
    if (typeof data === 'string') {
        if (data.length === 1) return `0${data}`
    }
    return data
}

export const utc2local = (time: string) => {
    const date = new Date(time)
    return `${date.getFullYear()}/${zeroFill(date.getMonth())}/${zeroFill(date.getDate())} ${zeroFill(date.getHours())}:${zeroFill(
        date.getMinutes()
    )}:${zeroFill(date.getSeconds())}`
}
