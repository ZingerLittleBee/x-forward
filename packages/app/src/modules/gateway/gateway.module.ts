import { Module } from '@nestjs/common'
import { ExecutorModule } from '../executor/executor.module'
import { RenderModule } from '../render/render.module'
import { StreamModule } from '../stream/stream.module'
import { UpstreamModule } from '../upstream/upstream.module'
import { ExecutorGatewayService, ModelGatewayService } from './gateway.service'

@Module({
    imports: [ExecutorModule, RenderModule, UpstreamModule, StreamModule],
    providers: [ExecutorGatewayService, ModelGatewayService],
    exports: [ExecutorGatewayService, ModelGatewayService]
})
export class GatewayModule {}
