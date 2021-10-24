import { existsSync, mkdirSync } from "fs"
import { $, nothrow } from 'zx'

/**
 * 判断文件夹是否存在, 不存在则创建
 * @param isDocker 是否为外部 docker 容器
 * @returns Function
 */
export const MakesureDirectoryExists = (isDocker?: boolean) => {
    return function (_target: any, _propertyKey: string, descriptor: PropertyDescriptor) {
        let originalMethod = descriptor.value
        descriptor.value = async function(...args: any[]) {
            const res = await Reflect.apply(originalMethod, this, args)
            if (isDocker) {
                let { exitCode } = await nothrow($`docker exec ${this.containerName} ls ${res}`)
                if (exitCode !== 0) {
                    $`docker exec ${this.containerName} mkdir -p ${res}`
                }
            } else if (!existsSync(res)) {
                mkdirSync(res, { recursive: true })
            }
            return res
        }
        return descriptor
    }
}