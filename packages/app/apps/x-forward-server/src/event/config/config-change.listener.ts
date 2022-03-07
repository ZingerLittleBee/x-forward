import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventEnum } from '@x-forward/common'
import { RenderService } from '@x-forward/render'
import { StreamServer, StreamUpstream } from '@x-forward/render/render.interface'
import { removeProtocol } from '@x-forward/shared'
import { inspect } from 'util'
import { ClientService } from '../../modules/client/client.service'
import { ExecutorGatewayService } from '../../modules/gateway/services/executor-gateway.service'
import { ModelGatewayService } from '../../modules/gateway/services/model-gateway.service'
import { StreamEntity } from '../../modules/stream/entity/stream.entity'
import { UpstreamEntity } from '../../modules/upstream/entity/upstream.entity'
import { streamEntities2StreamServer, upstreamEntities2StreamUpstream } from '../../utils/transform.util'
import { ConfigChangePayload } from './config-change.interface'

@Injectable()
export class ConfigChangeListener {
    constructor(
        private executorGateway: ExecutorGatewayService,
        private modelGatewayService: ModelGatewayService,
        private readonly renderService: RenderService,
        private readonly clientService: ClientService
    ) {}

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

    private async getUrlByClientId(id: string) {
        const client = await this.clientService.getById(id)
        const host = client?.ip ? removeProtocol(client?.ip) : removeProtocol(client?.domain)
        return `${host}:${client?.port}`
    }

    @OnEvent(EventEnum.CONFIG_CREATE)
    async handleConfigCreate(payload: ConfigChangePayload) {
        Logger.verbose(`received ${EventEnum.CONFIG_CREATE} event}`)
        const content = await this.renderService.renderStream(await this.collectModels())
        this.executorGateway.streamPatch(payload?.clientId, content)
    }

    @OnEvent(EventEnum.CONFIG_UPDATE)
    async handleConfigUpdate(payload: ConfigChangePayload) {
        Logger.verbose(`received ${EventEnum.CONFIG_UPDATE} event}`)
        const content = await this.renderService.renderStream(await this.collectModels())
        this.executorGateway.streamPatch(payload?.clientId, content)
    }

    @OnEvent(EventEnum.CONFIG_DELETE)
    async handleConfigDelete(payload: ConfigChangePayload) {
        Logger.verbose(`received ${EventEnum.CONFIG_DELETE} event}`)
        const content = await this.renderService.renderStream(await this.collectModels())
        this.executorGateway.streamPatch(payload?.clientId, content)
    }
}
