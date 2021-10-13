import { CACHE_MANAGER, Inject, Injectable, Logger, OnModuleInit } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { renderString } from 'nunjucks'
import { EnvEnum } from 'src/enums/EnvEnum'
import { streamBlock, streamIndule } from 'src/template/nginxMainConfig'
import { findSomething } from 'src/utils/BashUtil'
import { $ } from 'zx'
import { NginxConfigArgsReflectEnum } from '../../enums/NginxEnum'
import { ExecutorDocker } from './executor.docker'
import { ExecutorLocal } from './executor.local'
import { ExecutorInterface, NginxConfig } from './interface/executor.interface'

@Injectable()
export class ExecutorService implements OnModuleInit {
    constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {}

    /**
     * 环境指令 executor
     */
    private executor: ExecutorInterface

    async onModuleInit() {
        await this.judgeLocalOrDocker()

        // 初始化 bean
        process.env[EnvEnum.EFFECTED_NGINX] === EnvEnum.DOCKER_CONTAINER_NAME
        ?
        this.initDockerExecutor(process.env[EnvEnum.DOCKER_CONTAINER_NAME])
        :
        this.initLocalExecutor(process.env[EnvEnum.NGINX_BIN])

        this.initNginxConfig()
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
    async initNginxConfig() {
        // 装载 nginx 配置参数
        await this.executor.getNginxConfigArgs()
        let nginxMainConfigContent = await this.executor.getMainConfigContent()
        console.log(nginxMainConfigContent)
        const streamDir = await this.executor.getStreamDirectory()
        // 检索 includes ${streamDir}/*.conf
        const streamConfigIncludeReg = new RegExp(`include\\s*${streamDir}/\\*.conf;`, 'i')
        if (!nginxMainConfigContent.match(streamConfigIncludeReg)) {
            // 未找到, 则检查是否存在 stream {} 块
            // 未找到 stream {} 块
            if (!nginxMainConfigContent.match(/stream\s*{[.\n]*}/)) {
                const streamBlockString = renderString(streamBlock, { streamDir })
                Logger.debug(`未找到 stream 模块, 将自动在文件尾部添加\n${streamBlockString}`)
                this.executor.mainConfigAppend(streamBlockString)
            }
            // 找到 stream {} 块, 但是没有 include
            else {
                // TODO 暂不进行处理
                Logger.log(`请自行在 ${await this.executor.getMainConfigPath()} 文件 stream 模块中添加 ${renderString(streamIndule, { streamDir })}`)
            }
        }
        Logger.debug('stream include 模块存在, 无需初始化')
    }

    /**
     * change env excutor
     */
    async changeExecutor() {
        this.executor instanceof ExecutorDocker
        ? this.initLocalExecutor(process.env[EnvEnum.NGINX_BIN])
        : this.initDockerExecutor(process.env[EnvEnum.DOCKER_CONTAINER_NAME])
    }

    private initLocalExecutor(bin: string) {
        this.cacheManager.set(EnvEnum.EFFECTED_NGINX, bin)
        this.executor = new ExecutorLocal(bin)
    }

    private initDockerExecutor(containerName: string) {
        this.cacheManager.set(EnvEnum.EFFECTED_NGINX, containerName)
        this.executor = new ExecutorDocker(containerName, this.cacheManager)
    }

    /**
     * 判断本地环境还是 docker 环境
     */
    private async judgeLocalOrDocker() {
        // .env 文件配置的参数优先级更高
        if (process.env[process.env['EFFECTED_NGINX']]) {
            return
        }
        let nginxRes = await findSomething('nginx')
        if (nginxRes) {
            process.env['NGINX_BIN'] = nginxRes.replace('\n', '')
        } else {
            let { stdout } =
                await $`docker ps | awk 'tolower($2) ~ /nginx/ {print$NF}'`
            process.env['DOCKER_CONTAINER_NAME'] = stdout.replace('\n', '')
        }
    }

    /**
     * 获取 nginx 配置
     */
    async getNginxConfigAargs() {
        return this.executor.getNginxConfigArgs()
    }

    /**
     * 获取 nginx -V 结果
     * @param isDocker 是否为 docker 容器
     * @returns ProcessPromise<ProcessOutput>
     */
     async fetchNginxConfig(): Promise<string> {
        let { stdout } = process.env['NGINX_BIN']
            ? await $`${process.env['NGINX_BIN']} -V`
            : await $`docker exec -it ${process.env['DOCKER_CONTAINER_NAME']} nginx -V`
        return stdout
    }

    /**
     * 匹配 nginx -V 结果
     * @param info nginx -V 结果
     */
    async fetchNginxConfigAargs(nginxInfo: string): Promise<NginxConfig> {
        // 获取 nginx 版本号
        const version = nginxInfo.match(/nginx\/\d.*/)[0]

        // 获取模块配置
        let moduleConfig = nginxInfo.match(/with[-\w]+/g)
        moduleConfig = moduleConfig.filter(
            m => m !== 'with-ld-opt' && m !== 'with-cc-opt'
        )

        // 获取键值对配置项
        // 1. 处理特殊情况(内容包含空格)
        //  --with-ld-opt='-Wl,-z,relro -Wl,-z,now -Wl,--as-needed -pie'
        //  --with-cc-opt='-g -O2 -fdebug-prefix-map=/data/builder/debuild/nginx-1.21.3/debian/debuild-base/nginx-1.21.3=. -fstack-protector-strong -Wformat -Werror=format-security -Wp,-D_FORTIFY_SOURCE=2 -fPIC'
        let spaceRegExp = /(with-ld-opt|with-cc-opt)='.*?'/g
        let opt = nginxInfo.match(spaceRegExp)
        let argsConfig: String[]
        // 2. 处理一般情况(内容不带空格)
        if (opt) {
            // 如果 --with-ld-opt 存在, 则合并结果
            argsConfig = nginxInfo
                .replace(spaceRegExp, '')
                .match(/([a-z][-\w]+)=(\S+)/gi)
                .concat(opt)
        } else {
            argsConfig = nginxInfo.match(/([a-z][-\w]+)=(\S+)/gi)
        }
        // 3. [ 'prefix=/etc/nginx' ] 键值对分离
        let argsConfigObj = {}
        argsConfig.forEach(p => {
            let matchTemp = p.match(/([-_a-z]+)(?:=)(.*)/i)
            argsConfigObj[matchTemp[1]] = {
                label: NginxConfigArgsReflectEnum[matchTemp[1]],
                value: matchTemp[2]
            }
        })
        const nginxConfig = {
            version: version,
            args: argsConfigObj,
            module: moduleConfig
        }
        return this.cacheManager.set<NginxConfig>(
            EnvEnum.NGINX_CONFIG_ARGS,
            nginxConfig
        )
    }
}
