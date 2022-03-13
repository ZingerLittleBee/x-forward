import { MapInterceptor, MapPipe } from '@automapper/nestjs'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiExtraModels, ApiQuery, ApiTags } from '@nestjs/swagger'
import { ApiResultResponse, Result } from '@x-forward/common'
import { optimizeFieldInterceptor } from '../../interceptor/result.interceptor'
import { CreateServerDto } from '../server/dto/create-server.dto'
import { UpdateServerDto } from '../server/dto/update-server.dto'
import { ServerEntity } from '../server/entity/server.entity'
import { CreateUpstreamDto } from './dto/create-upstream.dto'
import { UpdateUpstreamDto } from './dto/update-upstream.dto'
import { UpstreamEntity } from './entity/upstream.entity'
import { UpstreamService } from './upstream.service'
import { UpstreamVo } from './vo/upstream.vo'
@ApiTags('upstream')
@Controller('upstream')
export class UpstreamController {
    constructor(private readonly upstreamService: UpstreamService) {}

    @Get()
    @ApiResultResponse(UpstreamVo, { isArray: true })
    // https://github.com/nestjs/nest/issues/2169
    @ApiQuery({
        name: 'clientId',
        required: false,
        type: String
    })
    @UseInterceptors(MapInterceptor(UpstreamVo, UpstreamEntity, { isArray: true }), optimizeFieldInterceptor)
    async findAll(@Query('clientId') clientId?: string) {
        return Result.okData(await this.upstreamService.findAllWithoutEager(clientId))
    }

    @Get(':id')
    @ApiResultResponse(UpstreamVo)
    @UseInterceptors(MapInterceptor(UpstreamVo, UpstreamEntity, { isArray: true }), optimizeFieldInterceptor)
    async findOne(@Param('id') id: string) {
        return Result.okData(await this.upstreamService.findOne(id))
    }

    @Post()
    @ApiExtraModels(UpstreamEntity, ServerEntity, CreateServerDto, UpdateServerDto, UpstreamVo)
    @ApiResultResponse(UpstreamEntity)
    async create(@Body(MapPipe(UpstreamEntity, CreateUpstreamDto)) createUpstream: CreateUpstreamDto) {
        return Result.okData(await this.upstreamService.create(createUpstream as UpstreamEntity))
    }

    @Patch(':id')
    @ApiResultResponse('number')
    async update(
        @Param('id') id: string,
        @Body(MapPipe(UpstreamEntity, UpdateUpstreamDto)) updateUpstreamDto: UpdateUpstreamDto
    ) {
        return Result.okData((await this.upstreamService.update(id, updateUpstreamDto as UpstreamEntity)).affected)
    }

    @Delete(':id')
    @ApiResultResponse('number')
    async remove(@Param('id') id: string) {
        return Result.okData((await this.upstreamService.remove(id)).affected)
    }
}
