import { Injectable } from '@nestjs/common'
import { ExecutorService } from '@x-forward/executor'
import { QueryGatewayApi } from '../interface/gateway.interface'

@Injectable()
export class QueryGatewayService implements QueryGatewayApi {
    constructor(private executorService: ExecutorService) {}

    async fetchNginxConfigArgs() {
        return this.executorService.getNginxConfigArgs()
    }

    async fetchNginxStreamConfigContent() {
        return this.executorService.getNginxStreamConfigContent()
    }

    async fetchDirectoryByUrl(url: string) {
        return (await this.executorService.getDirByUrl(url))?.split('\n').filter(r => r !== '')
    }

    async queryNginxStatus() {
        return this.executorService.queryNginxStatus()
    }

    async getSystemInfo() {
        return this.executorService.getSystemInfo()
    }

    async getNginxBin() {
        return this.executorService.getNginxBin()
    }
}
