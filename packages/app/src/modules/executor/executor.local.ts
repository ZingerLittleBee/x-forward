import { Logger } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { appendFile, readdir, readFile } from 'fs/promises'
import { join } from 'path'
import { EnvEnum } from 'src/enums/EnvEnum'
import { NginxConfigArgsEnum } from 'src/enums/NginxEnum'
import ShellEnum from 'src/enums/ShellEnum'
import { getEnvSetting } from 'src/utils/env.util'
import { v4, validate } from 'uuid'
import { ExecutorInterface } from './interface/executor.interface'
import { fetchNginxConfigArgs, getNginxCache } from './utils/cache.util'
import { ShellExec } from './utils/shell.util'

export class ExecutorLocal implements ExecutorInterface {
    constructor(private bin: string, private cacheManager: Cache) {
        this.bin = bin
        this.cacheManager = cacheManager
    }
    nginxReload() {
        ShellExec(this.bin, '-s', 'reload')
    }

    nginxRestart() {
        ShellExec(ShellEnum.SERVICE, 'nginx', 'restart')
    }
    async fetchDirectory(url: string) {
        // add "/" automatic if url no "/" at the beginning
        if (!url.match(/^\//)) {
            url = '/' + url
        }
        // ls -F ${url} | grep "/$"
        return (await ShellExec(ShellEnum.LS, '-F', url, '|', ShellEnum.GREP, '"/$"')).res
    }
    async getNginxVersion() {
        return (await ShellExec(this.bin, '-V')).res
    }
    async getNginxBin() {
        return this.bin
    }
    async getNginxConfigArgs() {
        return fetchNginxConfigArgs(await this.getNginxVersion(), this.cacheManager)
    }
    async mainConfigAppend(appendString: string) {
        appendFile(await this.getMainConfigPath(), appendString)
    }
    async getMainConfigContent() {
        return readFile(await this.getMainConfigPath(), 'utf-8')
    }
    async getStreamDirectory() {
        return join(await this.getPrefix(), getEnvSetting(EnvEnum.STREAM_DIR))
    }
    async getPrefix() {
        return (await getNginxCache(this.cacheManager))?.args[NginxConfigArgsEnum.PREFIX]?.value
    }
    async getMainConfigPath() {
        return (await getNginxCache(this.cacheManager))?.args[NginxConfigArgsEnum.CONF_PATH].value
    }
    async getStreamConfigPath() {
        // 先查找缓存
        let nginxConfigArgs = await getNginxCache(this.cacheManager)
        if (nginxConfigArgs?.args[NginxConfigArgsEnum.STREAM_PATH]?.value)
            return nginxConfigArgs?.args[NginxConfigArgsEnum.STREAM_PATH].value
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
    getHTTPConfigPath: () => Promise<string>

    /**
     * 1. 先备份一份原配置文件, 名为 stream.conf.bak
     * 2. 新配置文件覆写
     * 3. nginx -t -c stream.conf 检查语法是否通过
     * 4. 不通过则回滚 stream.conf.bak
     * @param content 新 stream 文件内容
     */
    async streamPatch(content: string) {
        const streamPath = await this.getStreamConfigPath()
        const backupRes = await ShellExec(ShellEnum.CP, streamPath, `${streamPath}.bak`)
        if (backupRes.exitCode === 0) {
            Logger.verbose(`${streamPath} 备份成功`)
        } else {
            Logger.error(`${streamPath} 备份失败, ${backupRes.res}`)
            throw new Error(`${streamPath} 备份失败, ${backupRes.res}`)
        }
        ShellExec(ShellEnum.CAT, '>', `${streamPath}<<EOF\n${content}\nEOF`)
        const { res, exitCode } = await ShellExec(await this.getNginxBin(), '-t', '-c', await this.getMainConfigPath())
        if (exitCode) {
            Logger.error(`配置文件格式有误: ${res}, 即将回滚`)
            // rollback
            const rollbackRes = await ShellExec(ShellEnum.MV, `${streamPath}.bak`, streamPath)
            rollbackRes.exitCode === 0
                ? Logger.verbose(`${streamPath} 回滚成功`)
                : Logger.error(`${streamPath} 回滚失败, ${rollbackRes.res}`)
        }
        this.nginxReload()
    }
}
