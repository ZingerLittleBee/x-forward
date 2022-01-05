import { Module } from '@nestjs/common'
import { ExecutorModule } from '@x-forward/executor'
import { StreamModule } from '../stream/stream.module'
import { UpstreamModule } from '../upstream/upstream.module'
import { ExecutorGatewayService } from './executor-gateway.service'
import { ModelGatewayService } from './model-gateway.service'
import { QueryGatewayService } from './query-gateway.service'
import { RenderModule } from '@x-forward/render'

@Module({
    imports: [ExecutorModule, RenderModule, UpstreamModule, StreamModule],
    providers: [ExecutorGatewayService, ModelGatewayService, QueryGatewayService],
    exports: [ExecutorGatewayService, ModelGatewayService, QueryGatewayService]
})
export class GatewayModule {}
