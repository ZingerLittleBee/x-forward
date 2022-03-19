import { MapInterceptor, MapPipe } from '@automapper/nestjs'
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseInterceptors } from '@nestjs/common'
import { ApiBody, ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { ApiResultResponse, Result } from '@x-forward/common'
import { optimizeFieldInterceptor } from '../../interceptor/result.interceptor'
import { CreateStreamDto } from './dto/create-stream.dto'
import { StreamDto } from './dto/stream.dto'
import { StreamEntity } from './entity/stream.entity'
import { StreamService } from './stream.service'
import { StreamVo } from './vo/stream.vo'

@ApiTags('stream')
@Controller('stream')
export class StreamController {
    constructor(private streamService: StreamService) {}

    @Get()
    @ApiResultResponse(StreamVo, { isArray: true })
    @ApiExtraModels(StreamVo)
    @UseInterceptors(MapInterceptor(StreamVo, StreamEntity, { isArray: true }), optimizeFieldInterceptor)
    async getStream(@Query('clientId') clientId: string) {
        return Result.okData(await this.streamService.findByClientId(clientId))
    }

    @Post()
    @ApiResultResponse(StreamVo)
    @UseInterceptors(optimizeFieldInterceptor)
    async createOne(@Body(MapPipe(StreamEntity, CreateStreamDto)) stream: CreateStreamDto) {
        return Result.okData(await this.streamService.create(stream as StreamEntity))
    }

    /**
     * 更新 stream 规则的可用状态
     * @param id id
     * @param state state
     */
    @Post(':id/state')
    @ApiBody({ schema: { properties: { state: { type: 'number' } } } })
    @ApiResultResponse()
    async updateStateById(@Body() { state }: { state: number }, @Param('id') id: string) {
        await this.streamService.stateUpdate(id, state)
        return Result.ok()
    }

    /**
     * update upstreamId by StreamId
     * @param id id
     * @param upstreamId upstreamId
     */
    @Patch(':id/upstream_id')
    @ApiResultResponse('number')
    async updateUpstreamIdById(@Param('id') id: string, @Body() { upstreamId }: { upstreamId: string }) {
        return Result.okData((await this.streamService.upstreamIdUpdate(id, upstreamId)).affected)
    }

    /**
     * 根据 stream id 更新 stream
     * @param streamEntity 要更新的内容, 不存在的属性保持默认
     */
    @Patch(':id')
    @ApiResultResponse('number')
    async updateStreamById(@Param('id') id: string, @Body(MapPipe(StreamEntity, StreamDto)) stream: StreamDto) {
        return Result.okData((await this.streamService.update(id, stream as StreamEntity)).affected)
    }

    /**
     * 根据 stream id 更新所有 stream
     * @param streams
     */
    @Patch()
    @ApiResultResponse()
    async updateAllStream(@Body(MapPipe(StreamEntity, StreamDto, { isArray: true })) streams: StreamDto[]) {
        // 剔除 id 为空的选项
        await this.streamService.updateAll(streams.filter(s => s.id) as StreamEntity[])
        return Result.ok()
    }

    /**
     * 根据 id 删除 stream (软删除)
     * 更新 delete_time 字段
     * @param id id
     */
    @Delete(':id')
    @ApiResultResponse('number')
    async delete(@Param('id') id: string) {
        return Result.okData((await this.streamService.delete(id)).affected)
    }

    /**
     * 删除所有 stream (软删除)
     * 更新 delete_time 字段
     */
    @Delete(':clientId')
    @ApiResultResponse('number')
    async deleteAllStream(@Param('clientId') clientId: string) {
        return Result.okData((await this.streamService.deleteAll(clientId)).affected)
    }
}
