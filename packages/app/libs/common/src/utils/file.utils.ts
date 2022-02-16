import { existsSync, mkdirSync } from 'fs'

/**
 * 判断文件夹是否存在, 不存在则创建
 * @param dir
 */
export const makeSureDirectoryExists = (dir: string) => {
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
    }
}
