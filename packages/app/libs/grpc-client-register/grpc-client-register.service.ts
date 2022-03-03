import { Inject, Injectable } from '@nestjs/common'
import { loadPackageDefinition, credentials } from '@grpc/grpc-js'
import { loadSync } from '@grpc/proto-loader'
import { GRPC_CLIENT_REGISTER_OPTIONS } from './constants'

@Injectable()
export class GrpcClientRegisterService<T> {
    constructor(@Inject(GRPC_CLIENT_REGISTER_OPTIONS) private options) {
        const packageDefinition = loadSync(options.protoPath, options.protoOptions)
        this.proto = loadPackageDefinition(packageDefinition)[options.protoName]
    }

    private readonly proto

    connectClient(url: string): T {
        return new this.proto[this.options.serviceName](url, credentials.createInsecure())
    }
}
