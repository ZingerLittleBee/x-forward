import { Injectable } from '@nestjs/common'
import { ExecutorService } from '../executor/executor.service'
import { StreamServer, StreamUpstream } from '../render/render.interface'
import { RenderService } from '../render/render.service'
import { GatewayApi } from './gateway.interface'

@Injectable()
export class GatewayService implements GatewayApi {
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

    streamPatch(servers: StreamServer[], upstreams?: StreamUpstream[]) {
        this.executorService.patchStream(this.renderService.renderStream(servers, upstreams))
    }
}
