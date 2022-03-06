import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { RenderModule } from '@x-forward/render'
import { ClientModule } from '../client/client.module'
import { ClientProfile } from '../client/client.profile'
import { GrpcClientCenterModule } from '../grpc-client-center/grpc-client-center.module'
import { LogsModule } from '../logs/logs.module'
import { StreamModule } from '../stream/stream.module'
import { UpstreamModule } from '../upstream/upstream.module'
import { ClientGatewayController } from './controllers/client-gateway.controller'
import { LogsGatewayController } from './controllers/logs-gateway.controller'
import { TestGatewayController } from './controllers/test-gateway.controller'
import { ClientGatewayService } from './services/client-gateway.service'
import { ExecutorGatewayService } from './services/executor-gateway.service'
import { LogsGatewayService } from './services/logs-gateway.service'
import { ModelGatewayService } from './services/model-gateway.service'
import { QueryGatewayService } from './services/query-gateway.service'

@Module({
    imports: [GrpcClientCenterModule, HttpModule, RenderModule, UpstreamModule, StreamModule, ClientModule, LogsModule],
    providers: [
        ExecutorGatewayService,
        ModelGatewayService,
        QueryGatewayService,
        ClientGatewayService,
        ClientProfile,
        LogsGatewayService
    ],
    controllers: [ClientGatewayController, LogsGatewayController, TestGatewayController],
    exports: [
        ExecutorGatewayService,
        ModelGatewayService,
        QueryGatewayService,
        ClientGatewayService,
        LogsGatewayService
    ]
})
export class GatewayModule {}
