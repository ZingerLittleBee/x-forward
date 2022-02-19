import { Injectable } from '@nestjs/common'
import { ClientService } from '../../client/client.service'
import { ClientEntity } from '../../client/entity/client.entity'
import { lookup } from 'dns/promises'

@Injectable()
export class ClientGatewayService {
    constructor(private readonly clientService: ClientService) {}

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
}
