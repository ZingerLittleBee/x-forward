import { MapInterceptor, MapPipe } from '@automapper/nestjs'
import { Body, Controller, Delete, Get, Param, Patch, Post, UseInterceptors } from '@nestjs/common'
import { Result } from 'src/utils/Result'
import { inspect } from 'util'
import { checkChain } from '../render/render.check'
import { RenderModel } from '../render/render.interface'
import { CreateStreamDto } from './create-stream.dto'
import { StreamDto } from './stream.dto'
import { StreamEntity } from './stream.entity'
import { StreamService } from './stream.service'
import { StreamVo } from './stream.vo'

@Controller('stream')
export class StreamController {
    constructor(private streamService: StreamService) {}

    @Get('test')
    async test() {
        const renderModel: RenderModel = {
            servers: [
                // normal
                {
                    listen_port: 1111,
                    proxy_pass: 'baidu.com:4653'
                },
                // error domain
                {
                    listen_port: 1112,
                    proxy_pass: 'xxxzq.qrqw:4653'
                },
                // normal
                {
                    listen_port: 1113,
                    proxy_pass: 'test7'
                },
                // error upstreamName
                {
                    listen_port: 1114,
                    proxy_pass: 'test8'
                },
                // repeated listen_port
                {
                    listen_port: 1114,
                    proxy_pass: 'test8'
                }
            ],
            upstreams: [
                {
                    name: 'test7',
                    server: [
                        { upstream_host: 'baidu.com', upstream_port: 123 },
                        { upstream_host: '123q.c', upstream_port: 123 }
                    ]
                },
                {
                    name: 'test7',
                    server: [
                        { upstream_host: 'baidu.com', upstream_port: 123 },
                        { upstream_host: '123q.c', upstream_port: 123 }
                    ]
                }
            ]
        }
        console.log('dnsCheck', inspect(await checkChain(renderModel), { depth: 4 }))
        console.log('dnsCheck end')
    }

    @Get()
    @UseInterceptors(MapInterceptor(StreamVo, StreamEntity, { isArray: true }))
    async getAllStream(): Promise<StreamEntity[]> {
        return this.streamService.findAll()
    }

    @Post()
    @UseInterceptors(MapInterceptor(StreamVo, StreamEntity, { isArray: true }))
    createOne(@Body(MapPipe(StreamEntity, CreateStreamDto)) stream: CreateStreamDto) {
        return this.streamService.create(stream as StreamEntity)
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
    async updateStateById(@Param('id') id: number, @Body() { state }: { state: number }) {
        return Result.okData((await this.streamService.stateUpdate(id, state)).affected)
    }

    /**
     * 根据 stream id 更新 stream
     * @param streamEntity 要更新的内容, 不存在的属性保持默认
     */
    @Patch(':id')
    async updateStreamById(@Param('id') id: string, @Body(MapPipe(StreamEntity, StreamDto)) stream: StreamDto) {
        return Result.okData((await this.streamService.update(id, stream as StreamEntity)).affected)
    }

    /**
     * 根据 stream id 更新所有 stream
     * @param streamEntity 要更新的内容, 不存在的属性保持默认
     */
    @Patch()
    async updateAllStream(@Body(MapPipe(StreamEntity, StreamDto, { isArray: true })) streams: StreamDto[]) {
        // 剔除 id 为空的选项
        return Result.okData(await this.streamService.updateAll(streams.filter(s => s.id) as StreamEntity[]))
    }

    /**
     * 根据 id 删除 stream (软删除)
     * 更新 delete_time 字段
     * @param id id
     */
    @Delete(':id')
    async delete(@Param('id') id: string) {
        return Result.okData(await this.streamService.delete(id))
    }

    /**
     * 删除所有 stream (软删除)
     * 更新 delete_time 字段
     */
    @Delete()
    async deleteAllStream() {
        return Result.okData(await this.streamService.deleteAll())
    }
}
