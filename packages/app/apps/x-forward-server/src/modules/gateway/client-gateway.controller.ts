import { MapPipe } from '@automapper/nestjs'
import { Body, Controller, Get, Logger, Param, Post, UseInterceptors } from '@nestjs/common'
import { ApiTags } from '@nestjs/swagger'
import { Result } from '@x-forward/common'
import { GatewayEndPoint } from '@x-forward/common/constants/endpoint.constant'
import { CommunicationKeyAuthInterceptor } from '@x-forward/common/interceptor/auth.interceptor'
import * as moment from 'moment'
import { inspect } from 'util'
import { CreateClientDto } from '../client/dto/create-client.dto'
import { ClientEntity } from '../client/entity/client.entity'
import { ClientGatewayService } from './services/client-gateway.service'

@ApiTags(GatewayEndPoint.REGISTER)
@Controller()
export class ClientGatewayController {
    constructor(private readonly clientGatewayService: ClientGatewayService) {}

    @UseInterceptors(CommunicationKeyAuthInterceptor)
    @Get(`${GatewayEndPoint.RELATION}/:clientId`)
    async getPortAndUserRelation(@Param('clientId') clientId: string) {
        return Result.okData(await this.clientGatewayService.getPortAndUserRelation(clientId))
    }

    @UseInterceptors(CommunicationKeyAuthInterceptor)
    @Post(GatewayEndPoint.REGISTER)
    async register(@Body(MapPipe(ClientEntity, CreateClientDto)) client: CreateClientDto) {
        Logger.verbose(`${inspect(client)}, 请求注册`)
        if (!client.lastCommunicationTime) {
            client.lastCommunicationTime = moment().toDate()
        }
        const res = await this.clientGatewayService.register(client as ClientEntity)
        if (res) {
            return Result.okData({ id: res })
        }
        return Result.noWithMsg('client 注册失败, 请确保 ip 或 domain 正确')
    }
}
