import { Injectable } from '@nestjs/common'
import { StatusEnum } from 'src/enums/StatusEnum'
import { findSomething } from '../../utils/BashUtil'
import { checkOS } from '../../utils/Shell'
import { NginxConfig } from '../executor/interface/executor.interface'
import { QueryGatewayService } from '../gateway/query-gateway.service'

@Injectable()
export class EnvService {
    constructor(private queryGatewayService: QueryGatewayService) {}

    async fetchNginxConfigAargs(): Promise<NginxConfig> {
        return this.queryGatewayService.fetchNginxConfigArgs()
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

    // getNginxStatus() {
    //     return
    // }

    // getNginxUptime() {}

    async getOverview() {
        const os = await this.getOS()
        const nginxPath = await this.getNginxPath()
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
        return this.queryGatewayService.fetchDirectoryByUrl(url)
    }

    /**
     * 获取 nginx stream 文件
     */
    fetchNginxStreamFile() {
        this.queryGatewayService.fetchNginxStreamConfigContent()
    }
}
