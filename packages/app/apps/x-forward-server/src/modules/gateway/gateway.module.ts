import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ExecutorModule } from '@x-forward/executor'
import { RenderModule } from '@x-forward/render'
import { ClientModule } from '../client/client.module'
import { ClientProfile } from '../client/client.profile'
import { StreamModule } from '../stream/stream.module'
import { UpstreamModule } from '../upstream/upstream.module'
import { ClientGatewayController } from './client-gateway.controller'
import { ClientGatewayService } from './services/client-gateway.service'
import { ExecutorGatewayService } from './services/executor-gateway.service'
import { ModelGatewayService } from './services/model-gateway.service'
import { QueryGatewayService } from './services/query-gateway.service'

@Module({
    imports: [ExecutorModule, HttpModule, RenderModule, UpstreamModule, StreamModule, ClientModule],
    providers: [ExecutorGatewayService, ModelGatewayService, QueryGatewayService, ClientGatewayService, ClientProfile],
    controllers: [ClientGatewayController],
    exports: [ExecutorGatewayService, ModelGatewayService, QueryGatewayService, ClientGatewayService]
})
export class GatewayModule {}
