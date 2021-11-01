import { Injectable } from '@nestjs/common'
import { OnEvent } from '@nestjs/event-emitter'
import { EventEnum } from 'src/enums/event.enum'
import { GatewayService } from 'src/modules/gateway/gateway.service'
import { StreamServer, StreamUpstream, UpstreamServer } from 'src/modules/render/render.interface'
import { StreamEntity } from 'src/modules/stream/stream.entity'
import { UpstreamEntity } from 'src/modules/upstream/upstream.entity'
import { UpstreamService } from 'src/modules/upstream/upstream.service'

@Injectable()
export class ConfigChangeListener {
    constructor(private gatewayService: GatewayService, private upstreamService: UpstreamService) {}

    @OnEvent(EventEnum.CONFIG_CREATED)
    async handleConfigCreated(StreamEntities: StreamEntity[]) {
        const upstreamNames = StreamEntities.map(d => d.upstream)
        const UpstreamEntities = await this.upstreamService.findByNames(upstreamNames)
        const { servers, upstreams } = fieldTransformation(StreamEntities, UpstreamEntities)
        this.gatewayService.streamPatch(servers, upstreams)
        console.log('received config change event', StreamEntities)
    }

    @OnEvent(EventEnum.CONFIG_PATCH)
    handleConfigPatch() {
        console.log('received config patch event')
    }

    @OnEvent(EventEnum.CONFIG_DELETE)
    handleConfigDelete() {
        console.log('received config delete event')
    }
}

function fieldTransformation(streamEntities: StreamEntity[], upstreamEntities: UpstreamEntity[]) {
    return {
        servers: streamEntities.map(s => streamEntities2StreamServer(s)),
        upstreams: upstreamEntities.map(u => upstreamEntities2StreamUpstream(u))
    }
}

function streamEntities2StreamServer(streamEntities: StreamEntity) {
    let streamServer: StreamServer = {
        listen_port: 0,
        proxy_pass: ''
    }
    if (streamEntities.remoteHost && streamEntities.remotePort) {
        streamServer['proxy_pass'] = `${streamEntities.remoteHost}:${streamEntities.remotePort}`
    }
    if (streamEntities.upstream) {
        streamServer['proxy_pass'] = streamEntities.upstream
    }
    for (const key in streamEntities) {
        switch (key) {
            case 'transitPort':
                streamServer['listen_port'] = streamEntities[key]
                break
            case 'protocol':
                streamServer['protocol'] = streamEntities[key]
                break
            case 'isRetries':
                streamServer['proxy_next_upstream'] = streamEntities[key]
                break
            case 'tries':
                streamServer['proxy_next_upstream_tries'] = streamEntities[key]
                break
            case 'retriesTimeout':
                streamServer['proxy_next_upstream_timeout'] = streamEntities[key]
                break
            case 'connectTimeout':
                streamServer['proxy_connect_timeout'] = streamEntities[key]
                break
            case 'uploadRate':
                streamServer['proxy_upload_rate'] = +streamEntities[key]
                break
            case 'downloadRate':
                streamServer['proxy_download_rate'] = +streamEntities[key]
                break
            case 'proxyTimeout':
                streamServer['proxy_timeout'] = streamEntities[key]
                break
        }
    }
    return streamServer
}

function upstreamEntities2StreamUpstream(upstreamEntities: UpstreamEntity) {
    let streamUpstream: StreamUpstream = {
        name: '',
        server: []
    }
    streamUpstream['name'] = upstreamEntities.name
    upstreamEntities.loadBalancing && (streamUpstream['load_balancing'] = upstreamEntities.loadBalancing)
    if (upstreamEntities.server) {
        streamUpstream['server'] = upstreamEntities.server.map<UpstreamServer>(s => {
            let temp: UpstreamServer = {
                upstream_host: '',
                upstream_port: 0
            }
            if (s.down) temp['down'] = 'down'
            if (s.backup) temp['backup'] = 'backup'
            if (s.upstreamHost) temp['upstream_host'] = s.upstreamHost
            if (s.upstreamPort) temp['upstream_port'] = s.upstreamPort
            if (s.weight) temp['weight'] = s.weight
            if (s.maxConns) temp['max_conns'] = s.maxConns
            if (s.maxFails) temp['max_fails'] = s.maxFails
            if (s.failTimeout) temp['fail_timeout'] = s.failTimeout
            return temp
        })
    }
    return streamUpstream
}
