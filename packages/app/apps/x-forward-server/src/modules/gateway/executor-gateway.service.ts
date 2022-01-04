import { Injectable } from '@nestjs/common'
import { ExecutorService } from 'libs/executor/src/executor.service'
import { RenderModel } from '../render/render.interface'
import { RenderService } from '../render/render.service'
import { ExecutorGatewayApi } from './interface/gateway.interface'

@Injectable()
export class ExecutorGatewayService implements ExecutorGatewayApi {
    constructor(private executorService: ExecutorService, private renderService: RenderService) {}

    async streamPatch(renderModel: RenderModel) {
        this.executorService.patchStream(await this.renderService.renderStream(renderModel))
    }
}
