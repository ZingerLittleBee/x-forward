import { HttpModule } from '@nestjs/axios'
import { Module } from '@nestjs/common'
import { ExecutorModule } from '@x-forward/executor'
import { RenderModule } from '@x-forward/render'
import { ClientModule } from '../client/client.module'
import { ClientProfile } from '../client/client.profile'
import { LogsModule } from '../logs/logs.module'
import { StreamModule } from '../stream/stream.module'
import { UpstreamModule } from '../upstream/upstream.module'
import { ClientGatewayController } from './controllers/client-gateway.controller'
import { LogsGatewayController } from './controllers/logs-gateway.controller'
import { ClientGatewayService } from './services/client-gateway.service'
import { ExecutorGatewayService } from './services/executor-gateway.service'
import { LogsGatewayService } from './services/logs-gateway.service'
import { ModelGatewayService } from './services/model-gateway.service'
import { QueryGatewayService } from './services/query-gateway.service'
import { GrpcClientRegisterModule } from '../../../../../libs/grpc-client-register/grpc-client-register.module'
import { TestGatewayController } from './controllers/test-gateway.controller'

@Module({
    imports: [
        GrpcClientRegisterModule.register({
            protoName: 'executor',
            protoPath: `${process.cwd()}/protos/executor.proto`,
            serviceName: 'ExecutorService'
        }),
        ExecutorModule,
        HttpModule,
        RenderModule,
        UpstreamModule,
        StreamModule,
        ClientModule,
        LogsModule
    ],
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
