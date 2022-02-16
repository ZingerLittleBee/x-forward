import { Injectable } from '@nestjs/common'
import { ExecutorService } from '@x-forward/executor'
import { RenderService } from '@x-forward/render'
import { RenderModel } from '@x-forward/render/render.interface'
import { ExecutorGatewayApi } from '../interface/gateway.interface'

@Injectable()
export class ExecutorGatewayService implements ExecutorGatewayApi {
    constructor(private executorService: ExecutorService, private renderService: RenderService) {}

    async streamPatch(renderModel: RenderModel) {
        this.executorService.patchStream(await this.renderService.renderStream(renderModel))
    }
}
