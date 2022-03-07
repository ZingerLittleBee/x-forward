import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventEnum } from '@x-forward/common'
import { ClientGatewayService } from '../../modules/gateway/services/client-gateway.service'
import { ClientPortAddDto, ClientPortRemoveDto } from './client-port.dto'

@Injectable()
export class ClientPortListener {
    constructor(private readonly clientGatewayService: ClientGatewayService) {}

    @OnEvent(EventEnum.CLIENT_PORT_ADD)
    async handleClientPortAdd(payload: ClientPortAddDto) {
        Logger.verbose(`receive ${EventEnum.CLIENT_PORT_ADD} event with payload: ${payload}`)
        this.clientGatewayService.updatePortAndUserRelation(payload?.clientId)
    }

    @OnEvent(EventEnum.CLIENT_PORT_REMOVE)
    async handleClientPortRemove(payload: ClientPortRemoveDto) {
        Logger.verbose(`receive ${EventEnum.CLIENT_PORT_REMOVE} event with payload: ${payload}`)
        this.clientGatewayService.updatePortAndUserRelation(payload?.clientId)
    }
}
