import { MapInterceptor, MapPipe } from '@automapper/nestjs'
import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common'
import { ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { ApiResultResponse } from 'src/decorators/response.api'
import { optimizeFieldInterceptor } from 'src/interceptor/result.interceptor'
import { Result } from 'src/utils/Result'
import { CreateUpstreamDto } from './create-upstream.dto'
import { CreateServerDto } from './server/dto/create-server.dto'
import { UpdateServerDto } from './server/dto/update-server.dto'
import { ServerEntity } from './server/entities/server.entity'
import { UpdateUpstreamDto } from './update-upstream.dto'
import { UpstreamEntity } from './upstream.entity'
import { UpstreamService } from './upstream.service'
import { UpstreamVo } from './upstream.vo'
@ApiTags('upstream')
@Controller('upstream')
export class UpstreamController {
    constructor(private readonly upstreamService: UpstreamService) {}
    @Post()
    @ApiExtraModels(ServerEntity, CreateServerDto, UpdateServerDto, UpstreamVo)
    @ApiResultResponse(UpstreamEntity)
    async create(@Body(MapPipe(UpstreamEntity, CreateUpstreamDto)) createUpstream: CreateUpstreamDto) {
        return Result.okData(await this.upstreamService.create(createUpstream as UpstreamEntity))
    }

    // @Get()
    // @ApiResultResponse(UpstreamVo, { isArray: true })
    // @UseInterceptors(MapInterceptor(UpstreamVo, UpstreamEntity, { isArray: true }), optimizeFieldInterceptor)
    // async findAll() {
    //     return Result.okData(await this.upstreamService.findAll())
    // }

    @Get()
    @ApiResultResponse(UpstreamVo, { isArray: true })
    @UseInterceptors(MapInterceptor(UpstreamVo, UpstreamEntity, { isArray: true }), optimizeFieldInterceptor)
    async findAll() {
        return Result.okData(await this.upstreamService.findAllWithoutEager())
    }

    @Get(':id')
    @ApiResultResponse(UpstreamVo)
    @UseInterceptors(MapInterceptor(UpstreamVo, UpstreamEntity), optimizeFieldInterceptor)
    async findOne(@Param('id') id: string) {
        return Result.okData(await this.upstreamService.findOne(id))
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
