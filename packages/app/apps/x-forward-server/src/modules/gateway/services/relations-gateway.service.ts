import { Injectable } from '@nestjs/common'
import { StreamService } from '../../stream/stream.service'

@Injectable()
export class RelationsGatewayService {
    constructor(private readonly streamService: StreamService) {}

    async getPortAndUserRelation(clientId: string) {
        return this.streamService.getRelationshipBetweenPortAndUserId(clientId)
    }
}
