import { NginxConfig, NginxStatus } from '@x-forward/executor'
import { StreamEntity } from '../../stream/entity/stream.entity'
import { UpstreamEntity } from '../../upstream/entity/upstream.entity'

export interface ExecutorGatewayApi {
    /**
     * update stream configuration
     * @param url url
     * @param content content
     */
    streamPatch: (url: string, content: string) => void

    /**
     * rewrite stream config
     */
    streamRewrite: (clientId: string, content: string) => void

    /**
     * rewrite nginx main config
     */
    mainConfigRewrite: (clientId: string, content: string) => void

    /**
     * service nginx start
     */
    nginxStart: (clientId: string) => void

    /**
     * service nginx stop
     */
    nginxStop: (clientId: string) => void

    /**
     * service nginx restart
     */
    nginxRestart: (clientId: string) => void
}

export interface QueryGatewayApi {
    /**
     * query nginx running status
     */
    queryNginxStatus: () => Promise<NginxStatus>

    /**
     * fetch args of nginx configuration
     * @returns NginxConfig
     */
    fetchNginxConfigArgs: () => Promise<NginxConfig>

    /**
     * fetch nginx stream configuration content
     * @returns configuration file of stream content
     */
    fetchNginxStreamConfigContent: () => Promise<string>

    /**
     * ftech directory name under ${url}
     * @param url specified url
     * @returns Collections of directory name under url
     */
    fetchDirectoryByUrl: (url: string) => Promise<string[]>
}

export interface ModelGatewayApi {
    /**
     * get stream with upstream, exclude state !== 0
     */
    getFullStream: () => Promise<{ streamEntities: StreamEntity[]; upstreamEntities: UpstreamEntity[] }>
}
