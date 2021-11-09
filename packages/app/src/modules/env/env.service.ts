import { Injectable } from '@nestjs/common'
import { StatusEnum } from 'src/enums/StatusEnum'
import { findSomething } from '../../utils/BashUtil'
import { checkOS } from '../../utils/Shell'
import { NginxConfig } from '../executor/interface/executor.interface'
import { ExecutorGatewayService } from '../gateway/gateway.service'

@Injectable()
export class EnvService {
    constructor(private executorGateway: ExecutorGatewayService) {}

    async fetchNginxConfigAargs(): Promise<NginxConfig> {
        return this.executorGateway.fetchNginxConfigArgs()
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
    async getDirByUrl(url: string) {
        return this.executorGateway.fetchDirectoryByUrl(url)
    }

    /**
     * 获取 nginx stream 文件
     */
    fetchNginxStreamFile() {
        this.executorGateway.fetchNginxStreamConfigContent()
    }
}
