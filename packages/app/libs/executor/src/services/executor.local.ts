import { Logger } from '@nestjs/common'
import { EnvKeyEnum, ShellEnum, shellExec } from '@x-forward/common'
import { getEnvSetting } from '@x-forward/common/utils/env.utils'
import { IExecutor } from '@x-forward/executor/interfaces'
import {
    fetchDirectoryHandler,
    mainConfigPathHandler,
    nginxConfigArgsHandler,
    nginxPrefixHandler,
    nginxReloadHandler,
    nginxReopenHandler,
    nginxRestartHandler,
    nginxStatusHandler,
    nginxVersionHandler,
    streamConfigPathHandler,
    streamDirectoryHandler,
    systemInfoHandler,
    updateFileContentHandler
} from '@x-forward/executor/utils/handler.utils'
import { Cache } from 'cache-manager'
import { appendFile, readFile } from 'fs/promises'
import * as moment from 'moment'
import { ExecutorAbs } from './executor.abs'

export class ExecutorLocal extends ExecutorAbs implements IExecutor {
    constructor(private readonly bin: string, private readonly cacheManager: Cache) {
        super()
        this.bin = bin
        this.cacheManager = cacheManager
    }
    async nginxReopen() {
        const code = await nginxReopenHandler(await this.getNginxBin())
        if (code !== 0) {
            Logger.warn(
                `nginx reopen failed, Is nginx running?, and then try run\n$ ${await this.getNginxBin()} -s reopen`
            )
        }
    }
    async logSegmentation() {
        const currPath = await this.getStreamConfigPath()
        const [fileName, suffix] = currPath?.split('.')
        const { exitCode } = await shellExec(
            ShellEnum.MV,
            currPath,
            `${fileName}-${moment().format('YYYY-M-DD')}.${suffix}`
        )
        if (exitCode !== 0) {
            Logger.warn(
                `backup ${currPath} failed, pleace run \n$ ${ShellEnum.MV} ${currPath} ${fileName}-${moment().format(
                    'YYYY-M-DD'
                )}.${suffix}\n and then run\n$ ${await this.getNginxBin()} -s reopen`
            )
        } else {
            await this.nginxReopen()
        }
    }

    async getSystemInfo() {
        return systemInfoHandler(this.cacheManager)
    }

    async queryNginxStatus() {
        return nginxStatusHandler()
    }

    async nginxReload() {
        const code = await nginxReloadHandler(await this.getNginxBin())
        if (code !== 0) {
            Logger.warn(
                `nginx reload failed, Is nginx running?, and then try run\n$ ${await this.getNginxBin()} -s reload`
            )
        }
    }

    async nginxRestart() {
        await nginxRestartHandler()
    }

    async fetchDirectory(path: string) {
        return fetchDirectoryHandler(path)
    }
    async getNginxVersion() {
        return nginxVersionHandler(this.bin, this.cacheManager)
    }
    async getNginxBin() {
        return this.bin
    }
    async getNginxConfigArgs() {
        return nginxConfigArgsHandler(this.cacheManager, await this.getNginxVersion())
    }
    async mainConfigAppend(appendString: string) {
        await appendFile(await this.getMainConfigPath(), appendString)
    }
    async getMainConfigContent() {
        return readFile(await this.getMainConfigPath(), 'utf-8')
    }
    async getStreamDirectory() {
        Logger.verbose(`nginx prefix: ${await this.getPrefix()}, stream_dir: ${getEnvSetting(EnvKeyEnum.StreamDir)}`)
        return streamDirectoryHandler(this.bin, this.cacheManager)
    }
    async getPrefix() {
        return nginxPrefixHandler(this.bin, this.cacheManager)
    }
    async getMainConfigPath() {
        return mainConfigPathHandler(this.bin, this.cacheManager)
    }

    async getStreamConfigPath() {
        return streamConfigPathHandler(await this.getNginxBin(), this.cacheManager)
    }
    async getStreamFileContent() {
        return readFile(await this.getStreamConfigPath(), { encoding: 'utf-8' })
    }
    getHTTPConfigPath: () => Promise<string>

    private async updateFileContent(path: string, content: string, options?: { isRewrite: boolean }) {
        await updateFileContentHandler(await this.getNginxBin(), path, content, options)
        this.nginxReload()
    }

    async mainConfigRewrite(content: string): Promise<void> {
        const mainConfigPath = await this.getMainConfigPath()
        await this.updateFileContent(mainConfigPath, content, { isRewrite: true })
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
}
