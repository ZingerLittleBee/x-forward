import { CACHE_MANAGER, Inject, Injectable, Logger } from '@nestjs/common'
import { Cache } from 'cache-manager'
import { existsSync, mkdirSync, readdirSync, writeFile } from 'fs'
import { configure, renderString } from 'nunjucks'
import { extname, join } from 'path'
import { EnvEnum } from 'src/enums/EnvEnum'
import { NginxLoadBalancing } from 'src/enums/NginxEnum'
import { v4, validate } from 'uuid'
import nginxStreamConfig from '../../template/nginxStreamConfig'
import { getEnvByKey } from '../../utils/EnvUtil'
import { StreamServer, StreamUpstream, UpstreamServer } from './patch.api'

@Injectable()
export class PatchService {
    constructor(
        @Inject(CACHE_MANAGER) private cacheManager: Cache
    ) {
        configure({ autoescape: true, trimBlocks: true, lstripBlocks: true })
    }

    /**
     * 初始化 nginx 主配置文件
     */
    initMainConfig(prefix: string) {
        if (!prefix) {
            Logger.error("nginx prefix 为空")
            throw new Error("nginx prefix is null")
        }
        const mainConfiPath = join(prefix, getEnvByKey(EnvEnum.NGINX_MAIN_CONFIG_NAME))
        const streamIncludePath = this.generatorStreamInclude(prefix)
    }

    private generatorStreamInclude(prefix: string) {
        const streamSuffix = extname(getEnvByKey(EnvEnum.STREAM_FILE_NAME))
        const streamConfigPath = join(prefix, getEnvByKey(EnvEnum.STREAM_DIR))
        return streamConfigPath + `/*${streamSuffix}`
    }

    /**
     * 获取临时文件路径
     * 1. 目标文件夹不存在则创建
     * 2. 如果文件夹存在, 则检查是否存在名称为 uuid 的文件
     * 3. 存在则返回, 不存在则新生成
     * @returns temp/stream/uuid.conf | temp/http/uuid.conf | temp/main/uuid.conf
     */
    private generatorTempPath(dir: 'stream' | 'http' | 'main') {
        let tempDir = join(process.env['TEMP_FILE_NAME'], dir)
        // 判断文件夹是否存在, 不存在则创建
        if (!existsSync(tempDir)) {
            mkdirSync(tempDir, { recursive: true })
        }
        // 获取目录下文件列表
        const fileList = readdirSync(tempDir)
        for (let i = 0; i < fileList.length; i++) {
            let fileName = fileList[i].split('.')[0]
            // 如果文件名是 uuid, 则直接返回
            if (validate(fileName)) {
                return join(process.env['TEMP_FILE_NAME'], dir, fileList[i])
            }
        }
        // 不存在, 则创建
        return join(process.env['TEMP_FILE_NAME'], dir, `${v4()}.conf`)
    }

    patchStream(upstreams: StreamUpstream[], servers: StreamServer[]) {
        const streamFileContent = renderString(nginxStreamConfig, {
            upstreams,
            servers,
            generateLoadBalancing: this.generateLoadBalancing,
            generateUpstreamServer: this.generateUpstreamServer
        })
        writeFile(
            this.generatorTempPath('stream'),
            streamFileContent,
            'utf-8',
            err => {
                if (!err) return
                Logger.error(
                    `${process.env['STREAM_FILE_NAME']}文件写入失败, ${err}`
                )
            }
        )
    }

    // 生成负载均衡算法
    private generateLoadBalancing({ load_balancing }: StreamUpstream) {
        if (load_balancing === NginxLoadBalancing.poll) {
            return
        }
        if (load_balancing === NginxLoadBalancing.weight) {
            return
        }
        if (load_balancing === NginxLoadBalancing.ip_hash) {
            return 'ip_hash'
        }
        if (load_balancing === NginxLoadBalancing.fair) {
            return 'fair'
        }
        if (load_balancing === NginxLoadBalancing.url_hash) {
            return 'url_hash'
        }
    }

    // 生成 upstream 模块下的 server, 直接放在模版中太冗余
    private generateUpstreamServer(upstreamServer: UpstreamServer) {
        if (upstreamServer == null) return ''
        const {
            upstream_host,
            upstream_port,
            weight,
            max_conns,
            max_fails,
            fail_timeout,
            backup,
            down
        } = upstreamServer
        let resStr = 'server'
        resStr += ' ' + upstream_host + ':' + upstream_port
        weight && (resStr += ` wight=${weight}`)
        max_conns && (resStr += ` max_conns=${max_conns}`)
        max_fails && (resStr += ` max_fails=${max_fails}`)
        fail_timeout && (resStr += ` fail_timeout=${fail_timeout}`)
        backup && (resStr += ` ${backup}`)
        down && (resStr += ` ${down}`)
        return (resStr += ';')
    }
}

