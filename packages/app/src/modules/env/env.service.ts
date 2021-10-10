import { CACHE_MANAGER, Inject, Injectable, OnModuleInit } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { join } from 'path'
import { EnvEnum } from 'src/enums/EnvEnum'
import { NginxConfigArgsEnum } from 'src/enums/NginxEnum'
import { $ } from 'zx'
import StatusEnum from '../../enums/StatusEnum'
import { findSomething } from '../../utils/BashUtil'
import { checkOS, fetchDirectory } from '../../utils/Shell'
import { ExecutorInterface } from '../executor/executor.interface'
import { ENV_EXECUTOR } from '../executor/executor.module'
import { PatchApi } from '../patch/patch.api'

export interface NginxConfig {
    version: string
    args: { [key: string]: { label: string; value: string } }
    module: string[]
}

@Injectable()
export class EnvService implements OnModuleInit {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache,
        @Inject(ENV_EXECUTOR) private executor: ExecutorInterface,
        private patchApi: PatchApi
    ) {}

    nginxConfig: NginxConfig

    async onModuleInit() {
        await this.judgeLocalOrDocker()
        this.fetchNginxConfigAargs(await this.fetchNginxConfig())
        this.patchApi.initMainConfig(
            join(await this.getNginxPrefix(), process.env['NGINX_MAIN_CONFIG'])
        )
    }

    /**
     * 获取 nginx prefix
     * @returns $`nginx -V`['prefix']
     */
    async getNginxPrefix() {
        const { args } = await this.getNginxCache()
        return args['prefix'].value
    }

    /**
     * 获取 cache 中的 nginxConfig
     * @returns NginxConfig
     */
    getNginxCache() {
        return this.cacheManager.get<NginxConfig>(EnvEnum.NGINX_CONFIG_ARGS)
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

    patchStream() {
        this.executor.streamPatch()
    }

    /**
     * if there is a nginx
     * @returns
     */
    getNginxPath() {
        return findSomething('nginx')
    }

    async getOS() {
        return await checkOS()
    }

    getNginxStatus() {}

    getNginxUptime() {}

    async getOverview() {
        let os = await this.getOS()
        let nginxPath = await this.getNginxPath()
        let nginxUptime
        let nginxStatus
        if (!nginxPath) {
            nginxStatus = StatusEnum.NotInstall
            nginxUptime = '0'
        } else {
        }
        return {
            os,
            nginxPath,
            nginxUptime,
            nginxStatus
        }
    }

    /**
     * 获取指定路径下的所有文件夹
     * @param url 路径
     * @returns 路径下的所有文件夹
     */
    getDirByUrl(url: string) {
        // add "/" automatic if url no "/" at the beginning
        if (!url.match(/^\//)) {
            url = '/' + url
        }
        return fetchDirectory(url)
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
     * 获取 nginx HTTP 文件
     */
    fetchNginxHTTPFile() {}

    /**
     * 获取 nginx stream 文件
     */
    fetchNginxStreamFile() {}

    /**
     * 匹配 nginx -V 结果
     * @param info nginx -V 结果
     */
    fetchNginxConfigAargs(nginxInfo: string): NginxConfig {
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
                label: NginxConfigArgsEnum[matchTemp[1]],
                value: matchTemp[2]
            }
        })
        const nginxConfig = {
            version: version,
            args: argsConfigObj,
            module: moduleConfig
        }
        this.cacheManager.set<NginxConfig>(
            EnvEnum.NGINX_CONFIG_ARGS,
            nginxConfig
        )
        return nginxConfig
    }
}
