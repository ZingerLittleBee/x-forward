import { MapInterceptor, MapPipe } from '@automapper/nestjs'
import { Body, Controller, Get, Param, Post, UseInterceptors } from '@nestjs/common'
import { ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { ApiResultResponse } from '@x-forward/common'
import * as moment from 'moment'
import { ClientService } from './client.service'
import { CreateClientDto } from './dto/create-client.dto'
import { ClientEntity } from './entity/client.entity'
import { ClientVo } from './vo/client.vo'

@ApiTags('client')
@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Get(':id')
    @ApiResultResponse(ClientVo)
    @ApiExtraModels(ClientEntity, ClientVo)
    @UseInterceptors(MapInterceptor(ClientVo, ClientEntity))
    async getById(@Param('id') id: string): Promise<ClientVo> {
        return this.clientService.getById(id)
    }

    @Post()
    @ApiResultResponse('string')
    async register(@Body(MapPipe(ClientEntity, CreateClientDto)) client: CreateClientDto): Promise<string> {
        if (!client.lastCommunicationTime) {
            client.lastCommunicationTime = moment().toDate()
        }
        return (await this.clientService.register(client as ClientEntity))?.id
    }
}
