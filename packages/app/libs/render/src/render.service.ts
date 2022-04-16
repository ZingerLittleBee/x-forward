import { LoadBalancingEnum } from '@forwardx/shared'
import { Injectable } from '@nestjs/common'
import { EnvKeyEnum, getEnvSetting } from '@x-forward/common'
import { existsSync, mkdirSync, readdirSync } from 'fs'
import { configure, renderString } from 'nunjucks'
import { join } from 'path'
import { v4, validate } from 'uuid'
import { checkChain } from './render.check'
import { RenderModel, StreamUpstream, UpstreamServer } from './render.interface'
import nginxStreamConfig from './template/nginxStreamConfig'

@Injectable()
export class RenderService {
    constructor() {
        configure({ autoescape: true, trimBlocks: true })
    }

    async renderStream({ servers = [], upstreams = [] }: RenderModel) {
        if (upstreams?.length === 0 && servers.length === 0) {
            return ''
        }
        const { upstreams: checkedUpstreams, servers: checkedServers } = await checkChain({ servers, upstreams })
        return renderString(nginxStreamConfig, {
            checkedUpstreams,
            checkedServers,
            generateLoadBalancing: RenderService.generateLoadBalancing,
            generateUpstreamServer: RenderService.generateUpstreamServer
        })
        // writeFile(this.generatorTempPath('stream'), streamFileContent, 'utf-8', err => {
        //     if (!err) return
        //     Logger.error(`${process.env['STREAM_FILE_NAME']}文件写入失败, ${err}`)
        // })
    }

    /**
     * 获取 node 临时文件路径
     * 1. 目标文件夹不存在则创建
     * 2. 如果文件夹存在, 则检查是否存在名称为 uuid 的文件
     * 3. 存在则返回, 不存在则新生成
     * @returns temp/stream/uuid.conf | temp/http/uuid.conf | temp/main/uuid.conf
     */
    private static generatorTempPath(dir: 'stream' | 'http' | 'main') {
        const tempDir = join(getEnvSetting(EnvKeyEnum.TempFileName), dir)
        // 判断文件夹是否存在, 不存在则创建
        if (!existsSync(tempDir)) {
            mkdirSync(tempDir, { recursive: true })
        }
        // 获取目录下文件列表
        const fileList = readdirSync(tempDir)
        for (let i = 0; i < fileList.length; i++) {
            const fileName = fileList[i].split('.')[0]
            // 如果文件名是 uuid, 则直接返回
            if (validate(fileName)) {
                return join(tempDir, fileList[i])
            }
        }
        // 不存在, 则创建
        return join(tempDir, `${v4()}.conf`)
    }

    // 生成负载均衡算法
    private static generateLoadBalancing({ load_balancing }: StreamUpstream) {
        if (load_balancing === LoadBalancingEnum.Random) {
            return
        }
        if (load_balancing === LoadBalancingEnum.Weight) {
            return
        }
        if (load_balancing === LoadBalancingEnum.Least_conn) {
            return 'least_conn'
        }
        if (load_balancing === LoadBalancingEnum.Hash) {
            return 'hash $remote_addr consistent;'
        }
    }

    // 生成 upstream 模块下的 server, 直接放在模版中太冗余
    private static generateUpstreamServer(upstreamServer: UpstreamServer) {
        if (upstreamServer == null) return ''
        const { upstream_host, upstream_port, weight, max_conns, max_fails, fail_timeout, backup, down } =
            upstreamServer
        let resStr = 'server'
        resStr += ' ' + upstream_host + ':' + upstream_port
        weight && (resStr += ` weight=${weight}`)
        max_conns && (resStr += ` max_conns=${max_conns}`)
        max_fails && (resStr += ` max_fails=${max_fails}`)
        fail_timeout && (resStr += ` fail_timeout=${fail_timeout}`)
        backup && (resStr += ` backup`)
        down && (resStr += ` down`)
        resStr += ';'
        return resStr
    }
}
