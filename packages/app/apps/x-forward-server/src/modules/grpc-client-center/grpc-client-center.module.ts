import { Module } from '@nestjs/common'
import { GrpcClientRegisterModule } from '@x-forward/grpc-client-register/grpc-client-register.module'
import { ClientModule } from '../client/client.module'
import { GrpcClientCenterService } from './grpc-client-center.service'

@Module({
    imports: [
        GrpcClientRegisterModule.register({
            protoName: 'executor',
            protoPath: `${process.cwd()}/protos/executor.proto`,
            serviceName: 'ExecutorService'
        }),
        ClientModule
    ],
    providers: [GrpcClientCenterService],
    exports: [GrpcClientCenterService]
})
export class GrpcClientCenterModule {}
