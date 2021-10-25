import { existsSync, mkdirSync } from 'fs'

export const makesureDirectoryExists = (dir: string) => {
    // 判断文件夹是否存在, 不存在则创建
    if (!existsSync(dir)) {
        mkdirSync(dir, { recursive: true })
    }
}