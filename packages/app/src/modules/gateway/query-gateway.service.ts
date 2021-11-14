import { Injectable } from '@nestjs/common'
import { NginxStatusEnum } from 'src/enums/NginxEnum'
import { ExecutorService } from '../executor/executor.service'
import { QueryGatewayApi } from './interface/gateway.interface'

@Injectable()
export class QueryGatewayService implements QueryGatewayApi {
    constructor(private executorService: ExecutorService) {}

    async fetchNginxConfigArgs() {
        return this.executorService.getNginxConfigAargs()
    }

    async fetchNginxStreamConfigContent() {
        return this.executorService.getNginxStreamConfigContent()
    }

    async fetchDirectoryByUrl(url: string) {
        return (await this.executorService.getDirByUrl(url))?.split('\n').filter(r => r !== '')
    }

    queryNginxStatus: () => NginxStatusEnum
}
