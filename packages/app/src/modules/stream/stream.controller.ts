import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post,
    Req
} from '@nestjs/common'
import { Result } from 'src/utils/Result'
import { Stream } from './stream.entity'
import { StreamService } from './stream.service'

@Controller('stream')
export class StreamController {
    constructor(private streamService: StreamService) {}

    @Get('')
    getAllStream(): Promise<Stream[]> {
        return this.streamService.streamList()
    }

    /**
     * 批量添加 stream
     * @param streamEntitys Stream[]
     * @returns 添加的 id
     */
    @Post('')
    addStream(@Body() streamEntitys: Stream[]) {
        console.log(streamEntitys)
        return this.streamService.streamAdd(streamEntitys)
    }

    /**
     * 更新 stream 规则的可用状态
     * @param state state
     */
    @Post(':id/state')
    async updateStateById(
        @Param('id') id: number,
        @Body() { state }: { state: number }
    ) {
        let res = await this.streamService.stateUpdate(id, state)
        return res ? Result.ok() : Result.noWithMsg('更新 state 状态失败')
    }

    /**
     * 根据 stream id 更新 stream
     * @param streamEntity 要更新的内容, 不存在的属性保持默认
     */
    @Patch(':id')
    updateStreamById(@Param('id') id: number, @Body() streamEntity: Stream) {}

    /**
     * 根据 stream id 更新所有 stream
     * @param streamEntity 要更新的内容, 不存在的属性保持默认
     */
    @Patch('')
    updateAllStream(@Body() streamEntity: Stream[]) {}

    /**
     * 根据 id 删除 stream (软删除)
     * 1. 更新 state 字段
     * 2. 更新 delete_time
     * @param id id
     */
    @Delete(':id')
    deleteStreamById(@Param('id') id: number) {}

    /**
     * 删除所有 stream
     * 1. 更新 state 字段
     * 2. 更新 delete_time
     */
    @Delete('')
    deleteAllStream() {}
}
