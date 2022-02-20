import { existsSync, mkdirSync } from 'fs'
import { writeFile } from 'fs/promises'

/**
 * 判断文件夹是否存在, 不存在则创建
 * @param dir
 */
export const makeSureDirectoryExists = (dir: string) => {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
    }
}

export const makeSureFileExists = (path: string) => {
    writeFile(path, '')
    // const reg = /([\/\w]+\/)([\w\.]*$)/
    // const res = path.match(reg)
    // res?.[1] && makeSureDirectoryExists(res?.[1])
    // res?.[2] && write
}
