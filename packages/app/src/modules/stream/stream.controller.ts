import { MapInterceptor, MapPipe } from '@automapper/nestjs'
import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common'
import { NginxLoadBalancingEnum } from 'src/enums/NginxEnum'
import { Result } from 'src/utils/Result'
import { PatchApi } from '../patch/patch.api'
import { StreamDto } from './stream.dto'
import { Stream } from './stream.entity'
import { StreamService } from './stream.service'
import { StreamVo } from './stream.vo'

@Controller('stream')
export class StreamController {
    constructor(private streamService: StreamService, private patchApi: PatchApi) {}

    @Get('test')
    test() {
        let upstreams = [
            {
                name: 'upstream1',
                load_balancing: NginxLoadBalancingEnum.poll,
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
                        upstream_host: '192.168.0.2',
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
                listen_port: 9528,
                proxy_pass: 'upstream1'
            }
        ]
        this.patchApi.streamPatch(upstreams, servers)
    }

    @Get('')
    @UseInterceptors(MapInterceptor(StreamVo, Stream, { isArray: true }))
    async getAllStream(): Promise<Stream[]> {
        return this.streamService.streamList()
    }

    /**
     * 批量添加 stream
     * @param streamEntitys Stream[]
     * @returns 添加的 id
     */
    @Post('')
    addStream(@Body(MapPipe(Stream, StreamDto, { isArray: true })) stream: StreamDto[]) {
        return this.streamService.streamAdd(stream as Stream[])
    }

    /**
     * 更新 stream 规则的可用状态
     * @param state state
     */
    @Post(':id/state')
    async updateStateById(@Param('id') id: number, @Body() { state }: { state: number }) {
        let res = await this.streamService.stateUpdate(id, state)
        return res ? Result.ok() : Result.noWithMsg('更新 state 状态失败')
    }

    /**
     * 根据 stream id 更新 stream
     * @param streamEntity 要更新的内容, 不存在的属性保持默认
     */
    @Patch(':id')
    updateStreamById(@Param('id') id: string, @Body(MapPipe(Stream, StreamDto)) stream: StreamDto) {
        this.streamService.patchStreamById(id, stream as Stream)
    }

    /**
     * 根据 stream id 更新所有 stream
     * @param streamEntity 要更新的内容, 不存在的属性保持默认
     */
    @Patch('')
    async updateAllStream(@Body(MapPipe(Stream, StreamDto, { isArray: true })) streams: StreamDto[]) {
        // 剔除 id 为空的选项
        return Result.okData(await this.streamService.patchAllStream(streams.filter(s => s.id) as Stream[]))
    }

    /**
     * 根据 id 删除 stream (软删除)
     * 更新 delete_time 字段
     * @param id id
     */
    @Delete(':id')
    async deleteStreamById(@Param('id') id: string) {
        return Result.okData(await this.streamService.updateDeletetimeById(id))
    }

    /**
     * 删除所有 stream (软删除)
     * 更新 delete_time 字段
     */
    @Delete('')
    async deleteAllStream() {
        return Result.okData(await this.streamService.updateDeletetime())
    }
}
