import { Injectable } from '@nestjs/common'
import { omit } from 'lodash'
import { ExecutorService } from '../executor/executor.service'
import { RenderModel } from '../render/render.interface'
import { RenderService } from '../render/render.service'
import { StreamService } from '../stream/stream.service'
import { UpstreamService } from '../upstream/upstream.service'
import { ExecutorGatewayApi, ModelGatewayApi } from './gateway.interface'

@Injectable()
export class ExecutorGatewayService implements ExecutorGatewayApi {
    constructor(private executorService: ExecutorService, private renderService: RenderService) {}

    async fetchNginxConfigArgs() {
        return this.executorService.getNginxConfigAargs()
    }

    async fetchNginxStreamConfigContent() {
        return this.executorService.getNginxStreamConfigContent()
    }

    async fetchDirectoryByUrl(url: string) {
        return (await this.executorService.getDirByUrl(url))?.split('\n').filter(r => r !== '')
    }

    async streamPatch(renderModel: RenderModel) {
        this.executorService.patchStream(await this.renderService.renderStream(renderModel))
    }
}

@Injectable()
export class ModelGatewayService implements ModelGatewayApi {
    constructor(private readonly upstreamService: UpstreamService, private readonly streamService: StreamService) {}

    async getFullStream() {
        let upstreams = await this.upstreamService.findEffect()
        let streams = await this.streamService.findNullFK()
        streams = streams.concat(
            upstreams
                .map(u => {
                    u.stream?.forEach(s => (s.upstreamId = u.id))
                    return u.stream
                })
                .flat()
        )
        upstreams = upstreams.map(u => omit(u, 'stream'))
        return {
            streamEntities: streams,
            upstreamEntities: upstreams
        }
    }
}
