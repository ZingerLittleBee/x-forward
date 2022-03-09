import { Injectable } from '@nestjs/common'
import { NginxConfig } from '@x-forward/executor'
import { QueryGatewayService } from '../gateway/services/query-gateway.service'
import { Overview } from './env.interface'

@Injectable()
export class EnvService {
    constructor(private queryGatewayService: QueryGatewayService) {}

    async fetchNginxConfigArgs(clientId: string): Promise<NginxConfig> {
        return this.queryGatewayService.fetchNginxConfigArgs(clientId)
    }
    /**
     * if there is a nginx
     * @returns
     */
    async getNginxPath(clientId: string) {
        return this.queryGatewayService.getNginxBin(clientId)
    }
    async getSystemInfo(clientId: string) {
        return this.queryGatewayService.getSystemInfo(clientId)
    }
    // getNginxStatus() {
    //     return
    // }
    // getNginxUptime() {}
    async getOverview(clientId: string): Promise<Overview> {
        const nginxPath = await this.queryGatewayService.getNginxBin(clientId)
        const { description } = await this.queryGatewayService.getSystemInfo(clientId)
        const { uptime, active } = await this.queryGatewayService.queryNginxStatus(clientId)
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
    async getDirByUrl(clientId: string, url: string) {
        return this.queryGatewayService.fetchDirectoryByUrl(clientId, url)
    }
    /**
     * 获取 nginx stream 文件
     */
    async fetchNginxStreamFile(clientId: string) {
        return this.queryGatewayService.fetchNginxStreamConfigContent(clientId)
    }
}
