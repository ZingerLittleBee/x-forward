import { StreamServer, StreamUpstream, UpstreamServer } from '../modules/render/render.interface'
import { StreamEntity } from '../modules/stream/stream.entity'
import { UpstreamEntity } from '../modules/upstream/upstream.entity'

/**
 * StreamEntity -> StreamServer
 * @param streamEntities StreamEntity
 * @returns StreamServer
 */
export function streamEntities2StreamServer(streamEntities: StreamEntity) {
    // required field should init
    const streamServer: StreamServer = {
        listen_port: 0,
        proxy_pass: ''
    }
    if (streamEntities.upstreamId) {
        streamServer['proxy_pass'] = streamEntities.upstreamId
    } else {
        streamServer['proxy_pass'] = `${streamEntities.remoteHost}:${streamEntities.remotePort}`
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

/**
 * UpstreamEntity to StreamUpstream
 * @param upstreamEntities UpstreamEntity
 * @returns StreamUpstream
 */
export function upstreamEntities2StreamUpstream(upstreamEntities: UpstreamEntity) {
    const streamUpstream: StreamUpstream = {
        name: '',
        server: []
    }
    streamUpstream['name'] = upstreamEntities.name
    upstreamEntities.loadBalancing && (streamUpstream['load_balancing'] = upstreamEntities.loadBalancing)
    if (upstreamEntities.server) {
        streamUpstream['server'] = upstreamEntities.server.map<UpstreamServer>(s => {
            const temp: UpstreamServer = {
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
    } else {
        return null
    }
    return streamUpstream
}
