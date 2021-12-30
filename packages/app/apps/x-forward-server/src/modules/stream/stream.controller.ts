import { Result } from '@app/x-forward-common'
import { MapInterceptor, MapPipe } from '@automapper/nestjs'
import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common'
import { ApiExtraModels, ApiTags } from '@nestjs/swagger'
import { ApiResultResponse } from '../../decorators/response.api'
import { CreateStreamDto } from './create-stream.dto'
import { StreamDto } from './stream.dto'
import { StreamEntity } from './stream.entity'
import { StreamService } from './stream.service'
import { StreamVo } from './stream.vo'

@ApiTags('stream')
@Controller('stream')
export class StreamController {
    constructor(private streamService: StreamService) {}

    @Get()
    @ApiResultResponse(StreamVo, { isArray: true })
    @ApiExtraModels(StreamVo)
    @UseInterceptors(MapInterceptor(StreamVo, StreamEntity, { isArray: true }))
    async getAllStream() {
        return Result.okData(await this.streamService.findAll())
    }

    @Post()
    @ApiResultResponse(StreamVo)
    @UseInterceptors(MapInterceptor(StreamVo, StreamEntity, { isArray: true }))
    async createOne(@Body(MapPipe(StreamEntity, CreateStreamDto)) stream: CreateStreamDto) {
        return Result.okData(await this.streamService.create(stream as StreamEntity))
    }

    // /**
    //  * 批量添加 stream
    //  * @param streamEntitys Stream[]
    //  * @returns 添加的 id
    //  */
    // @Post()
    // createStream(@Body(MapPipe(StreamEntity, CreateStreamDto, { isArray: true })) stream: CreateStreamDto[]) {
    //     return this.streamService.streamSaveAll(stream as StreamEntity[])
    // }

    /**
     * 更新 stream 规则的可用状态
     * @param state state
     */
    @Post(':id/state')
    @ApiResultResponse()
    async updateStateById(@Param('id') id: string, @Body() { state }: { state: number }) {
        await this.streamService.stateUpdate(id, state)
        return Result.okMsg(`更新 id: ${id}, 成功`)
    }

    /**
     * update UpstreamName by StreamId
     * @param name name
     */
    @Patch(':id/name')
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
     * @param streamEntity 要更新的内容, 不存在的属性保持默认
     */
    @Patch()
    @ApiResultResponse()
    async updateAllStream(@Body(MapPipe(StreamEntity, StreamDto, { isArray: true })) streams: StreamDto[]) {
        // 剔除 id 为空的选项
        await this.streamService.updateAll(streams.filter(s => s.id) as StreamEntity[])
        return Result.okMsg('更新成功')
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
    @Delete()
    @ApiResultResponse('number')
    async deleteAllStream() {
        return Result.okData((await this.streamService.deleteAll()).affected)
    }
}
