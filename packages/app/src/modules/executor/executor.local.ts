import { Cache } from 'cache-manager'
import { readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { EnvEnum } from 'src/enums/EnvEnum'
import { NginxConfigArgsEnum } from 'src/enums/NginxEnum'
import ShellEnum from 'src/enums/ShellEnum'
import { v4, validate } from 'uuid'
import { ExecutorInterface } from './interface/executor.interface'
import { fetchNginxConfigArgs, getNginxCache } from './utils/cache.util'
import { ShellExec } from './utils/shell.util'

export class ExecutorLocal implements ExecutorInterface {
    constructor(private bin: string, private cacheManager: Cache) {
        this.bin = bin
        this.cacheManager = cacheManager
    }
    async getNginxVersion() {
        return ShellExec(this.bin, '-V')
    }
    async getNginxBin() {
        return this.bin
    }
    async getNginxConfigArgs() {
        return fetchNginxConfigArgs(await this.getNginxVersion(), this.cacheManager)
    }
    async mainConfigAppend(appendString: string) {
        ShellExec(ShellEnum.ECHO, '-e', appendString, '>>', await this.getMainConfigPath())
    }
    async getMainConfigContent() {
        return readFile(await this.getMainConfigPath(), 'utf-8')
    }
    async getStreamDirectory() {
        return join(await this.getPrefix(), process.env[EnvEnum.STREAM_DIR])
    }
    async getPrefix() {
        return (await getNginxCache(this.cacheManager))?.args[NginxConfigArgsEnum.PREFIX]?.value
    }
    async getMainConfigPath() {
        return (await getNginxCache(this.cacheManager))?.args[NginxConfigArgsEnum.CONF_PATH].value
    }
    async getStreamConfigPath() {
        let streamDir = await this.getStreamDirectory()
        // 获取目录下文件列表
        let fileList = await readdir(streamDir)
        for (let i = 0; i < fileList.length; i++) {
            let fileName = fileList[i].split('.')[0]
            // 如果文件名是 uuid, 则直接返回
            if (validate(fileName)) {
                return join(streamDir, fileList[i])
            }
        }
        // 不存在, 则创建文件
        let newStreamPath = join(streamDir, `${v4()}.conf`)
        ShellExec(ShellEnum.TOUCH, [newStreamPath])
        return newStreamPath
    }
    async getStreamFileContent() {
        return readFile(await this.getStreamConfigPath(), { encoding: 'utf-8' })
    }
    streamPatch() {}
    getHTTPConfigPath: () => Promise<string>
}
