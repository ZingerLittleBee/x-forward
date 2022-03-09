import { Injectable, Logger } from '@nestjs/common'
import { NotSerializable } from '@x-forward/common/errors/not-serializable.exception'
import { NginxConfig } from '@x-forward/executor'
import { firstValueFrom } from 'rxjs'
import { GrpcClientCenterService } from '../../grpc-client-center/grpc-client-center.service'
@Injectable()
export class QueryGatewayService {
    constructor(private readonly grpcClientCenterService: GrpcClientCenterService) {}

    async getClient(clientId: string) {
        return this.grpcClientCenterService.getGrpcExecutorClient(clientId)
    }

    async getNginxBin(clientId: string) {
        const result = await firstValueFrom((await this.getClient(clientId)).getNginxBin({}))
        return result?.success ? result.data : ''
    }

    async fetchNginxConfigArgs(clientId: string): Promise<NginxConfig> {
        const result = await firstValueFrom((await this.getClient(clientId)).getNginxConfigArgs({}))
        let args = {}
        try {
            args = JSON.parse(result.data?.args)
        } catch (e) {
            Logger.error(`parse nginx config args failed: ${e}`)
            throw new NotSerializable('Nginx config args')
        }
        return result?.success
            ? {
                  module: result?.data?.module,
                  version: result?.data?.version,
                  args
              }
            : {}
    }

    async fetchNginxStreamConfigContent(clientId: string) {
        const result = await firstValueFrom((await this.getClient(clientId)).getNginxStreamConfigContent({}))
        return result?.success ? result.data : ''
    }

    async fetchDirectoryByUrl(clientId: string, url: string) {
        const result = await firstValueFrom((await this.getClient(clientId)).fetchDirectory({ url }))
        return result?.success ? result.data : ''
    }
    async queryNginxStatus(clientId: string) {
        const result = await firstValueFrom((await this.getClient(clientId)).getNginxStatus({}))
        return result?.success ? result.data : {}
    }
    async getSystemInfo(clientId: string) {
        const result = await firstValueFrom((await this.getClient(clientId)).getSystemInfo({}))
        return result?.success ? result.data : {}
    }
}
