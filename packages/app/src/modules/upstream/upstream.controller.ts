import { MapInterceptor, MapPipe } from '@automapper/nestjs'
import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common'
import { optimizeFieldInterceptor } from 'src/interceptor/result.interceptor'
import { Result } from 'src/utils/Result'
import { CreateUpstreamDto } from './create-upstream.dto'
import { UpdateUpstreamDto } from './update-upstream.dto'
import { UpstreamEntity } from './upstream.entity'
import { UpstreamService } from './upstream.service'
import { UpstreamVo } from './upstream.vo'

@Controller('upstream')
export class UpstreamController {
    constructor(private readonly upstreamService: UpstreamService) {}
    @Post()
    async create(@Body(MapPipe(UpstreamEntity, CreateUpstreamDto)) createUpstream: CreateUpstreamDto) {
        return Result.okData(await this.upstreamService.create(createUpstream as UpstreamEntity))
    }

    @Get()
    @UseInterceptors(MapInterceptor(UpstreamVo, UpstreamEntity, { isArray: true }), optimizeFieldInterceptor)
    async findAll() {
        return Result.okData(await this.upstreamService.findAll())
    }

    @Get(':id')
    async findOne(@Param('id') id: string) {
        return Result.okData(await this.upstreamService.findOne(id))
    }

    @Patch(':id')
    async update(@Param('id') id: string, @Body(MapPipe(UpstreamEntity, UpdateUpstreamDto)) updateUpstreamDto: UpdateUpstreamDto) {
        return Result.okData((await this.upstreamService.update(id, updateUpstreamDto as UpstreamEntity)).affected)
    }

    @Delete(':id')
    async remove(@Param('id') id: string) {
        return Result.okData((await this.upstreamService.remove(id)).affected)
    }
}
