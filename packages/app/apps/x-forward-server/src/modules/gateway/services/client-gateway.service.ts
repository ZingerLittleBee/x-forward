import { Injectable, Logger } from '@nestjs/common'
import { lookup } from 'dns/promises'
import { firstValueFrom } from 'rxjs'
import { ClientService } from '../../client/client.service'
import { ClientEntity } from '../../client/entity/client.entity'
import { GrpcClientCenterService } from '../../grpc-client-center/grpc-client-center.service'

@Injectable()
export class ClientGatewayService {
    constructor(
        private readonly grpcClientCenterService: GrpcClientCenterService,
        private readonly clientService: ClientService
    ) {}

    async getClient(clientId: string) {
        return this.grpcClientCenterService.getGrpcExecutorClient(clientId)
    }

    async updatePortAndUserRelation(clientId: string) {
        const userProperties = await this.clientService.getRelationshipBetweenPortAndUserId(clientId)
        const result = await firstValueFrom(
            (await this.getClient(clientId))?.updatePortAndUserRelation({ userProperties })
        )
        if (!result?.success) {
            Logger.warn(`updatae port and user relation failed: ${result?.message}`)
        }
    }

    async getPortAndUserRelation(clientId: string) {
        return this.clientService.getRelationshipBetweenPortAndUserId(clientId)
    }

    async register(client: ClientEntity) {
        if (!client.ip) {
            if (client.domain) {
                client.ip = (await lookup(client.domain)).address
            }
        }
        if (!client.ip) return false
        return this.clientService.register(client)
    }

    async updateLastCommunicationTime(id: string, time: Date) {
        return this.clientService.updateLastCommunicationTime(id, time)
    }
}
