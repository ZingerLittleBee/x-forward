import { MapInterceptor } from '@automapper/nestjs'
import { Controller, Get, Ip, Param, UseInterceptors } from '@nestjs/common'
import { ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { ApiResultResponse, Result } from '@x-forward/common'
import { optimizeFieldInterceptor } from '../../interceptor/result.interceptor'
import { ClientService } from './client.service'
import { ClientEntity } from './entity/client.entity'
import { ClientVo } from './vo/client.vo'

@ApiTags('client')
@Controller('client')
export class ClientController {
    constructor(private readonly clientService: ClientService) {}

    @Get()
    @ApiResultResponse(ClientVo, { isArray: true })
    @UseInterceptors(MapInterceptor(ClientVo, ClientEntity, { isArray: true }), optimizeFieldInterceptor)
    async getAll() {
        return Result.okData(await this.clientService.findAll())
    }

    @Get('/id/:id')
    @ApiResultResponse(ClientVo)
    @ApiExtraModels(ClientEntity, ClientVo)
    @UseInterceptors(MapInterceptor(ClientVo, ClientEntity), optimizeFieldInterceptor)
    async getById(@Param('id') id: string) {
        return Result.okData(await this.clientService.getById(id))
    }

    @Get('/ip/:ip')
    @ApiResultResponse(ClientVo)
    @UseInterceptors(MapInterceptor(ClientVo, ClientEntity), optimizeFieldInterceptor)
    async getByIp(@Param('ip') ip: string, @Ip() requestIp: string) {
        return Result.okData(await this.clientService.getByIp(ip ? ip : requestIp))
    }
}
