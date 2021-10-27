import { Injectable } from '@nestjs/common'
import { ExecutorService } from '../executor/executor.service'
import { GatewayApi } from './gateway.interface'

@Injectable()
export class GatewayService implements GatewayApi {
    constructor(private executorService: ExecutorService) {}

    async fetchNginxConfigArgs() {
        return this.executorService.getNginxConfigAargs()
    }

    async fetchNginxStreamConfigContent() {
        return this.executorService.getNginxStreamConfigContent()
    }

    async fetchDirByUrl(url: string) {
        return (await this.executorService.getDirByUrl(url))?.split('\n').filter(r => r !== '')
    }

    streamPatch(content: string) {
        this.executorService.patchStream(content)
    }
}
