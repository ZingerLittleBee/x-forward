import {
    Body,
    Controller,
    Delete,
    Get,
    Param,
    Patch,
    Post
} from '@nestjs/common'
import { NginxLoadBalancing } from 'src/enums/NginxEnum'
import { Result } from 'src/utils/Result'
import { PatchApi } from '../patch/patch.api'
import { Stream } from './stream.entity'
import { StreamService } from './stream.service'

@Controller('stream')
export class StreamController {
    constructor(
        private streamService: StreamService,
        private patchApi: PatchApi
    ) {}

    @Get('test')
    test() {
        let upstreams = [
            {
                name: 'upstream1',
                load_balancing: NginxLoadBalancing.poll,
                server: [
                    {
                        upstream_host: '192.168.0.1',
                        upstream_port: 9527,
                        weight: 10,
                        max_conns: 0,
                        max_fails: 10,
                        fail_timeout: '10s'
                    },
                    {
                        upstream_host: '192.168.0.1',
                        upstream_port: 9527,
                        weight: 10,
                        max_conns: 0,
                        max_fails: 10,
                        fail_timeout: '10s'
                    }
                ]
            }
        ]
        let servers = [
            {
                listen_port: 9527,
                proxy_pass: 'upstream1'
            },
            {
                listen_port: 9527,
                proxy_pass: 'upstream1'
            }
        ]
        this.patchApi.streamPatch(upstreams, servers)
    }

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
