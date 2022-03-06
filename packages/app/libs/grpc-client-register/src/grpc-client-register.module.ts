import { DynamicModule, Module } from '@nestjs/common'
import { GrpcOptions } from '@nestjs/microservices'
import { GRPC_CLIENT_REGISTER_OPTIONS } from './constants'
import { GrpcClientRegisterService } from './grpc-client-register.service'

export interface GrpcClientRegisterOptions {
    protoName: string
    protoPath: string
    serviceName: string
    grpcOptions?: GrpcOptions
}

@Module({})
export class GrpcClientRegisterModule {
    static register(options: GrpcClientRegisterOptions): DynamicModule {
        return {
            module: GrpcClientRegisterModule,
            providers: [
                {
                    provide: GRPC_CLIENT_REGISTER_OPTIONS,
                    useValue: options
                },
                GrpcClientRegisterService
            ],
            exports: [GrpcClientRegisterService]
        }
    }
}
