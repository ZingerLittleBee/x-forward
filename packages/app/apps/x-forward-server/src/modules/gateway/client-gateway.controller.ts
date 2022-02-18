import { MapPipe } from '@automapper/nestjs'
import { Body, Controller, Get, Param, Post } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Result } from '@x-forward/common'
import EndPoint from '@x-forward/common/constants/endpoint.constant'
import * as moment from 'moment'
import { CreateClientDto } from '../client/dto/create-client.dto'
import { ClientEntity } from '../client/entity/client.entity'
import { ClientGatewayService } from './services/client-gateway.service'

@ApiTags(EndPoint.REGISTER)
@Controller()
export class ClientGatewayController {
    constructor(private readonly clientGatewayService: ClientGatewayService) {}

    @Get(`${EndPoint.RELATION}/:clientId`)
    async getPortAndUserRelation(@Param('clientId') clientId: string) {
        return Result.okData(await this.clientGatewayService.getPortAndUserRelation(clientId))
    }

    @Post(EndPoint.REGISTER)
    async register(@Body(MapPipe(ClientEntity, CreateClientDto)) client: CreateClientDto) {
        if (!client.lastCommunicationTime) {
            client.lastCommunicationTime = moment().toDate()
        }
        return Result.okData({ id: await this.clientGatewayService.register(client as ClientEntity) })
    }
}
