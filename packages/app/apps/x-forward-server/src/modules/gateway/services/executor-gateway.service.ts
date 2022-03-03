import { HttpService } from '@nestjs/axios'
import { Injectable, Logger } from '@nestjs/common'
import { RenderService } from '@x-forward/render'
import { ExecutorGatewayApi } from '../interface/gateway.interface'
import { GrpcClientRegisterService } from '../../../../../../libs/grpc-client-register/grpc-client-register.service'
import { GrpcExecutorService } from '../interface/grpc-executor.interface'
import { ClientService } from '../../client/client.service'
import { firstValueFrom } from 'rxjs'

@Injectable()
export class ExecutorGatewayService implements ExecutorGatewayApi {
    constructor(
        private grpcClientRegisterService: GrpcClientRegisterService<GrpcExecutorService>,
        private renderService: RenderService,
        private readonly httpService: HttpService,
        private readonly clientService: ClientService
    ) {}

    async getGrpcClient(clientId: string) {
        const { ip, domain, port } = await this.getClientUrl(clientId)
        return this.grpcClientRegisterService.connectClient(`${ip ? ip : domain}:${port}`)
    }

    async getClientUrl(clientId: string) {
        const { ip, domain, port } = await this.clientService.getById(clientId)
        return {
            ip,
            domain,
            port
        }
    }

    streamPatch(url: string, content: string) {
        this.httpService.post(url, content).subscribe({
            error: err => Logger.warn(`POST ${url} with body:\n${content}\noccurred error: ${err}`)
        })
    }

    async getNginxBin(clientId: string) {
        return firstValueFrom((await this.getGrpcClient(clientId))?.getNginxBin())
    }
}
