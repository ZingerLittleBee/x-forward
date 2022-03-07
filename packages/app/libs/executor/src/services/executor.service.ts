import { CACHE_MANAGER, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { EnvKeyEnum } from '@x-forward/common/enums'
import { findSomething, getEnvSetting } from '@x-forward/common/utils'
import { CacheKeyEnum } from '@x-forward/executor/enums/key.enum'
import { IExecutor } from '@x-forward/executor/interfaces'
import nginxMainConfig from '@x-forward/render/template/nginxMainConfig'
import { Cache } from 'cache-manager'
import { renderString } from 'nunjucks'
import { inspect } from 'util'
import { $ } from 'zx'
import { ExecutorDocker } from './executor.docker'
import { ExecutorLocal } from './executor.local'

@Injectable()
export class ExecutorService implements OnModuleInit {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    /**
     * nginx executor
     */
    private executor: IExecutor

    async onModuleInit() {
        await this.judgeLocalOrDocker()
        await this.initNginxConfig()
        Logger.debug(`nginx config inited`)
    }

    /**
     * check path exist, otherwise create path
     * @param path path
     */
    async existOrCreate(path: string) {
        if (!(await this.executor.checkPath(path))) {
            this.executor.mkPath(path)
        }
    }

    /**
     * 初始化
     * 1. 装载 nginx 配置参数
     * 2. 更新主配置文件 nginx.conf
     *     a) 添加 stream 模块声明 (如果不存在)
     *     b) 添加 include 外部 stream 文件 (如果不存在)
     * 3. 创建 ${prefix}/${process.env[EnvKeyEnum.STREAM_DIR]} 文件夹 (如果不存在)
     * 4. 创建 ${prefix}/stream/${process.env[EnvKeyEnum.STREAM_FILE_NAME]}
     */
    private async initNginxConfig() {
        // 装载 nginx 配置参数
        const nginxConfigArgs = await this.executor.getNginxConfigArgs()
        Logger.debug(`nginx 配置参数解析成功: ${inspect(nginxConfigArgs)}`)
        await this.cacheManager.set(CacheKeyEnum.NginxConfigArgs, nginxConfigArgs)
        const nginxMainConfigContent = await this.executor.getMainConfigContent()
        Logger.debug(`nginx 主配置文件初始内容: ${nginxMainConfigContent}`)
        const streamDir = await this.executor.getStreamDirectory()
        // 判断目录是否存在, 不存在则创建
        await this.existOrCreate(streamDir)
        Logger.debug(`nginx stream 目录: ${streamDir}`)
        // 检索 includes ${streamDir}/*.conf
        const streamConfigIncludeReg = new RegExp(`include\\s*${streamDir}/\\*.conf;`, 'i')
        const nginxIncludeBlock = streamConfigIncludeReg.exec(nginxMainConfigContent)
        Logger.verbose(`nginxIncludeBlock: ${nginxIncludeBlock}`)
        const streamBlockValue = {
            streamDir,
            logPrefix: getEnvSetting(EnvKeyEnum.LogPrefix),
            logFilePrefix: getEnvSetting(EnvKeyEnum.LogFilePrefix),
            logFormat: getEnvSetting(EnvKeyEnum.LogFormat)
        }
        Logger.verbose(`streamBlockValue: ${inspect(streamBlockValue)}`)
        if (!nginxIncludeBlock || !nginxMainConfigContent.match(/stream\s*{[\s\S]*}/)) {
            Logger.verbose(
                `未找到 stream 模块, nginx config 将被重写为:\n${renderString(nginxMainConfig, streamBlockValue)}`
            )
            await this.rewriteMainConfig(renderString(nginxMainConfig, streamBlockValue))
        }
        // 提取 stream log 位置
        const streamLogPathReg = new RegExp(
            `(?<=access_log\\s)[\-a-zA-Z/\.]+(?=\\s${getEnvSetting(EnvKeyEnum.LogFormat)})`,
            'g'
        )
        const streamLogPath = streamLogPathReg.exec(nginxMainConfigContent)?.[0]
        if (streamLogPath) {
            await this.cacheManager.set(EnvKeyEnum.StreamLogPath, streamLogPath)
            Logger.verbose(`stream log path: ${streamLogPath}`)
            await this.existOrCreate(streamLogPath)
        } else {
            Logger.warn(
                `未提取到 stream log 路径, nginx config 将被重写为\n${renderString(nginxMainConfig, streamBlockValue)}`
            )
            await this.rewriteMainConfig(renderString(nginxMainConfig, streamBlockValue))
            await this.initNginxConfig()
        }
        Logger.verbose('executor 初始化完毕')
    }

    async rewriteMainConfig(content: string) {
        Logger.log(`nginx config 将被重写为:\n${content}`)
        Logger.verbose(`stream log dir: ${await this.getStreamLogPath()}`)
        await this.executor.mkPath(await this.getStreamLogPath())
        await this.executor.mainConfigRewrite(content)
    }

    /**
     * change env executor
     */
    async changeExecutor() {
        this.executor instanceof ExecutorDocker
            ? this.initLocalExecutor(process.env[EnvKeyEnum.NginxBin])
            : this.initDockerExecutor(process.env[EnvKeyEnum.DockerContainerName])
    }

    private initLocalExecutor(bin: string) {
        this.cacheManager.set(EnvKeyEnum.EffectedNginx, { bin })
        this.executor = new ExecutorLocal(bin, this.cacheManager)
    }

    private initDockerExecutor(containerName: string) {
        this.cacheManager.set(EnvKeyEnum.EffectedNginx, { containerName })
        this.executor = new ExecutorDocker(containerName, this.cacheManager)
    }

    /**
     * 判断本地环境还是 docker 环境
     */
    private async judgeLocalOrDocker() {
        // .env 文件配置的参数优先级更高
        const effectInEnv = getEnvSetting(EnvKeyEnum.EffectedNginx)
        if (effectInEnv) {
            const value = getEnvSetting(effectInEnv)
            if (value) {
                effectInEnv === EnvKeyEnum.DockerContainerName
                    ? this.initDockerExecutor(value)
                    : this.initLocalExecutor(value)
            }
        }
        const nginxRes = await findSomething('nginx')
        if (nginxRes) {
            this.initLocalExecutor(nginxRes.replace('\n', ''))
        } else {
            const { stdout } = await $`docker ps | awk 'tolower($2) ~ /nginx/ {print$NF}'`
            if (!stdout) {
                Logger.error(`自动获取 nginx 环境失败, 请在 .env 配置`)
                throw new Error('env of nginx not found')
            }
            this.initDockerExecutor(stdout.replace('\n', ''))
        }
        Logger.debug(`当前 nginx 执行环境为 ${inspect(await this.cacheManager.get(EnvKeyEnum.EffectedNginx))}`)
    }

    /**
     * 获取 nginx 配置
     * @returns Promise<NginxConfig>
     */
    async getNginxConfigArgs() {
        return this.executor.getNginxConfigArgs()
    }

    /**
     * 获取 nginx 配置文件内容
     * @returns Promise<string>
     */
    async getNginxMainConfigContent() {
        return this.executor.getMainConfigContent()
    }

    /**
     * 获取 stream 配置文件路径
     */
    async getNginxStreamPath() {
        return this.executor.getStreamConfigPath()
    }

    /**
     * 获取 stream 配置文件内容
     * @returns Promise<string>
     */
    async getNginxStreamConfigContent() {
        return this.executor.getStreamFileContent()
    }

    async getDirByUrl(url: string) {
        return this.executor.fetchDirectory(url)
    }

    async patchStream(content: string) {
        Logger.verbose(`patch content: ${inspect(content)}`)
        this.executor.streamPatch(content)
    }

    async queryNginxStatus() {
        return this.executor.queryNginxStatus()
    }

    async getSystemInfo() {
        return this.executor.getSystemInfo()
    }

    async getNginxBin() {
        return this.executor.getNginxBin()
    }

    // async getNginxStreamAccessLogPath() {
    //     return this.executor.getPrefix
    // }w

    async getNginxStreamLogPath(): Promise<string> {
        return this.cacheManager.get(EnvKeyEnum.StreamLogPath)
    }

    async getIp() {
        return this.executor.getIp()
    }

    async getStreamLogPath() {
        // {{logPrefix}}/stream/{{logFilePrefix}}.log
        return `${getEnvSetting(EnvKeyEnum.LogPrefix)}/${getEnvSetting(EnvKeyEnum.StreamDir)}/${getEnvSetting(
            EnvKeyEnum.LogFilePrefix
        )}.log`
    }

    async getStreamLogDir() {
        return `${getEnvSetting(EnvKeyEnum.LogPrefix)}/${getEnvSetting(EnvKeyEnum.StreamDir)}`
    }

    getTailFileProcess(path: string) {
        return this.executor.tailFile(path)
    }
}
