import { Injectable } from '@nestjs/common'
import { ClientService } from '../../client/client.service'
import { ClientEntity } from '../../client/entity/client.entity'

@Injectable()
export class ClientGatewayService {
    constructor(private readonly clientService: ClientService) {}

    async getPortAndUserRelation(clientId: string) {
        return this.clientService.getRelationshipBetweenPortAndUserId(clientId)
    }

    async register(client: ClientEntity) {
        return this.clientService.register(client)
    }
}
