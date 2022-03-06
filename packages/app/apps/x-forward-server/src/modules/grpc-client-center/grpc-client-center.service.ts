import { Injectable } from '@nestjs/common'
import { GrpcClientRegisterService } from '@x-forward/grpc-client-register/grpc-client-register.service'
import { ClientService } from '../client/client.service'
import { GrpcExecutorService } from '../gateway/interface/grpc-executor.interface'

@Injectable()
export class GrpcClientCenterService {
    constructor(
        private grpcClientRegisterService: GrpcClientRegisterService,
        private readonly clientService: ClientService
    ) {}

    async getGrpcExecutorClient(clientId: string) {
        return this.grpcClientRegisterService.getService<GrpcExecutorService>(await this.getClientUrl(clientId))
    }

    async getGrpcClient<T>(clientId: string) {
        return this.grpcClientRegisterService.getService<T>(await this.getClientUrl(clientId))
    }

    async getClientUrl(clientId: string) {
        const { ip, domain, port } = await this.clientService.getById(clientId)
        return ip ? `${ip}:${port}` : `${domain}:${port}`
    }
}
