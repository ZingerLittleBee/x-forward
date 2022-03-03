import { DynamicModule, Module } from '@nestjs/common'
import { GrpcClientRegisterService } from './grpc-client-register.service'
import type { Options } from '@grpc/proto-loader'
import { GRPC_CLIENT_REGISTER_OPTIONS } from './constants'

export interface GrpcClientRegisterOptions {
    protoName: string
    protoPath: string
    serviceName: string
    protoOptions?: Options
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

