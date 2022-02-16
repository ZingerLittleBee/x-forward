import { Module } from '@nestjs/common'
import { ExecutorModule } from '@x-forward/executor'
import { RenderModule } from '@x-forward/render'
import { StreamModule } from '../stream/stream.module'
import { UpstreamModule } from '../upstream/upstream.module'
import { RelationsGatewayController } from './relations-gateway.controller'
import { ExecutorGatewayService } from './services/executor-gateway.service'
import { ModelGatewayService } from './services/model-gateway.service'
import { QueryGatewayService } from './services/query-gateway.service'
import { RelationsGatewayService } from './services/relations-gateway.service'

@Module({
    imports: [ExecutorModule, RenderModule, UpstreamModule, StreamModule],
    providers: [ExecutorGatewayService, ModelGatewayService, QueryGatewayService, RelationsGatewayService],
    controllers: [RelationsGatewayController],
    exports: [ExecutorGatewayService, ModelGatewayService, QueryGatewayService]
})
export class GatewayModule {}
