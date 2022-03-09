import { Module } from '@nestjs/common'
import { ClientsModule, Transport } from '@nestjs/microservices'
import { EnvKeyEnum } from '@x-forward/common'
import { getEnvSetting } from '@x-forward/common/utils/env.utils'
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
                    url: `${getEnvSetting(EnvKeyEnum.ServerAddr)}:${getEnvSetting(EnvKeyEnum.ServerGrpcPort)}`
                }
            }
        ])
    ],
    providers: [GrpcHelperService],
    exports: [GrpcHelperService]
})
export class GrpcHelperModule {}
