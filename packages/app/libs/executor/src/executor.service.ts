import { CACHE_MANAGER, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { EnvEnum } from '@x-forward/common/enums'
import { findSomething, getEnvSetting, makeSureDirectoryExists } from '@x-forward/common/utils'
import { IExecutor, NginxConfig } from '@x-forward/executor/interfaces'
import { streamBlock } from '@x-forward/render/template/nginxMainConfig'
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
     * 初始化
     * 1. 装载 nginx 配置参数
     * 2. 更新主配置文件 nginx.conf
     *     a) 添加 stream 模块声明 (如果不存在)
     *     b) 添加 include 外部 stream 文件 (如果不存在)
     * 3. 创建 ${prefix}/${process.env[EnvEnum.STREAM_DIR]} 文件夹 (如果不存在)
     * 4. 创建 ${prefix}/stream/${process.env[EnvEnum.STREAM_FILE_NAME]}
     */
    private async initNginxConfig() {
        // 装载 nginx 配置参数
        const nginxConfigArgs = await this.executor.getNginxConfigArgs()
        Logger.debug(`nginx 配置参数解析成功: ${inspect(nginxConfigArgs)}`)
        this.cacheManager.set<NginxConfig>(EnvEnum.NGINX_CONFIG_ARGS, nginxConfigArgs)
        const nginxMainConfigContent = await this.executor.getMainConfigContent()
        Logger.debug(`nginx 主配置文件初始内容: ${nginxMainConfigContent}`)
        const streamDir = await this.executor.getStreamDirectory()
        // 判断目录是否存在, 不存在则创建
        makeSureDirectoryExists(streamDir)
        Logger.debug(`nginx stream 目录: ${streamDir}`)
        // 检索 includes ${streamDir}/*.conf
        const streamConfigIncludeReg = new RegExp(`include\\s*${streamDir}/\\*.conf;`, 'i')
        const nginxIncludeBolck = streamConfigIncludeReg.exec(nginxMainConfigContent)
        Logger.verbose(`nginxIncludeBolck: ${nginxIncludeBolck}`)
        if (!nginxMainConfigContent.match(streamConfigIncludeReg)) {
            // 未找到, 则检查是否存在 stream {} 块
            // 未找到 stream {} 块
            const logPrefix = getEnvSetting('LOG_PREFIX')
            const logFilePrefix = getEnvSetting('LOG_FILE_PREFIX')
            const logFormat = getEnvSetting('LOG_FORMAT')
            if (!nginxMainConfigContent.match(/stream\s*{[.\n]*}/)) {
                const streamBlockString = renderString(streamBlock, {
                    streamDir,
                    logPrefix,
                    logFilePrefix,
                    logFormat
                })
                Logger.debug(`未找到 stream 模块, 将自动在文件尾部添加\n${streamBlockString}`)
                await this.executor.mainConfigAppend(streamBlockString)
            }
            // 找到 stream {} 块, 但是没有 include
            else {
                // TODO 暂不进行处理
                Logger.warn(
                    `请自行在 ${await this.executor.getMainConfigPath()} 文件添加 stream 模块\n${renderString(
                        streamBlock,
                        { streamDir, logPrefix, logFilePrefix, logFormat }
                    )}`
                )
            }
            this.cacheManager.set(EnvEnum.STREAM_LOG_PATH, `${logPrefix}/stream/${logFilePrefix}.log`)
        }
        // 提取 stream log 位置
        else {
            const streamLogPathReg = new RegExp(
                `(?<=access_log\\s)[\-a-zA-Z/\.]+(?=\\s${getEnvSetting('LOG_FORMAT')})`,
                'g'
            )
            const streamLogPath = streamLogPathReg.exec(nginxMainConfigContent)?.[0]
            if (streamLogPath) {
                this.cacheManager.set(EnvEnum.STREAM_LOG_PATH, streamLogPath)
                Logger.verbose(`stream log path: ${streamLogPath}`)
            } else {
                Logger.warn('未提取到 stream log 路径, 日志功能无法生效')
            }
        }
        Logger.verbose('executor 初始化完毕')
    }

    /**
     * change env executor
     */
    async changeExecutor() {
        this.executor instanceof ExecutorDocker
            ? this.initLocalExecutor(process.env[EnvEnum.NGINX_BIN])
            : this.initDockerExecutor(process.env[EnvEnum.DOCKER_CONTAINER_NAME])
    }

    private initLocalExecutor(bin: string) {
        this.cacheManager.set(EnvEnum.EFFECTED_NGINX, { bin })
        this.executor = new ExecutorLocal(bin, this.cacheManager)
    }

    private initDockerExecutor(containerName: string) {
        this.cacheManager.set(EnvEnum.EFFECTED_NGINX, { containerName })
        this.executor = new ExecutorDocker(containerName, this.cacheManager)
    }

    /**
     * 判断本地环境还是 docker 环境
     */
    private async judgeLocalOrDocker() {
        // .env 文件配置的参数优先级更高
        const effectInEnv = getEnvSetting(EnvEnum.EFFECTED_NGINX)
        if (effectInEnv) {
            const value = getEnvSetting(effectInEnv)
            if (value) {
                effectInEnv === EnvEnum.DOCKER_CONTAINER_NAME
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
        Logger.debug(`当前 nginx 执行环境为 ${inspect(await this.cacheManager.get(EnvEnum.EFFECTED_NGINX))}`)
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
        return this.cacheManager.get(EnvEnum.STREAM_LOG_PATH)
    }
}
