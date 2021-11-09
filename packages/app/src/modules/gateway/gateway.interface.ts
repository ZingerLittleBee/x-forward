import { NginxConfig } from '../executor/interface/executor.interface'
import { RenderModel } from '../render/render.interface'
import { StreamEntity } from '../stream/stream.entity'
import { UpstreamEntity } from '../upstream/upstream.entity'

export interface ExecutorGatewayApi {
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

    /**
     * update stream configuration
     * @param servers StreamServer[]
     * @param upstreams StreamUpstream[]
     */
    streamPatch: (renderModel: RenderModel) => void
}

export interface ModelGatewayApi {
    getFullStream: () => Promise<{ streamEntities: StreamEntity[]; upstreamEntities: UpstreamEntity[] }>
}
