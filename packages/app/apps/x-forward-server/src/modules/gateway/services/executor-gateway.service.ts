import { Injectable, Logger } from '@nestjs/common'
import { firstValueFrom } from 'rxjs'
import { GrpcClientCenterService } from '../../grpc-client-center/grpc-client-center.service'
import { ExecutorGatewayApi } from '../interface/gateway.interface'

@Injectable()
export class ExecutorGatewayService implements ExecutorGatewayApi {
    constructor(private readonly grpcClientCenterService: GrpcClientCenterService) {}

    async getClient(clientId: string) {
        return this.grpcClientCenterService.getGrpcExecutorClient(clientId)
    }

    async streamPatch(clientId: string, content: string) {
        const result = await firstValueFrom((await this.getClient(clientId))?.streamPatch({ content }))
        if (!result?.success) {
            Logger.warn(`stream patch failed: ${result?.message}`)
        }
    }

    async streamRewrite(clientId: string, content: string) {
        const result = await firstValueFrom((await this.getClient(clientId))?.rewriteStream({ content }))
        if (!result?.success) {
            Logger.warn(`stream rewrite failed: ${result?.message}`)
        }
    }

    async mainConfigRewrite(clientId: string, content: string) {
        const result = await firstValueFrom((await this.getClient(clientId))?.rewriteMainConfig({ content }))
        if (!result?.success) {
            Logger.warn(`main config patch failed: ${result?.message}`)
        }
    }

    async nginxStart(clientId: string) {
        await firstValueFrom((await this.getClient(clientId))?.nginxStart({}))
    }
    async nginxStop(clientId: string) {
        await firstValueFrom((await this.getClient(clientId))?.nginxStop({}))
    }
    async nginxRestart(clientId: string) {
        await firstValueFrom((await this.getClient(clientId))?.nginxRestart({}))
    }
}
