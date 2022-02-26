import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { GrpcHelperService } from './grpc-helper.service'

@Module({
    imports: [
        ClientsModule.register([
            {
                name: 'REPORT_PACKAGE',
                transport: Transport.GRPC,
                options: {
                    package: 'report',
                    protoPath: `${process.cwd()}/protos/report.proto`,
                    url: 'localhost:3001'
                }
            }
        ])
    ],
    providers: [GrpcHelperService],
    exports: [GrpcHelperService]
})
export class GrpcHelperModule {}
