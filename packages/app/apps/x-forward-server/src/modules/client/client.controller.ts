import { MapInterceptor, MapPipe } from '@automapper/nestjs'
import { Body, Controller, Get, Ip, Param, Post, UseInterceptors } from '@nestjs/common'
import { ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { ApiResultResponse, Result } from '@x-forward/common'
import * as moment from 'moment'
import { ClientService } from './client.service'
import { CreateClientDto } from './dto/create-client.dto'
import { ClientEntity } from './entity/client.entity'
import { ClientVo } from './vo/client.vo'

@ApiTags('client')
@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Get('/id/:id')
    @ApiResultResponse(ClientVo)
    @ApiExtraModels(ClientEntity, ClientVo)
    @UseInterceptors(MapInterceptor(ClientVo, ClientEntity))
    async getById(@Param('id') id: string): Promise<ClientVo> {
        return this.clientService.getById(id)
    }

    @Get('/ip/:ip')
    @ApiResultResponse(ClientVo)
    @UseInterceptors(MapInterceptor(ClientVo, ClientEntity))
    async getByIp(@Param('ip') ip: string, @Ip() requestIp: string) {
        return Result.okData(await this.clientService.getByIp(ip ? ip : requestIp))
    }

    @Post('register')
    @ApiResultResponse('string')
    async register(@Body(MapPipe(ClientEntity, CreateClientDto)) client: CreateClientDto) {
        if (!client.lastCommunicationTime) {
            client.lastCommunicationTime = moment().toDate()
        }
        return Result.okData({ id: await this.clientService.register(client as ClientEntity) })
    }
}
