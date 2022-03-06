// import { Injectable } from '@nestjs/common'
// import { QueryGatewayApi } from '../interface/gateway.interface'

import { Injectable, Logger } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { GrpcClientCenterService } from '../../grpc-client-center/grpc-client-center.service'
@Injectable()
export class QueryGatewayService {
    constructor(private readonly grpcClientCenterService: GrpcClientCenterService) {}

    async getClient(clientId: string) {
        return this.grpcClientCenterService.getGrpcExecutorClient(clientId)
    }

    async getNginxBin(clientId: string) {
        return firstValueFrom((await this.getClient(clientId)).getNginxBin({}))
    }

    async fetchNginxConfigArgs(clientId: string) {
        const result = await firstValueFrom((await this.getClient(clientId)).getNginxConfigArgs({}))
        let args = {}
        try {
            args = JSON.parse(result.data?.args)
        } catch (e) {
            Logger.error(`parse nginx config args failed: ${e}`)
        }
        return result?.success
            ? {
                  success: result.success,
                  data: {
                      module: result?.data?.module,
                      version: result?.data?.version,
                      args
                  }
              }
            : {}
    }

    async fetchNginxStreamConfigContent(clientId: string) {
        return firstValueFrom((await this.getClient(clientId)).getNginxStreamConfigContent({}))
    }

    async fetchDirectoryByUrl(clientId: string, url: string) {
        return firstValueFrom((await this.getClient(clientId)).fetchDirectory({ url }))
    }
    //     async queryNginxStatus() {
    //         return this.executorService.queryNginxStatus()
    //     }
    //     async getSystemInfo() {
    //         return this.executorService.getSystemInfo()
    //     }
    //     async getNginxBin() {
    //         return this.executorService.getNginxBin()
    //     }
}
