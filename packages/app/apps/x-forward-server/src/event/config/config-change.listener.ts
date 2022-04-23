import { removeProtocol, StateEnum } from '@forwardx/shared'
import { Injectable, Logger } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventEnum } from '@x-forward/common'
import { RenderService } from '@x-forward/render'
import { StreamServer, StreamUpstream } from '@x-forward/render/render.interface'
import { inspect } from 'util'
import { ClientService } from '../../modules/client/client.service'
import { ExecutorGatewayService } from '../../modules/gateway/services/executor-gateway.service'
import { StreamEntity } from '../../modules/stream/entity/stream.entity'
import { UpstreamEntity } from '../../modules/upstream/entity/upstream.entity'
import { streamEntities2StreamServer, upstreamEntities2StreamUpstream } from '../../utils/transform.util'
import { ConfigChangePayload } from './config-change.interface'

@Injectable()
export class ConfigChangeListener {
    constructor(
        private executorGateway: ExecutorGatewayService,
        private readonly renderService: RenderService,
        private readonly clientService: ClientService
    ) {}

    /**
     * get full stream and data conversion
     * @returns Promise<{ servers: StreamServer[]; upstreams: StreamUpstream[]; }>
     */
    private async collectModels(clientId: string) {
        const { stream, upstream } = await this.clientService.findByIdWithRelations(clientId)
        const { servers, upstreams } = this.fieldTransformation(stream, upstream)
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
        const res: { servers: StreamServer[]; upstreams?: StreamUpstream[] } = { servers: [], upstreams: [] }
        upstreamEntities.forEach(u => {
            if (u.state === StateEnum.Able) {
                res.upstreams.push(upstreamEntities2StreamUpstream(u))
            }
        })
        streamEntities.forEach(s => {
            if (s.state === StateEnum.Able) {
                if (s?.upstreamId) {
                    res.servers.push(
                        streamEntities2StreamServer(s, upstreamEntities.find(u => u.id === s.upstreamId)?.name)
                    )
                }
                res.servers.push(streamEntities2StreamServer(s))
            }
        })
        return res
    }

    private async getUrlByClientId(id: string) {
        const client = await this.clientService.getById(id)
        const host = client?.ip ? removeProtocol(client?.ip) : removeProtocol(client?.domain)
        return `${host}:${client?.port}`
    }

    private async rewriteStream(clientId: string, content?: string) {
        const config = content ? content : await this.renderService.renderStream(await this.collectModels(clientId))
        Logger.verbose(`clientId: ${clientId}, new stream config: ${config}`)
        this.executorGateway.streamRewrite(clientId, config)
    }

    @OnEvent(EventEnum.CONFIG_CREATE)
    async handleConfigCreate(payload: ConfigChangePayload) {
        Logger.verbose(`received ${EventEnum.CONFIG_CREATE} event}`)
        this.rewriteStream(payload?.clientId)
    }

    @OnEvent(EventEnum.CONFIG_UPDATE)
    async handleConfigUpdate(payload: ConfigChangePayload) {
        Logger.verbose(`received ${EventEnum.CONFIG_UPDATE} event}`)
        this.rewriteStream(payload?.clientId)
    }

    @OnEvent(EventEnum.CONFIG_DELETE)
    async handleConfigDelete(payload: ConfigChangePayload) {
        Logger.verbose(`received ${EventEnum.CONFIG_DELETE} event}`)
        this.rewriteStream(payload?.clientId)
    }

    @OnEvent(EventEnum.CONFIG_BATCH_START)
    async handleConfigBatchStart(payload: ConfigChangePayload) {
        Logger.verbose(`received ${EventEnum.CONFIG_BATCH_START} event}`)
        this.rewriteStream(payload?.clientId)
        if (payload?.clientId) {
            this.rewriteStream(payload.clientId)
        } else {
            const clients = await this.clientService.getIds()
            clients?.forEach(c => this.rewriteStream(c.id))
        }
    }

    @OnEvent(EventEnum.CONFIG_BATCH_RESTART)
    async handleConfigBatchRestart(payload: ConfigChangePayload) {
        Logger.verbose(`received ${EventEnum.CONFIG_BATCH_RESTART} event}`)
        this.executorGateway.nginxRestart(payload?.clientId)
        if (payload?.clientId) {
            this.executorGateway.nginxRestart(payload.clientId)
        } else {
            const clients = await this.clientService.getIds()
            clients?.forEach(c => this.executorGateway.nginxRestart(c.id))
        }
    }

    @OnEvent(EventEnum.CONFIG_BATCH_STOP)
    async handleConfigBatchStop(payload: ConfigChangePayload) {
        Logger.verbose(`received ${EventEnum.CONFIG_BATCH_STOP} event}`)
        if (payload?.clientId) {
            this.rewriteStream(payload.clientId, '')
        } else {
            const clients = await this.clientService.getIds()
            clients?.forEach(c => this.rewriteStream(c.id, ''))
        }
    }

    @OnEvent(EventEnum.CONFIG_BATCH_DELETE)
    async handleConfigBatchDelete(payload: ConfigChangePayload) {
        Logger.verbose(`received ${EventEnum.CONFIG_BATCH_DELETE} event}`)
        const clients = await this.clientService.getIds()
        payload?.clientId
            ? this.rewriteStream(payload.clientId, '')
            : clients?.forEach(c => this.rewriteStream(c.id, ''))
    }
}
