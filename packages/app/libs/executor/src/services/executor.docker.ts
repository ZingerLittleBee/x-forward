import { Logger } from '@nestjs/common'
import {
    appendFileInDocker,
    dockerExec,
    EnvKeyEnum,
    getEnvSetting,
    getNginxCache,
    MakeSureDirectoryExists,
    NginxConfigArgsEnum,
    RemoveEndOfLine,
    ShellEnum
} from '@x-forward/common'
import { getValueFromCache } from '@x-forward/common/utils/cache.utils'
import { IExecutor } from '@x-forward/executor/interfaces'
import { Cache } from 'cache-manager'
import { ExecutorAbs } from './executor.abs'
import { CacheKeyEnum } from '@x-forward/executor/enums/key.enum'
import {
    fetchDirectoryHandler,
    mainConfigPathHandler,
    nginxConfigArgsHandler,
    nginxPrefixHandler,
    nginxReloadHandler,
    nginxRestartHandler,
    nginxStatusHandler,
    nginxVersionHandler,
    streamConfigPathHandler,
    streamDirectoryHandler,
    systemInfoHandler,
    updateFileContentHandler
} from '@x-forward/executor/utils/handler.utils'

export class ExecutorDocker extends ExecutorAbs implements IExecutor {
    constructor(private readonly containerName: string, private readonly cacheManager: Cache) {
        super()
        this.containerName = containerName
        this.cacheManager = cacheManager
    }

    async getSystemInfo() {
        return systemInfoHandler(this.cacheManager, { isDocker: true, containerName: this.containerName })
    }
    async queryNginxStatus() {
        return nginxStatusHandler({ isDocker: true, containerName: this.containerName })
    }
    async fetchDirectory(path: string) {
        return fetchDirectoryHandler(path, { isDocker: true, containerName: this.containerName })
    }

    async getNginxVersion() {
        const nginxBin = await this.getNginxBin()
        // why return value of `nginx -V` in the stderr
        return nginxVersionHandler(nginxBin, this.cacheManager, { isDocker: true, containerName: this.containerName })
    }

    @RemoveEndOfLine()
    async getNginxBin() {
        const nginxBinInCache = getValueFromCache<string>(this.cacheManager, CacheKeyEnum.NginxBin)
        if (nginxBinInCache) return nginxBinInCache
        const nginxBinInArgs = (await getNginxCache(this.cacheManager))?.args[NginxConfigArgsEnum.SBIN_PATH]?.value
        if (nginxBinInArgs) return this.cacheManager.set<string>(CacheKeyEnum.NginxBin, nginxBinInArgs)
        const nginxBinInEnv = getEnvSetting[EnvKeyEnum.NginxBin]
        if (nginxBinInEnv) return this.cacheManager.set<string>(CacheKeyEnum.NginxBin, nginxBinInEnv)
        const { res } = await dockerExec(this.containerName, ShellEnum.WHICH, 'nginx')
        if (!res) throw new Error('找不到 nginx 执行目录')
        return this.cacheManager.set<string>(CacheKeyEnum.NginxBin, res)
    }

    async getNginxConfigArgs() {
        return nginxConfigArgsHandler(this.cacheManager, await this.getNginxVersion())
    }

    async mainConfigAppend(appendString: string) {
        await appendFileInDocker(this.containerName, await this.getMainConfigPath(), appendString)
    }

    async getMainConfigContent() {
        return (await dockerExec(this.containerName, ShellEnum.CAT, await this.getMainConfigPath())).res
    }

    async getPrefix() {
        return nginxPrefixHandler(await this.getNginxBin(), this.cacheManager, {
            isDocker: true,
            containerName: this.containerName
        })
    }
    async getMainConfigPath() {
        return mainConfigPathHandler(await this.getNginxBin(), this.cacheManager, {
            isDocker: true,
            containerName: this.containerName
        })
    }

    @MakeSureDirectoryExists(true)
    async getStreamDirectory() {
        Logger.verbose(`nginx prefix: ${await this.getPrefix()}, stream_dir: ${getEnvSetting(EnvKeyEnum.StreamDir)}`)
        return streamDirectoryHandler(await this.getNginxBin(), this.cacheManager)
    }

    async getStreamConfigPath() {
        return streamConfigPathHandler(await this.getNginxBin(), this.cacheManager, {
            isDocker: true,
            containerName: this.containerName
        })
    }
    getHTTPConfigPath: () => Promise<string>

    async getStreamFileContent() {
        return (await dockerExec(this.containerName, ShellEnum.CAT, await this.getStreamConfigPath())).res
    }

    async nginxReload() {
        await nginxReloadHandler(await this.getNginxBin(), { isDocker: true, containerName: this.containerName })
    }

    async nginxRestart() {
        await nginxRestartHandler({ isDocker: true, containerName: this.containerName })
    }

    private async updateFileContent(path: string, content: string, options?: { isRewrite: boolean }) {
        await updateFileContentHandler(await this.getNginxBin(), path, content, {
            ...options,
            isDocker: true,
            containerName: this.containerName
        })
        await this.nginxReload()
    }

    /**
     * 1. 先备份一份原配置文件, 名为 stream.conf.bak
     * 2. 新配置文件覆写
     * 3. nginx -t -c stream.conf 检查语法是否通过
     * 4. 不通过则回滚 stream.conf.bak
     * @param content 新 stream 文件内容
     */
    async streamPatch(content: string) {
        const streamPath = await this.getStreamConfigPath()
        await this.updateFileContent(streamPath, content)
    }

    async mainConfigRewrite(content: string) {
        const mainConfigPath = await this.getMainConfigPath()
        await this.updateFileContent(mainConfigPath, content, { isRewrite: true })
    }
}
