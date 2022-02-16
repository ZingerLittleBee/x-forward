import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventEnum } from '@x-forward/common'
import { StreamServer, StreamUpstream } from '@x-forward/render/render.interface'
import { inspect } from 'util'
import { ExecutorGatewayService } from '../../modules/gateway/services/executor-gateway.service'
import { ModelGatewayService } from '../../modules/gateway/services/model-gateway.service'
import { StreamEntity } from '../../modules/stream/entity/stream.entity'
import { UpstreamEntity } from '../../modules/upstream/entity/upstream.entity'
import { streamEntities2StreamServer, upstreamEntities2StreamUpstream } from '../../utils/transform.util'

@Injectable()
export class ConfigChangeListener {
    constructor(private executorGateway: ExecutorGatewayService, private modelGatewayService: ModelGatewayService) {}

    /**
     * get full stream and data conversion
     * @returns Promise<{ servers: StreamServer[]; upstreams: StreamUpstream[]; }>
     */
    private async collectModels() {
        const { streamEntities, upstreamEntities } = await this.modelGatewayService.getFullStream()
        streamEntities.forEach(s => {
            // transform upstream_id to upstream_name
            if (s.upstreamId) {
                for (const upstream of upstreamEntities) {
                    if (upstream.id === s.upstreamId) {
                        s.upstreamId = upstream.name
                        break
                    }
                }
            }
        })
        const { servers, upstreams } = this.fieldTransformation(streamEntities, upstreamEntities)
        Logger.verbose(`Model -> servers: ${inspect(servers)}, upstreams: ${inspect(upstreams, { depth: 3 })}`)
        return { servers, upstreams }
    }

    /**
     * (StreamEntity[], UpstreamEntity[]) to { servers: StreamServer[]; upstreams: StreamUpstream[]; }
     * @param streamEntities StreamServer[]
     * @param upstreamEntities StreamUpstream[]
     * @returns RenderModel
     */
    private fieldTransformation(streamEntities: StreamEntity[], upstreamEntities: UpstreamEntity[]) {
        const res: { servers: StreamServer[]; upstreams?: StreamUpstream[] } = { servers: [] }
        const upstreams = upstreamEntities.map(u => upstreamEntities2StreamUpstream(u))
        upstreams && (res.upstreams = upstreams)
        const servers = streamEntities.map(s => streamEntities2StreamServer(s))
        servers && (res.servers = servers)
        return res
    }

    @OnEvent(EventEnum.CONFIG_CREATE)
    async handleConfigCreate() {
        Logger.verbose(`received ${EventEnum.CONFIG_CREATE} event}`)
        this.executorGateway.streamPatch(await this.collectModels())
    }

    @OnEvent(EventEnum.CONFIG_UPDATE)
    async handleConfigUpdate() {
        Logger.verbose(`received ${EventEnum.CONFIG_UPDATE} event}`)
        this.executorGateway.streamPatch(await this.collectModels())
    }

    @OnEvent(EventEnum.CONFIG_DELETE)
    async handleConfigDelete() {
        Logger.verbose(`received ${EventEnum.CONFIG_DELETE} event}`)
        this.executorGateway.streamPatch(await this.collectModels())
    }
}
