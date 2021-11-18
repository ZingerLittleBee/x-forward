import { Injectable } from '@nestjs/common'
import { NginxConfig } from '../executor/interfaces/nginx-config.interface'
import { QueryGatewayService } from '../gateway/query-gateway.service'
import { Overview } from './env.interface'

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
        return this.queryGatewayService
    }

    async getSystemInfo() {
        return this.queryGatewayService.getSystemInfo()
    }

    // getNginxStatus() {
    //     return
    // }

    // getNginxUptime() {}

    async getOverview(): Promise<Overview> {
        const nginxPath = await this.queryGatewayService.getNginxBin()
        const { description } = await this.queryGatewayService.getSystemInfo()
        const { uptime, active } = await this.queryGatewayService.queryNginxStatus()
        return {
            os: description,
            nginxPath,
            nginxUptime: uptime,
            nginxStatus: active
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
