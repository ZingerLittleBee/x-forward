import { Module } from '@nestjs/common'
import { ExecutorModule } from '@x-forward/executor'
import { GrpcHelperModule } from '../grpc-helper/grpc-helper.module'
import { RegisterService } from './register.service'

@Module({
    imports: [
        GrpcHelperModule,
        // HttpModule.registerAsync({
        //     useFactory: () => {
        //         return {
        //             baseURL: getEnvSetting(EnvKeyEnum.ServerUrl),
        //             headers: {
        //                 [EnvKeyEnum.CommunicationKey]: getEnvSetting(EnvKeyEnum.CommunicationKey)
        //             },
        //             timeout: 5000,
        //             maxRedirects: 5
        //         }
        //     }
        // }),
        ExecutorModule
    ],
    providers: [RegisterService],
    exports: [RegisterService]
})
export class RegisterModule {}
