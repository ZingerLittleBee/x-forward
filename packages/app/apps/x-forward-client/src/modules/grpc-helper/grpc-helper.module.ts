import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { EnvKeyEnum, getEnvSetting } from '@x-forward/common'
import { GrpcHelperService } from './grpc-helper.service'

@Module({
    imports: [
        ClientsModule.registerAsync([
            {
                name: 'REPORT_PACKAGE',
                useFactory: () => {
                    return {
                        name: 'REPORT_PACKAGE',
                        transport: Transport.GRPC,
                        options: {
                            package: 'report',
                            protoPath: `${process.cwd()}/protos/report.proto`,
                            // https://github.com/grpc/grpc/issues/11411
                            channelOptions: {
                                max_reconnect_backoff_ms: 1000,
                                initial_reconnect_backoff_ms: 1000
                            },
                            url: `${getEnvSetting(EnvKeyEnum.ServerAddr)}:${getEnvSetting(EnvKeyEnum.ServerGrpcPort)}`
                        }
                    }
                }
            }
        ])
    ],
    providers: [GrpcHelperService],
    exports: [GrpcHelperService]
})
export class GrpcHelperModule {}
